// main.js – стилі, перемикач теми, закриття мобільного меню, перевірка форми
import "./style.css";

// ---------- Тема: системна → світла → темна (явний вибір зберігається) ----------
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const label = document.getElementById("theme-label");
const NAMES = { system: "системна", light: "світла", dark: "темна" };
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const read = () => {
  try {
    return localStorage.getItem("theme") || "system";
  } catch {
    return "system";
  }
};
const apply = (mode) => {
  root.classList.toggle("dark", mode === "dark" || (mode === "system" && systemDark.matches));
  label.textContent = `Тема: ${NAMES[mode]}. Перемкнути`;
  toggle.title = `Тема: ${NAMES[mode]}`;
};
toggle.addEventListener("click", () => {
  const next = { system: "light", light: "dark", dark: "system" }[read()];
  try {
    next === "system" ? localStorage.removeItem("theme") : localStorage.setItem("theme", next);
  } catch {
    /* сховище недоступне */
  }
  apply(next);
});
systemDark.addEventListener("change", () => {
  if (read() === "system") apply("system");
});
apply(read());

// ---------- Мобільне меню: закрити після вибору пункту й клавішею Escape ----------
const menu = document.querySelector("header details");
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) menu.open = false;
});
menu.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});

// ---------- Форма: декларативні обмеження + підсумок помилок ----------
const form = document.getElementById("consult-form");
const summary = document.getElementById("form-summary");
const list = document.getElementById("form-summary-list");
const success = document.getElementById("form-success");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  success.classList.add("hidden");
  const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
  if (invalid.length) {
    // позначити поля як «торкнуті», щоб спрацював :user-invalid, і показати підсумок із посиланнями
    invalid.forEach((el) => el.dispatchEvent(new Event("blur")));
    const seen = new Set();
    list.replaceChildren(
      ...invalid
        .filter((el) => !seen.has(el.name) && seen.add(el.name))
        .map((el) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          const lbl = el.type === "radio" ? el.closest("fieldset")?.querySelector("legend") : el.labels?.[0];
          a.href = "#" + (el.id || el.name);
          a.textContent = (lbl?.textContent || el.name)
            .replace(/\s+/g, " ")
            .replace(/\s*\*\s*$/, "")
            .trim();
          a.className = "underline underline-offset-4";
          a.addEventListener("click", (ev) => {
            ev.preventDefault();
            el.focus();
          });
          li.append(a);
          return li;
        }),
    );
    summary.classList.remove("hidden");
    summary.focus();
    return;
  }
  summary.classList.add("hidden");
  form.reset();
  success.classList.remove("hidden");
  success.focus();
});
