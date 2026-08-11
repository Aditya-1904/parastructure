import { GoogleGenerativeAI } from '@google/generative-ai';
import { generalKnowledge } from '@/data/chatbotKnowledge';
import { getAllCourses } from '@/data/courses';

export async function POST(request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY?.trim();
    if (!apiKey || apiKey === 'dummy_key') {
      console.error("GOOGLE_API_KEY is not set in the environment variables.");
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const { message, pathname } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch dynamic published courses
    const publishedCourses = await getAllCourses();
    const dynamicCourseContext = publishedCourses.map(c => `
- Course: ${c.title}
  Price: ₹${c.price} (${c.emiMonths} months EMI available)
  Duration: ${c.duration}, ${c.hours}, ${c.sessions}
  Tools: ${c.tools?.join(', ') || ''}
  Description: ${c.description}
`).join('\n');

    const fullContext = `
ParaStructure offers the following published live cohorts:
${dynamicCourseContext}
${generalKnowledge}
`;

    // We use gemini-flash-latest for very fast, cost-effective responses
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    let pageContext = "";
    if (pathname) {
      pageContext = `The user is currently on this page on our website: ${pathname}. Use this context to tailor your response if relevant.`;
    }

    const prompt = `
You are the ParaStructure assistant. You ONLY answer questions about ParaStructure's courses, pricing, and details based on the provided context.
You MUST REFUSE to answer any general engineering questions, calculations, or code problems (e.g., if asked "design an RCC bridge for me" or "what is the formula for shear", refuse it).
If asked anything outside of the provided context, reply exactly: "I am only equipped to answer questions about our engineering courses."
Keep your answers extremely concise, ideally under 30 words.
Do not make up any information.
Use Markdown for formatting if necessary (like bolding or lists).
${pageContext}

Context:
${fullContext}

User Question: ${message}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
