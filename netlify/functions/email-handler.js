// Import Postmark SDK
const postmark = require("postmark");

// Initialize Postmark client with your environment variable
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    console.error("❌ Invalid JSON:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const {
    name = "N/A",
    phone = "N/A",
    pickup = "N/A",
    pickupTime = "N/A",
    destination = "N/A",
    distance = "N/A",
    price = "N/A",
  } = data;

  try {
    const response = await client.sendEmail({
      From: "bookings@ridelux.ca",
      To: "bookings@ridelux.ca",
      Subject: "🚘 New RideLux Booking",
      HtmlBody: `
        <h2>📋 Booking Details</h2>
        <p><strong>Full Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>Pickup Location:</strong> ${pickup}</p>
        <p><strong>Pickup Time:</strong> ${pickupTime}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Estimated Distance:</strong> ${distance}</p>
        <p><strong>Estimated Price:</strong> ${price}</p>
        <hr/>
        <p>📬 This booking was submitted from the RideLux native app.</p>
      `,
      TextBody: `New Booking:\n
        Name: ${name}
        Phone: ${phone}
        Pickup: ${pickup}
        Time: ${pickupTime}
        Destination: ${destination}
        Distance: ${distance}
        Price: ${price}`,
    });

    console.log("✅ Email sent:", response);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Email failed to send", details: err.message }),
    };
  }
};
