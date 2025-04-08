export async function handler(event, context) {
  const data = JSON.parse(event.body || '{}');

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": process.env.POSTMARK_API_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      From: "bookings@ridelux.ca",
      To: "bookings@ridelux.ca",
      Subject: "New Booking Submitted",
      HtmlBody: `
        <h3>New Booking</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Pickup:</strong> ${data.pickup}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Destination:</strong> ${data.destination}</p>
        <p><strong>Distance:</strong> ${data.distance}</p>
        <p><strong>Price:</strong> ${data.price}</p>
      `
    })
  });

  const text = await response.text();

  return {
    statusCode: response.status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: text
  };
}
