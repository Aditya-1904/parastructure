'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addCourseAction(formData) {
  // Auto-generate ID from short title if not provided (lowercase, spaces to dashes)
  let rawId = formData.get('id') || formData.get('short_title');
  const id = rawId.toString().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  const { error: insertError } = await supabase
    .from('courses')
    .insert({
      id: id,
      title: formData.get('title'),
      short_title: formData.get('short_title'),
      is_published: formData.get('is_published') === 'on',
      tagline: formData.get('tagline'),
      description: formData.get('description'),
      price: parseInt(formData.get('price') || '0', 10),
      original_price: parseInt(formData.get('original_price') || '0', 10) || parseInt(formData.get('price') || '0', 10),
      duration: formData.get('duration') || 'Self-paced',
      hours: formData.get('hours') || '10+ Hours',
      sessions: formData.get('sessions') || 'Recorded',
      level: formData.get('level') || 'Beginner',
      mode: formData.get('mode') || 'Online',
      image: formData.get('image') || '/course_rcc.png', // Default fallback image
    });
    
  if (insertError) {
    console.error('Failed to create course:', insertError);
    return { success: false, error: insertError.message };
  } else {
    revalidatePath('/', 'layout');
    return { success: true };
  }
}

export async function togglePublishAction(formData) {
  const id = formData.get('id');
  const isPublished = formData.get('is_published') === 'true';
  const newPublishedState = formData.has('new_status') ? formData.get('new_status') === 'true' : !isPublished;
  
  const { error: updateError } = await supabase
    .from('courses')
    .update({ is_published: newPublishedState })
    .eq('id', id);
    
  if (updateError) {
    console.error('Failed to update course:', updateError);
    return { success: false, error: updateError.message };
  } else {
    revalidatePath('/', 'layout');
    return { success: true };
  }
}
