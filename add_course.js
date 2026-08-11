const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
    if (key) env[key] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const newCourse = {
    id: 'industrial-steel',
    is_published: true,
    title: 'Industrial Steel Building Design Program',
    short_title: 'Industrial Steel',
    image: '/course_steel.png',
    tagline: 'Learn how industrial steel buildings are designed in professional consultancy firms through a comprehensive program that combines engineering principles, Indian design standards, practical design exercises, and a complete real-world project.',
    description: "A civil engineering degree may help you get shortlisted, but practical design skills are what get you hired. Today, industries across India are rapidly expanding with new factories, warehouses, manufacturing plants, and logistics facilities, creating a growing demand for structural engineers who can design safe and economical steel buildings.\n\nThis program is designed to bridge the gap between classroom learning and real consultancy work in just 3–4 months. Instead of focusing on theory alone, you'll follow the complete workflow used by professional structural engineers on live projects.\n\n[Study Project Drawings] → [Build STAAD Model] → [Design Steel Members] → [Prepare Connection Details]\n\nWorking on a complete industrial building project from scratch, you'll learn how to interpret client drawings, create a structural analysis model, apply design loads, design primary and secondary steel members as per Indian Standards, optimize the structure, and prepare practical connection details and structural drawings.\n\nBy the end of the program, you'll have a complete industry-style project that demonstrates your design capabilities and strengthens your portfolio for interviews. More importantly, you'll develop the confidence to understand consultancy workflows and take on real-world industrial steel building projects.",
    duration: '4 Months',
    hours: '60+ Hours',
    sessions: '32 Live Sessions',
    level: 'Intermediate',
    mode: 'Online Live',
    price: 34999,
    original_price: 39999
  };

  const { data, error } = await supabase.from('courses').upsert(newCourse).select();
  if (error) {
    console.error('Error adding course:', error);
  } else {
    console.log('Course added successfully:', data);
  }
}
main();
