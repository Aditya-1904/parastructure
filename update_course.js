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
  const { data, error } = await supabase
    .from('courses')
    .update({
      description: 'Learn how industrial steel buildings are designed in professional consultancy firms through a comprehensive program that combines engineering principles, Indian design standards, practical design exercises, and a complete real-world project.'
    })
    .eq('id', 'industrial-steel')
    .select();

  if (error) {
    console.error('Error updating course:', error);
  } else {
    console.log('Course description updated successfully:', data);
  }
}
main();
