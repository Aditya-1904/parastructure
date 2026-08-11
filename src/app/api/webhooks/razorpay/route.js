import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const textBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing Razorpay signature' }, { status: 400 });
    }

    // Verify the signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(textBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the payload now that it's verified
    const payload = JSON.parse(textBody);
    const event = payload.event;

    // We listen for payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      
      // Extract notes that we passed during order creation
      const courseId = paymentEntity.notes?.courseId;
      const userId = paymentEntity.notes?.userId;
      const paymentId = paymentEntity.id;
      const amount = paymentEntity.amount / 100; // Convert paise to rupees

      if (!courseId || !userId) {
        console.error('Missing courseId or userId in payment notes', paymentEntity.notes);
        return NextResponse.json({ error: 'Missing metadata in notes' }, { status: 400 });
      }

      // Check if enrollment already exists to prevent duplicates
      const { data: existing } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (!existing) {
        // Automatically enroll the user with 'active' status
        const { error: insertError } = await supabaseAdmin
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

        if (insertError) {
          console.error('Error inserting enrollment:', insertError);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        console.log(`Successfully enrolled user ${userId} in course ${courseId}`);
      } else {
        console.log(`User ${userId} already enrolled in course ${courseId}. Updating payment_id if necessary.`);
      }
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
