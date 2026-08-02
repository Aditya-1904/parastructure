import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Razorpay sends webhooks to notify us when a payment succeeds
export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify the signature securely
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    // Handle payment capture event
    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      
      const courseId = paymentEntity.notes?.courseId;
      const userId = paymentEntity.notes?.userId;
      const amount = paymentEntity.amount / 100; // convert paise back to rupees
      const paymentId = paymentEntity.id;

      if (!courseId || !userId) {
        console.error('Missing notes in payment entity');
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Securely enroll the user in the database
      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            payment_id: paymentId,
            payment_method: 'online',
            amount: amount,
            status: 'active'
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          console.log(`User ${userId} is already enrolled in ${courseId}. Ignoring duplicate webhook.`);
        } else {
          console.error('Database enrollment error:', error);
          throw error;
        }
      } else {
        console.log(`Successfully enrolled user ${userId} in ${courseId} via Webhook!`);
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
