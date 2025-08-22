document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inquiry-form");
  const message = document.getElementById("form-message");

  // Insert suggested question into textarea
  document.querySelectorAll(".question-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const textarea = document.getElementById("requirements");
      textarea.value += (textarea.value ? "\n" : "") + btn.textContent;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "⏳ Sending your inquiry...";
    message.style.color = "#444";

    const productImg = document.querySelector("#product-info img");
    const imageUrl = productImg ? productImg.src : "";

    const data = {
      name: form.name.value,
      email: form.email.value,
      quantity: form.quantity.value,
      requirements: form.requirements.value,
      imageUrl
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzGwVOjye_7eVqzeZVDbawMH8ypsTcuqrV-xzSe0t8BaKj_CkOJ53M3ihjI9Y9msRrm/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();
      message.textContent = result.message;
      message.style.color = result.status === "success" ? "green" : "red";

      if (result.status === "success") form.reset();
    } catch (err) {
      message.textContent = "❌ Network error. Please check your Apps Script URL.";
      message.style.color = "red";
      console.error(err);
    }
  });
});
