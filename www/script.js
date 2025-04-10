document.addEventListener('DOMContentLoaded', function () {
  const pickupInput = document.getElementById('pickup');
  const destinationInput = document.getElementById('destination');
  const distanceField = document.getElementById('distance');
  const priceField = document.getElementById('price');
  const form = document.querySelector('form');

  const stripePaymentUrl = "https://buy.stripe.com/cN2g2336Qbp26xW9AC";
  const functionEndpoint = "https://notifyride.netlify.app/.netlify/functions/email-handler";

  // Google Places Autocomplete
  const autocompletePickup = new google.maps.places.Autocomplete(pickupInput);
  const autocompleteDestination = new google.maps.places.Autocomplete(destinationInput);

  function calculateDistance() {
    const origin = pickupInput.value;
    const destination = destinationInput.value;

    if (!origin || !destination) return;

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC
    }, (response, status) => {
      if (status !== 'OK' || response.rows.length === 0) {
        alert("❌ Error calculating distance.");
        return;
      }

      const result = response.rows[0].elements[0];
      if (result.status === "OK") {
        const distanceKm = (result.distance.value / 1000).toFixed(1);
        const estimatedPrice = (distanceKm * 2.2).toFixed(2);

        distanceField.value = `${distanceKm} km`;
        priceField.value = `$${estimatedPrice}`;
      }
    });
  }

  autocompletePickup.addListener('place_changed', calculateDistance);
  autocompleteDestination.addListener('place_changed', calculateDistance);

  // Submit Booking Form
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        pickup: formData.get('pickup'),
        pickupTime: formData.get('pickupTime'),
        destination: formData.get('destination'),
        distance: formData.get('distance'),
        price: formData.get('price')
      };

      try {
        const response = await fetch(functionEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          alert("✅ Booking sent successfully!");
          window.location.href = stripePaymentUrl;
        } else {
          alert(`⚠️ Booking failed: ${result.error || 'Please try again.'}`);
        }
      } catch (err) {
        alert("❌ There was a problem sending your booking. Please try again.");
        console.error(err);
      }
    });
  }
});
