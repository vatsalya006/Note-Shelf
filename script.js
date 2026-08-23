const homeScreen = document.getElementById("home-screen");
    const signinScreen = document.getElementById("signin-screen");
    const appScreen = document.getElementById("app-screen");
    const buttons = document.querySelectorAll(".nav button");
    const pages = document.querySelectorAll(".page");

    function showScreen(screen) {
      homeScreen.classList.toggle("hidden", screen !== "home");
      signinScreen.classList.toggle("hidden", screen !== "signin");
      appScreen.classList.toggle("hidden", screen !== "app");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function openPage(pageId) {
        showScreen("app");
        buttons.forEach((item) => item.classList.remove("active"));
        const navButton = document.querySelector(`.nav button[data-page="${pageId}"]`);
        if (navButton) navButton.classList.add("active");
        pages.forEach((page) => page.classList.remove("active"));
        document.getElementById(pageId).classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => openPage(button.dataset.page));
    });

    document.querySelectorAll("[data-open-page]").forEach((trigger) => {
      trigger.addEventListener("click", () => openPage(trigger.dataset.openPage));
    });

    document.querySelectorAll("[data-show-signin]").forEach((trigger) => {
      trigger.addEventListener("click", () => showScreen("signin"));
    });

    document.querySelectorAll("[data-show-home]").forEach((trigger) => {
      trigger.addEventListener("click", () => showScreen("home"));
    });

    document.getElementById("signin-form").addEventListener("submit", (event) => {
      event.preventDefault();
      openPage("dashboard");
    });
const passwordInput = document.getElementById("password-input");
const passwordToggle = document.getElementById("password-toggle");

if (passwordInput && passwordToggle) {
  passwordToggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    passwordToggle.textContent = isPassword ? "Hide" : "Show";

    passwordToggle.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });
}

const mobileMenu = document.getElementById("mobile-menu-btn");
const mobileOverlay = document.getElementById("sidebar-overlay");

if (mobileMenu) {
  mobileMenu.onclick = function () {
    document.getElementById("app-screen").classList.toggle("sidebar-open");
  };
}

if (mobileOverlay) {
  mobileOverlay.onclick = function () {
    document.getElementById("app-screen").classList.remove("sidebar-open");
  };
}

const aiSearchInput =
  document.getElementById("ai-search-input");

const aiSearchButton =
  document.getElementById("ai-search-button");

const quickSearchButtons =
  document.querySelectorAll(".quick-search");

quickSearchButtons.forEach((button) => {

  button.addEventListener("click", () => {

    if (!aiSearchInput) return;

    aiSearchInput.value =
      button.textContent.trim();

    aiSearchInput.focus();

  });

});


if (aiSearchButton) {

  aiSearchButton.addEventListener("click", () => {

    const query =
      aiSearchInput.value.trim();

    if (!query) {

      aiSearchInput.focus();

      return;

    }

    console.log("AI Search query:", query);

  });

}

if (aiSearchInput) {

  aiSearchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

      aiSearchButton.click();

    }

  });

}