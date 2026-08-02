'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * Shared server action to sort all modules in a course chronologically
 * by date_string / created_at and reassign sequential order_index (1, 2, 3...)
 * Follows DRY principle: used by AdminContentPage buttons and Bulk Importers.
 */
export async function sortCourseModulesByDate(courseId) {
  if (!courseId) return { success: false, error: 'No course ID provided' };

  const { data: mods, error } = await supabase
    .from('course_modules')
    .select('id, date_string, created_at, order_index')
    .eq('course_id', courseId);
    
  if (error || !mods || mods.length === 0) {
    return { success: false, error: error?.message || 'No modules found' };
  }

  // Sort chronologically by date_string or created_at
  mods.sort((a, b) => {
    const dateA = new Date(a.date_string || a.created_at).getTime();
    const dateB = new Date(b.date_string || b.created_at).getTime();
    if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
      return dateA - dateB;
    }
    return (a.order_index || 0) - (b.order_index || 0);
  });

  // Reassign sequential order_index 1, 2, 3...
  for (let i = 0; i < mods.length; i++) {
    await supabase
      .from('course_modules')
      .update({ order_index: i + 1 })
      .eq('id', mods[i].id);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function sortCourseModulesByDateAction(formData) {
  'use server';
  const courseId = formData.get('course_id');
  await sortCourseModulesByDate(courseId);
}

export async function saveModuleAction(formData) {
  'use server';
  const courseId = formData.get('course_id');
  const moduleId = formData.get('module_id');
  
  if (!courseId) {
    throw new Error('Course ID is missing');
  }

  let resource_link = formData.get('existing_resource_link') || null;
  const file = formData.get('resource_file');
  
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from('course_resources')
      .upload(fileName, file, { upsert: true });
      
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('course_resources')
        .getPublicUrl(fileName);
      resource_link = publicUrlData.publicUrl;
    } else {
      console.error('File upload failed:', uploadError);
    }
  } else if (formData.get('resource_link_url')) {
    resource_link = formData.get('resource_link_url');
  }

  // Get current max order_index if new module
  let order_index = parseInt(formData.get('order_index'), 10);
  if (isNaN(order_index) || !order_index) {
    const { data: existing } = await supabase
      .from('course_modules')
      .select('order_index')
      .eq('course_id', courseId);
    order_index = (existing && existing.length > 0) 
      ? Math.max(...existing.map(m => m.order_index || 0)) + 1 
      : 1;
  }

  const date_val = formData.get('date_string');
  const payload = {
    course_id: courseId,
    title: formData.get('title')?.trim() || 'Untitled Module',
    date_string: (date_val && date_val.trim() !== '') ? date_val.trim() : 'TBA',
    status: (formData.get('status') || 'upcoming') === 'auto' ? 'upcoming' : (formData.get('status') || 'upcoming'),
    type: formData.get('type') || 'lecture',
    meeting_link: formData.get('meeting_link')?.trim() || null,
    recording_link: formData.get('recording_link')?.trim() || null,
    resource_link: resource_link,
    order_index: order_index,
    instructor_name: formData.get('instructor_name')?.trim() || null,
    instructor_role: formData.get('instructor_role')?.trim() || null,
    topics: formData.get('topics')?.trim() || null,
  };

  if (moduleId) {
    const { error } = await supabase.from('course_modules').update(payload).eq('id', moduleId);
    if (error) {
      console.error('Update failed:', error);
      throw new Error(`Failed to update module: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from('course_modules').insert(payload);
    if (error) {
      console.error('Insert failed:', error);
      throw new Error(`Failed to insert module: ${error.message}`);
    }
  }
  
  // Automatically sort modules chronologically by date after save!
  await sortCourseModulesByDate(courseId);

  revalidatePath('/', 'layout');
  
  const { redirect } = await import('next/navigation');
  redirect(`/admin/content?course=${courseId}`);
}

export async function deleteModuleAction(formData) {
  'use server';
  const id = formData.get('id');
  const courseId = formData.get('course_id');
  if (!id) return;
  const { error } = await supabase.from('course_modules').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete module:', error);
  } else if (courseId) {
    await sortCourseModulesByDate(courseId);
  }
  revalidatePath('/', 'layout');
}

export async function moveModuleAction(formData) {
  'use server';
  const id = formData.get('id');
  const courseId = formData.get('course_id');
  const direction = formData.get('direction');
  
  const { data: mods } = await supabase
    .from('course_modules')
    .select('id, order_index, created_at')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });
    
  if (!mods) return;
  
  const currentIndex = mods.findIndex(m => m.id === id);
  if (currentIndex === -1) return;
  
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= mods.length) return; 
  
  const currentMod = mods[currentIndex];
  const targetMod = mods[targetIndex];
  
  let newCurrentOrder = targetMod.order_index;
  let newTargetOrder = currentMod.order_index;
  if (newCurrentOrder === newTargetOrder) {
     newCurrentOrder = direction === 'up' ? newTargetOrder - 1 : newTargetOrder + 1;
  }

  await supabase.from('course_modules').update({ order_index: newCurrentOrder }).eq('id', currentMod.id);
  await supabase.from('course_modules').update({ order_index: newTargetOrder }).eq('id', targetMod.id);
  
  revalidatePath('/', 'layout');
}

export async function clearAllCourseModulesAction(formData) {
  'use server';
  const courseId = formData.get('course_id');
  if (!courseId) return;
  const { error } = await supabase.from('course_modules').delete().eq('course_id', courseId);
  if (error) {
    console.error('Failed to clear modules:', error);
  } else {
    revalidatePath('/', 'layout');
  }
}

export async function toggleLockAction(formData) {
  'use server';
  const id = formData.get('id');
  const courseId = formData.get('course_id');
  const currentStatus = formData.get('current_status');
  if (!id) return;
  
  let newStatus = formData.get('new_status') || (currentStatus === 'locked' ? 'upcoming' : 'locked');
  
  // If the client sent 'auto', remap it to 'upcoming' to satisfy the DB constraint
  if (newStatus === 'auto') newStatus = 'upcoming';
  
  const { error } = await supabase.from('course_modules').update({ status: newStatus }).eq('id', id);
  if (error) {
    console.error('Failed to toggle lock status:', error);
    return { success: false, error: error.message };
  } else {
    revalidatePath('/', 'layout');
    return { success: true };
  }
}
