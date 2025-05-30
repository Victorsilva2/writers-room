document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("responseMessage");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("https://writers-backend-69m5.onrender.com/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          message.innerText = "✅ Registered successfully! Redirecting to login...";
          setTimeout(() => {
            window.location.href = "/writers-room/screens/login.html";
          }, 2000);
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

// LOGIN SECTION
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("responseMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("https://writers-backend-69m5.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(result.user));

          if (result.user.role === "admin") {
            window.location.href = "/writers-room/screens/dashboard.html";
          } else {
            window.location.href = "/writers-room/screens/blog.html";  // <-- 🔥 THE MAIN FIX
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
