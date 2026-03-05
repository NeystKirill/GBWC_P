
import nodemailer from "nodemailer";
import { Submission } from "./db.js";

let transporter = null;

export function initMailer() {
  if (!process.env.SMTP_HOST) {
    console.warn("⚠️  SMTP не настроен — письма отправляться не будут");
    return;
  }
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const formRlMap = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [ip, d] of formRlMap) if (d.resetAt < now) formRlMap.delete(ip);
}, 10 * 60_000);

function checkRateLimit(ip) {
  const now = Date.now();
  const e = formRlMap.get(ip);
  if (!e || e.resetAt < now) { formRlMap.set(ip, { count: 1, resetAt: now + 10 * 60_000 }); return true; }
  if (e.count >= 3) return false;
  e.count++;
  return true;
}

function sanitize(str, max = 1000) {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim().slice(0, max);
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
}

const ALLOWED_TOPICS = [
  "Членство в GBWC", "Партнёрство", "Участие в мероприятии", "Медиа-запрос", "Другое",
  "GBWC Membership", "Partnership", "Event Participation", "Media Inquiry", "Other",
  "GBWC мүшелігі", "Серіктестік", "Іс-шараға қатысу", "Медиа сұрау", "Басқа",
];

export async function handleContact(req, res) {
  const ip = req.ip || req.socket.remoteAddress;

  if (!checkRateLimit(ip))
    return res.status(429).json({ ok: false, error: "Слишком много запросов. Попробуйте через 10 минут." });
  if (req.body.website) return res.json({ ok: true });

  const name    = sanitize(req.body.name    || "", 200);
  const company = sanitize(req.body.company || "", 200);
  const email   = sanitize(req.body.email   || "", 254);
  const topic   = sanitize(req.body.topic   || "", 100);
  const message = sanitize(req.body.message || "", 2000);
  const lang    = ["ru","en","kk"].includes(req.body.lang) ? req.body.lang : "ru";

  const errors = [];
  if (!name || name.length < 2)        errors.push("Укажите имя (минимум 2 символа)");
  if (!isValidEmail(email))            errors.push("Укажите корректный email");
  if (!ALLOWED_TOPICS.includes(topic)) errors.push("Выберите тему из списка");
  if (!message || message.length < 10) errors.push("Сообщение слишком короткое");
  if (errors.length) return res.status(400).json({ ok: false, errors });

  let submission;
  try {
    submission = await Submission.create({ name, company, email, topic, message, ip, lang });
  } catch (err) {
    console.error("[contact] db error:", err.message);
    return res.status(500).json({ ok: false, error: "Ошибка сервера. Попробуйте позже." });
  }

  // ── Отправляем email (если SMTP настроен) ──────────
  if (transporter) {
    const toEmail   = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.SMTP_USER;
    try {
      await transporter.sendMail({
        from: `"GBWC Сайт" <${fromEmail}>`,
        to: toEmail,
        replyTo: email,
        subject: `[GBWC] ${topic} — ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#1a1a2e;color:#fff;padding:24px;border-radius:8px 8px 0 0">
              <h2 style="margin:0">Новое сообщение — GBWC</h2>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#666;width:120px"><b>Имя:</b></td><td>${name}</td></tr>
                <tr><td style="padding:8px 0;color:#666"><b>Компания:</b></td><td>${company || "—"}</td></tr>
                <tr><td style="padding:8px 0;color:#666"><b>Email:</b></td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666"><b>Тема:</b></td><td>${topic}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0">
              <p style="color:#666;margin:0 0 8px"><b>Сообщение:</b></p>
              <p style="background:#fff;padding:16px;border-radius:4px;border:1px solid #e0e0e0;margin:0;white-space:pre-wrap">${message}</p>
              <hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0">
              <p style="color:#999;font-size:12px;margin:0">ID: ${submission._id} · IP: ${ip} · ${new Date().toLocaleString("ru-RU",{timeZone:"Asia/Almaty"})}</p>
            </div>
          </div>`,
      });
      await transporter.sendMail({
        from: `"GBWC" <${fromEmail}>`,
        to: email,
        subject: "Ваше сообщение получено — GBWC",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#1a1a2e;color:#fff;padding:24px;border-radius:8px 8px 0 0">
              <h2 style="margin:0">Спасибо, ${name}!</h2>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0">
              <p>Мы получили ваше сообщение по теме <b>${topic}</b> и свяжемся с вами в ближайшее время.</p>
              <p style="color:#999;font-size:13px">Global Businesswomen Council<br>info@gbwc-secretariat.org</p>
            </div>
          </div>`,
      });
    } catch (err) {
      console.error("[contact] mail error:", err.message);
      // Не возвращаем ошибку — данные уже сохранены в БД
    }
  }

  res.json({ ok: true, message: "Сообщение отправлено" });
}
