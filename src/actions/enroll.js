'use server';

import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

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

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Enrollment error:', error);
    return { success: false, error: 'Failed to save enrollment.' };
  }
}

export async function checkEnrollmentStatus(courseId) {
  const { userId } = await auth();
  if (!userId) return { enrolled: false };

  try {
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single();
    
    return { enrolled: !!data };
  } catch (error) {
    return { enrolled: false };
  }
}

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function temporaryDirectEnroll(courseId, paymentId, amount) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: 'Not logged in' };

  try {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          payment_id: paymentId,
          payment_method: 'razorpay',
          amount: amount,
          status: 'active'
        }
      ]);

    if (error) {
      if (error.code === '23505') {
        return { success: true }; // Already enrolled
      }
      throw error;
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('Temporary direct enroll failed:', err);
    return { success: false, error: err.message };
  }
}
