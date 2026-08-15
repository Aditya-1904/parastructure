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
You are the ParaStructure assistant. Your primary goal is to answer questions about ParaStructure's courses, pricing, and details based on the provided context.
If a user asks a general engineering question (e.g., about RCC, Steel, bridges, or software like STAAD/MIDAS), you CAN answer it briefly and helpfully to demonstrate expertise. However, you must always elegantly steer the conversation back to how our relevant courses can help them master these topics.
Do not write long calculations, perform complex designs, or write code.
If a question is completely unrelated to engineering or our courses, politely refuse.
Keep your answers concise, ideally under 40-50 words.
Do not make up any course information, pricing, or duration that isn't in the Context.
Use Markdown for formatting if necessary (like bolding or lists).
${pageContext}

Context:
${fullContext}

User Question: ${message}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Check if the response was blocked by safety filters
    if (response.promptFeedback && response.promptFeedback.blockReason) {
       return new Response(JSON.stringify({ reply: "I'm sorry, I cannot discuss that topic." }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = response.text();

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    let userFriendlyError = 'I encountered an error. Please try again later.';
    
    // Check for rate limiting
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
       userFriendlyError = 'I am receiving too many requests right now. Please wait a moment and try again.';
    }

    return new Response(JSON.stringify({ error: userFriendlyError }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
