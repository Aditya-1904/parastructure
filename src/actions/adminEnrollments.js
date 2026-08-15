'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Create a service-role client to bypass Row Level Security for admin actions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function approveEnrollmentAction(formData) {
  const id = formData.get('id');
  const { error: updateError } = await supabaseAdmin
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

export async function revokeEnrollmentAction(formData) {
  const id = formData.get('id');
  const { error: updateError } = await supabaseAdmin
    .from('enrollments')
    .update({ status: 'revoked' })
    .eq('id', id);
    
  if (updateError) {
    console.error("Failed to revoke:", updateError);
    return { success: false, error: updateError.message };
  } else {
    revalidatePath('/', 'layout');
    return { success: true };
  }
}

export async function deleteEnrollmentAction(formData) {
  const id = formData.get('id');
  const { error: deleteError } = await supabaseAdmin
    .from('enrollments')
    .delete()
    .eq('id', id);
    
  if (deleteError) {
    console.error("Failed to delete:", deleteError);
    return { success: false, error: deleteError.message };
  } else {
    revalidatePath('/', 'layout');
    return { success: true };
  }
}
