document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("responseMessage");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("http://localhost:3001/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          message.innerText = "✅ Registered successfully! You may now log in.";
          form.reset();
        } else {
          message.innerText = `❌ ${result.error || "Registration failed."}`;
        }
      } catch (err) {
        message.innerText = "❌ Server error. Please try again.";
        console.error(err);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("responseMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          // Save user info in localStorage
          localStorage.setItem("user", JSON.stringify(result.user));

          // Redirect based on role
          if (result.user.role === "admin") {
            window.location.href = "./dashboard.html";
          } else {
            window.location.href = "./writer.html";
          }
        } else {
          message.innerText = `❌ ${result.error || "Login failed."}`;
        }
      } catch (err) {
        message.innerText = "❌ Server error. Please try again.";
        console.error(err);
      }
    });
  }
});