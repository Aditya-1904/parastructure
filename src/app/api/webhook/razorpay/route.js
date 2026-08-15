import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    if (!signature) {
      console.error('Missing signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle successful payments
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const order = event.payload.order?.entity || {};
      const payment = event.payload.payment?.entity || {};
      
      const courseId = order.notes?.courseId || payment.notes?.course;
      const userId = order.notes?.userId;

      if (!courseId || !userId) {
        console.error('Missing courseId or userId in webhook notes');
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      // Check if already enrolled to avoid duplicate insert errors gracefully
      const { data: existing } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();
        
      if (existing) {
        console.log(`User ${userId} already enrolled in ${courseId}`);
        return NextResponse.json({ status: 'ok', message: 'Already enrolled' });
      }

      // Insert enrollment using supabaseAdmin
      const { error } = await supabaseAdmin
        .from('enrollments')
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            payment_id: payment.id || order.receipt,
            payment_method: 'razorpay',
            amount: (payment.amount || order.amount) / 100,
            status: 'active'
          }
        ]);

      if (error) {
        console.error('Failed to save enrollment via webhook:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      
      console.log(`✅ Webhook successfully enrolled user ${userId} in course ${courseId}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
