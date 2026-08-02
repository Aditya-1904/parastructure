import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import coursesData from '@/data/courses';

export async function GET() {
  const courses = Object.values(coursesData);
  let successCount = 0;
  let errors = [];

  for (const course of courses) {
    const { id, isPublished, title, shortTitle, image, tagline, description, duration, hours, sessions, level, mode, price, originalPrice, seatsLeft, rating, reviews, instructor, prerequisites, syllabus } = course;
    
    // We package the extra fields (mechanicsComparison etc.) into syllabus or ignore them, 
    // but the schema supports the core fields.
    const { error } = await supabase.from('courses').upsert({
      id,
      is_published: isPublished,
      title,
      short_title: shortTitle,
      image,
      tagline,
      description,
      duration,
      hours,
      sessions,
      level,
      mode,
      price,
      original_price: originalPrice || price,
      seats_left: seatsLeft || 0,
      rating,
      reviews,
      instructor,
      prerequisites,
      syllabus
    }, { onConflict: 'id' });

    if (error) {
      errors.push({ id, message: error.message, details: error.details, hint: error.hint });
    } else {
      successCount++;
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ success: false, message: 'Some errors occurred', errors });
  }

  return NextResponse.json({ success: true, message: `Successfully seeded ${successCount} courses into the database!` });
}
