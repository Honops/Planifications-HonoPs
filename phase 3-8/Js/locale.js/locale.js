const translations = {
  fr: { welcome: "Bienvenue" },
  en: { welcome: "Welcome" },
  es: { welcome: "Bienvenido" }
};

function setLanguage(lang) {
  document.querySelector("h1").innerText =
    translations[lang].welcome + " - HonoPs";
}