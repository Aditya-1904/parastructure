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
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('List Error:', listError);
    return;
  }
  console.log('Buckets:', buckets.map(b => b.name));

  const hasCourseResources = buckets?.some(b => b.name === 'course_resources');
  if (!hasCourseResources) {
    console.log('Creating course_resources bucket...');
    const { data, error } = await supabase.storage.createBucket('course_resources', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    if (error) console.error('Error creating bucket:', error);
    else console.log('Bucket created successfully:', data);
  } else {
    console.log('course_resources bucket already exists.');
    console.log('Updating bucket to be public...');
    const { data, error } = await supabase.storage.updateBucket('course_resources', {
      public: true,
      fileSizeLimit: 52428800,
    });
    if (error) console.error('Error updating bucket:', error);
    else console.log('Bucket updated successfully.');
  }
}
main();
