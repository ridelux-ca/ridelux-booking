let autocompletePickup, autocompleteDestination;

function initAutocomplete() {
  autocompletePickup = new google.maps.places.Autocomplete(document.getElementById("pickup"));
  autocompleteDestination = new google.maps.places.Autocomplete(document.getElementById("destination"));
  autocompleteDestination.addListener("place_changed", () => calculateRoute());
}

function calculateRoute() {
  const origin = document.getElementById("pickup").value;
  const destination = document.getElementById("destination").value;
  if (!origin || !destination) return;

  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  }, (response, status) => {
    if (status === "OK") {
      const element = response.rows[0].elements[0];
      const distanceText = element.distance.text;
      const distanceVal = parseFloat(distanceText.replace(" km", ""));
      const price = (distanceVal * 2.2).toFixed(2);
      document.getElementById("distance").value = distanceText;
      document.getElementById("price").value = `$${price}`;
    }
  });
}

document.getElementById("booking-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    pickup: document.getElementById("pickup").value,
    time: document.getElementById("time").value,
    destination: document.getElementById("destination").value,
    distance: document.getElementById("distance").value,
    price: document.getElementById("price").value,
  };

  console.log("📨 Sending booking info...", formData);

  try {
    const res = await fetch("https://bookings.ridelux.ca/.netlify/functions/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const responseText = await res.text();
    console.log("📬 Email API response:", res.status, responseText);

    if (!res.ok) throw new Error("Failed to send email");

    alert("Your booking has been submitted!");
  } catch (err) {
    console.error("❌ Email send error:", err);
    alert("Booking sent, but email failed.");
  }

  window.location.href = "https://buy.stripe.com/cN2g2336Qbp26xW9AC";
});

window.onload = initAutocomplete;
