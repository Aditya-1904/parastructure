'use server';

import Razorpay from 'razorpay';
import { getCourse } from '@/data/courses';
import { PAYMENT_CONFIG } from '@/config/payment';
import { auth } from '@clerk/nextjs/server';

export async function createRazorpayOrder(courseId) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Authentication required' };
  }

  // 1. Fetch real price from database securely
  const course = await getCourse(courseId);
  if (!course) {
    return { success: false, error: 'Course not found' };
  }

  // Check if keys exist in env. If not, return explicit error for fallback handling.
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return { success: false, error: 'PAYMENT_GATEWAY_NOT_CONFIGURED' };
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: course.price * 100, // strictly calculated on the server
      currency: PAYMENT_CONFIG.currency || 'INR',
      receipt: `receipt_${courseId}_${userId.substring(0,8)}`,
      notes: {
        courseId: courseId,
        userId: userId
      }
    };

    const order = await instance.orders.create(options);
    return { success: true, orderId: order.id, amount: options.amount };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error: 'Failed to create payment order' };
  }
}
