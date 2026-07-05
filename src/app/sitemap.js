import { getAllCourses } from '@/data/courses';

export default function sitemap() {
  const baseUrl = 'https://www.parastructure.com';

  // Get all dynamically published courses
  const courses = getAllCourses();
  
  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...courseUrls];
}
