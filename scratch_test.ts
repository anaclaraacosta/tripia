async function test() {
  const url = "https://source.unsplash.com/1200x800/?Paris,travel,city";
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log("Status:", res.status);
    console.log("OK:", res.ok);
    console.log("URL:", res.url);
  } catch (err) {
    console.error("Error:", err);
  }

  const badUrl = "https://source.unsplash.com/1200x800/?NonExistentCity12345,travel,city";
  try {
    const res = await fetch(badUrl, { method: 'HEAD' });
    console.log("Bad Status:", res.status);
    console.log("Bad OK:", res.ok);
    console.log("Bad URL:", res.url);
  } catch (err) {
    console.error("Bad Error:", err);
  }
}

test();
