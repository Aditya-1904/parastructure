'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { sortCourseModulesByDate } from '@/actions/adminModules';

export async function bulkImportModulesAction(courseId, jsonString) {
  if (!courseId) {
    return { success: false, error: 'No course ID provided.' };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return { success: false, error: `Invalid JSON syntax: ${err.message}` };
  }

  // Normalize to array of modules
  const items = Array.isArray(parsed) ? parsed : (parsed.modules || [parsed]);
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'No module objects found in JSON.' };
  }

  try {
    // 1. Fetch existing modules for this course to determine matching and max order_index
    const { data: existingMods, error: fetchErr } = await supabase
      .from('course_modules')
      .select('id, title, order_index')
      .eq('course_id', courseId);

    if (fetchErr) {
      throw new Error(`Database error fetching modules: ${fetchErr.message}`);
    }

    let maxOrder = existingMods && existingMods.length > 0
      ? Math.max(...existingMods.map(m => m.order_index || 0))
      : -1;

    let addedCount = 0;
    let updatedCount = 0;
    let questionsCount = 0;

    for (const item of items) {
      if (!item.title || item.title.trim() === '') {
        continue; // Skip items without a title
      }

      // Check if module matches by explicit ID or exact Title match
      let matchedMod = null;
      if (item.id) {
        matchedMod = existingMods?.find(m => m.id === item.id);
      }
      if (!matchedMod && existingMods) {
        matchedMod = existingMods.find(
          m => m.title.trim().toLowerCase() === item.title.trim().toLowerCase()
        );
      }

      const payload = {
        course_id: courseId,
        title: item.title.trim(),
        date_string: item.date_string || 'TBA',
        status: item.status || 'upcoming',
        type: item.type || 'lecture',
        meeting_link: item.meeting_link || null,
        recording_link: item.recording_link || null,
        resource_link: item.resource_link || null,
      };

      let moduleIdToUse = null;

      if (matchedMod) {
        // UPDATE MODE
        const { error: updateErr } = await supabase
          .from('course_modules')
          .update(payload)
          .eq('id', matchedMod.id);

        if (updateErr) {
          console.error(`Failed to update module ${item.title}:`, updateErr);
        } else {
          updatedCount++;
          moduleIdToUse = matchedMod.id;
        }
      } else {
        // APPEND MODE
        maxOrder++;
        payload.order_index = item.order_index !== undefined ? item.order_index : maxOrder;

        const { data: insertedMod, error: insertErr } = await supabase
          .from('course_modules')
          .insert(payload)
          .select('id')
          .single();

        if (insertErr) {
          console.error(`Failed to insert module ${item.title}:`, insertErr);
          maxOrder--; // Revert increment if failed
        } else if (insertedMod) {
          addedCount++;
          moduleIdToUse = insertedMod.id;
          // Add to existingMods in memory in case subsequent items reference it
          existingMods.push({ id: insertedMod.id, title: payload.title, order_index: payload.order_index });
        }
      }

      // 2. Process questions if this is an assignment module
      if (moduleIdToUse && payload.type === 'assignment' && Array.isArray(item.questions)) {
        for (const q of item.questions) {
          if (!q.question_text || !Array.isArray(q.options) || q.options.length < 2) {
            continue;
          }

          const qPayload = {
            module_id: moduleIdToUse,
            question_text: q.question_text.trim(),
            options: q.options.map(opt => String(opt).trim()),
            correct_option_index: parseInt(q.correct_option_index || 0, 10),
          };

          const { error: qErr } = await supabase
            .from('assignment_questions')
            .insert(qPayload);

          if (!qErr) {
            questionsCount++;
          } else {
            console.error('Failed to insert question:', qErr);
          }
        }
      }
    }

    // Automatically sort by date and reassign sequential numbers S.No. 1, 2, 3...
    await sortCourseModulesByDate(courseId);

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: `Bulk Import Complete! Added ${addedCount} new modules, updated ${updatedCount} existing modules, and imported ${questionsCount} MCQ questions (automatically sorted chronologically).`,
    };
  } catch (error) {
    console.error('Bulk import action error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during import.' };
  }
}
