'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function approveEnrollmentAction(formData) {
  const id = formData.get('id');
  const { error: updateError } = await supabase
    .from('enrollments')
    .update({ status: 'active' })
    .eq('id', id);
    
  if (updateError) {
    console.error("Failed to approve:", updateError);
    return { success: false, error: updateError.message };
  } else {
    revalidatePath('/', 'layout');
    return { success: true };
  }
}
