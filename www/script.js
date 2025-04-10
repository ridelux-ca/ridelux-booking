document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  if (!form) return;

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
      const response = await fetch("https://notifyride.netlify.app/.netlify/functions/email-handler", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      alert("✅ Your booking has been submitted!");
      window.location.href = "https://buy.stripe.com/cN2g2336Qbp26xW9AC";
    } catch (err) {
      console.error('❌ Email error:', err);
      alert('There was a problem submitting your booking. Please try again.');
    }
  });
});
