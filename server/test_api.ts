import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function testPost() {
  try {
    const res = await fetch('http://localhost:8787/api/ai/generate-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: "Montevideo",
        destination: "Madrid",
        startDate: "2026-06-01",
        endDate: "2026-06-05",
        tripType: "solo",
        travelersCount: 1,
        budgetLevel: "Moderate",
        preferences: "architecture, museums"
      })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testPost();
