const apiKey = process.env.GOOGLE_API_KEY?.trim();
console.log("Key starts with:", apiKey ? apiKey.substring(0, 5) : "undefined");

async function run() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log("Models:", data.models ? data.models.map(m => m.name).join(', ') : data);
  } catch (error) {
    console.error("Error:", error);
  }
}
run();
