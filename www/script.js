document.addEventListener('DOMContentLoaded', function () {
  const pickupInput = document.getElementById('pickup');
  const destinationInput = document.getElementById('destination');
  const distanceField = document.getElementById('distance');
  const priceField = document.getElementById('price');
  const form = document.querySelector('form');

  const stripePaymentUrl = "https://buy.stripe.com/cN2g2336Qbp26xW9AC";

  // Google Places Autocomplete
  const autocompletePickup = new google.maps.places.Autocomplete(pickupInput);
  const autocompleteDestination = new google.maps.places.Autocomplete(destinationInput);

  function calculateDistance() {
    const origin = pickupInput.value.trim();
    const destination = destinationInput.value.trim();

    if (!origin || !destination) return;

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC
    }, (response, status) => {
      if (status !== 'OK' || response.rows.length === 0 || response.rows[0].elements[0].status !== "OK") {
        alert("⚠️ Error calculating distance. Please check your locations.");
        return;
      }

      const element = response.rows[0].elements[0];
      const distanceKm = (element.distance.value / 1000).toFixed(1);
      const estimatedPrice = (distanceKm * 2.2).toFixed(2);

      distanceField.value = `${distanceKm} km`;
      priceField.value = `$${estimatedPrice}`;
    });
  }

  autocompletePickup.addListener('place_changed', calculateDistance);
  autocompleteDestination.addListener('place_changed', calculateDistance);

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const payload = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        pickup: document.getElementById("pickup").value.trim(),
        pickupTime: document.getElementById("pickupTime").value.trim(),
        destination: document.getElementById("destination").value.trim(),
        distance: document.getElementById("distance").value,
        price: document.getElementById("price").value
      };

      try {
        const response = await fetch('https://notify.netlify.app/.netlify/functions/email-handler', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.warn("Email server failed:", await response.text());
          alert("⚠️ Booking sent but confirmation email may not have gone through.");
        } else {
          alert("✅ Your booking has been submitted!");
        }

      } catch (err) {
        console.error("❌ Email POST failed:", err);
        alert("⚠️ Booking submitted, but server confirmation failed.");
      }

      // Always redirect to Stripe
      window.location.href = stripePaymentUrl;
    });
  }
});
