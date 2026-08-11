import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return new NextResponse('Module ID is required', { status: 400 });
    }

    // Verify user enrollment or admin status
    // For now, if they reached here, they have access to the learning portal, 
    // but let's check admin role.
    let isAdmin = false;
    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (adminData) isAdmin = true;

    // Define user role/permissions for the video room
    const role = isAdmin ? 'instructor' : 'student';

    const JWT_SECRET = process.env.SHARED_VIDEO_APP_SECRET || 'dev_secret_replace_in_production';
    
    const payload = {
      userId: user.id,
      userName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student',
      classId: moduleId,
      role: role,
      permissions: {
        canPublish: true, // students can share audio/video/screen based on room rules
        canSubscribe: true,
        canPublishData: true, // for chat
        hidden: false,
      }
    };

    // Token expires in 5 minutes - they must use it immediately to join
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
    
    // Redirect to the video app with the token
    return NextResponse.redirect(`https://live.parastructure.com/room/${moduleId}?token=${token}`);
  } catch (error) {
    console.error('Error generating live class URL:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
