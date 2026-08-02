'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { sortCourseModulesByDate } from '@/actions/adminModules';

export async function bulkImportCoursesAction(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return { success: false, error: `Invalid JSON syntax: ${err.message}` };
  }

  const items = Array.isArray(parsed) ? parsed : (parsed.courses || [parsed]);
  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'No course objects found in JSON.' };
  }

  let coursesCount = 0;
  let modulesCount = 0;
  let questionsCount = 0;

  try {
    for (const c of items) {
      if (!c.id || !c.title) {
        continue; // Course must have at least id and title
      }

      const coursePayload = {
        id: c.id.trim(),
        title: c.title.trim(),
        short_title: c.short_title || c.shortTitle || c.title.trim(),
        tagline: c.tagline || 'Master practical engineering skills.',
        description: c.description || 'A comprehensive structural engineering program.',
        price: c.price !== undefined ? Number(c.price) : 49999,
        original_price: c.original_price || c.originalPrice || (c.price !== undefined ? Number(c.price) : 49999),
        level: c.level || 'All Levels',
        mode: c.mode || 'Online Live',
        duration: c.duration || 'Self-paced',
        hours: c.hours || '20+ Hours',
        sessions: c.sessions || 'Live & Recorded',
        seats_left: c.seats_left !== undefined ? Number(c.seats_left) : 40,
        rating: c.rating || 5,
        reviews: c.reviews || 12,
        instructor: c.instructor || 'Parastructure Faculty',
        is_published: c.is_published !== undefined ? Boolean(c.is_published) : (c.isPublished !== undefined ? Boolean(c.isPublished) : true),
      };

      // Upsert course
      const { error: courseErr } = await supabase
        .from('courses')
        .upsert(coursePayload, { onConflict: 'id' });

      if (courseErr) {
        console.error(`Failed to upsert course ${c.id}:`, courseErr);
        continue;
      }

      coursesCount++;

      // Process modules if provided
      if (Array.isArray(c.modules)) {
        for (let idx = 0; idx < c.modules.length; idx++) {
          const m = c.modules[idx];
          if (!m.title) continue;

          const modPayload = {
            course_id: c.id.trim(),
            title: m.title.trim(),
            date_string: m.date_string || m.dateString || 'TBA',
            status: m.status || 'upcoming',
            type: m.type || 'lecture',
            meeting_link: m.meeting_link || m.meetingLink || null,
            recording_link: m.recording_link || m.recordingLink || null,
            resource_link: m.resource_link || m.resourceLink || null,
            order_index: m.order_index !== undefined ? m.order_index : idx,
          };

          // If module has explicit id, upsert by id; otherwise check by title
          let insertedModId = null;
          if (m.id) {
            const { data: upsertedMod, error: mErr } = await supabase
              .from('course_modules')
              .upsert({ id: m.id, ...modPayload }, { onConflict: 'id' })
              .select('id')
              .single();
            if (!mErr && upsertedMod) {
              insertedModId = upsertedMod.id;
              modulesCount++;
            }
          } else {
            // Check if title already exists in this course to avoid duplicates
            const { data: existingMods } = await supabase
              .from('course_modules')
              .select('id')
              .eq('course_id', c.id.trim())
              .eq('title', m.title.trim());

            if (existingMods && existingMods.length > 0) {
              // Update existing
              const { error: updErr } = await supabase
                .from('course_modules')
                .update(modPayload)
                .eq('id', existingMods[0].id);
              if (!updErr) {
                insertedModId = existingMods[0].id;
                modulesCount++;
              }
            } else {
              // Insert new
              const { data: newMod, error: insErr } = await supabase
                .from('course_modules')
                .insert(modPayload)
                .select('id')
                .single();
              if (!insErr && newMod) {
                insertedModId = newMod.id;
                modulesCount++;
              }
            }
          }

          // Process questions if assignment
          if (insertedModId && modPayload.type === 'assignment' && Array.isArray(m.questions)) {
            for (const q of m.questions) {
              if (!q.question_text || !Array.isArray(q.options) || q.options.length < 2) continue;
              const qPayload = {
                module_id: insertedModId,
                question_text: q.question_text.trim(),
                options: q.options.map(opt => String(opt).trim()),
                correct_option_index: parseInt(q.correct_option_index || 0, 10),
              };
              const { error: qErr } = await supabase.from('assignment_questions').insert(qPayload);
              if (!qErr) questionsCount++;
            }
          }
        }
        // Automatically sort modules chronologically for this course
        await sortCourseModulesByDate(c.id.trim());
      }
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: `Global Import Complete! Processed ${coursesCount} courses, ${modulesCount} modules, and ${questionsCount} MCQ questions (modules automatically sorted chronologically).`,
    };
  } catch (error) {
    console.error('Bulk course import error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during import.' };
  }
}
