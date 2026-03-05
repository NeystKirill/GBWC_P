/**
 * contact-form.js
 * Подключить в HTML: <script type="module" src="/src/contact-form.js"></script>
 * Работает для любой формы с классом .modal-form или .contacts-form
 */

const API = window.location.hostname === "localhost" ? "http://localhost:3001" : "";

// Определяем язык страницы
function getLang() {
  const path = window.location.pathname;
  if (path.includes("/en/")) return "en";
  if (path.includes("/kk/")) return "kk";
  return "ru";
}

const MESSAGES = {
  ru: { success: "✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.", sending: "Отправляем...", send: "Отправить сообщение" },
  en: { success: "✓ Message sent! We'll get back to you soon.", sending: "Sending...", send: "Send message" },
  kk: { success: "✓ Хабарлама жіберілді! Жақын арада байланысамыз.", sending: "Жіберілуде...", send: "Хабарлама жіберу" },
};

async function submitForm(form) {
  const lang = getLang();
  const msg  = MESSAGES[lang] || MESSAGES.ru;
  const btn  = form.querySelector(".form-submit");
  const errorEl = form.querySelector(".form-error") || createErrorEl(form);

  // Собираем данные
  const data = {
    name:    form.querySelector("input[type=text]")?.value?.trim() || "",
    company: form.querySelectorAll("input[type=text]")[1]?.value?.trim() || "",
    email:   form.querySelector("input[type=email]")?.value?.trim() || "",
    topic:   form.querySelector("select")?.value || "",
    message: form.querySelector("textarea")?.value?.trim() || "",
    website: form.querySelector(".honeypot")?.value || "", // honeypot
    lang,
  };

  // Клиентская валидация
  const errors = [];
  if (!data.name || data.name.length < 2) errors.push(lang === "ru" ? "Укажите имя" : "Enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push(lang === "ru" ? "Укажите корректный email" : "Enter valid email");
  if (!data.topic) errors.push(lang === "ru" ? "Выберите тему" : "Select a topic");
  if (!data.message || data.message.length < 10) errors.push(lang === "ru" ? "Сообщение слишком короткое" : "Message is too short");

  if (errors.length) {
    errorEl.textContent = errors.join(" · ");
    errorEl.style.display = "block";
    return;
  }

  errorEl.style.display = "none";
  btn.disabled = true;
  btn.textContent = msg.sending;

  try {
    const r = await fetch(`${API}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const d = await r.json();

    if (d.ok) {
      // Успех — показываем сообщение
      form.innerHTML = `
        <div style="text-align:center;padding:32px 0">
          <div style="font-size:48px;margin-bottom:16px">✓</div>
          <div style="font-size:18px;font-weight:600;color:#34d399;margin-bottom:8px">${msg.success}</div>
        </div>`;
    } else {
      const errMsg = d.errors?.join(" · ") || d.error || "Ошибка. Попробуйте позже.";
      errorEl.textContent = errMsg;
      errorEl.style.display = "block";
      btn.disabled = false;
      btn.textContent = msg.send;
    }
  } catch (e) {
    errorEl.textContent = "Ошибка сети. Попробуйте позже.";
    errorEl.style.display = "block";
    btn.disabled = false;
    btn.textContent = msg.send;
  }
}

function createErrorEl(form) {
  const el = document.createElement("div");
  el.className = "form-error";
  el.style.cssText = "background:#2a1a1a;border:1px solid #ff4444;border-radius:8px;padding:12px 16px;color:#ff8888;font-size:14px;margin-bottom:16px;display:none";
  form.insertBefore(el, form.firstChild);
  return el;
}

function addHoneypot(form) {
  const hp = document.createElement("input");
  hp.type = "text"; hp.className = "honeypot";
  hp.style.cssText = "position:absolute;left:-9999px;opacity:0;pointer-events:none";
  hp.tabIndex = -1; hp.autocomplete = "off";
  form.appendChild(hp);
}

// ── Инициализация всех форм на странице ───────────────
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal-form, .contacts-form .modal-form").forEach(form => {
    addHoneypot(form);
    const btn = form.querySelector(".form-submit");
    if (btn) btn.addEventListener("click", e => { e.preventDefault(); submitForm(form); });
  });
});
