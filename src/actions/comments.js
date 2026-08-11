'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function deleteComment(commentId, authorId) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  const isAdmin = sessionClaims?.metadata?.role === 'admin' || userId === process.env.NEXT_PUBLIC_ADMIN_CLERK_ID;

  if (!isAdmin && userId !== authorId) {
    return { success: false, error: 'You do not have permission to delete this comment.' };
  }

  const { error } = await supabaseAdmin
    .from('module_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function postComment(payload) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Unauthorized' };

  // Ensure the user can only post as themselves
  if (payload.user_id !== userId) {
    return { success: false, error: 'Invalid user ID mismatch.' };
  }

  const { data, error } = await supabaseAdmin
    .from('module_comments')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error posting comment:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
