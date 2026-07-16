'use server';

import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function enrollUserInCourse(courseId, paymentId, paymentMethod, amount) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'User is not logged in.' };
  }

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          payment_id: paymentId,
          payment_method: paymentMethod,
          amount: amount,
          status: paymentMethod === 'bank' ? 'pending_verification' : 'active'
        }
      ]);

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'You are already enrolled in this course.' };
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Enrollment error:', error);
    return { success: false, error: 'Failed to save enrollment.' };
  }
}
