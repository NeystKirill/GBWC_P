/**
 * hero-media.js — GBWC Media Loader v3
 * Бакет: private-gwbc
 *   icons/   → логотипы партнёров
 *   photos/  → фотографии (hero, events, founders, media)
 *   videos/  → видео
 */

const API = window.location.hostname === "localhost"
  ? "http://localhost:3001" : "";

// ── Кэш ───────────────────────────────────────────────
const _cache = new Map();
async function apiFetch(url) {
  if (_cache.has(url)) return _cache.get(url);
  try {
    const r = await fetch(API + url);
    const d = await r.json();
    if (d.ok) { _cache.set(url, d); return d; }
  } catch(e) { console.warn("[GBWC]", e); }
  return null;
}

// ── Вставка фото как фон ───────────────────────────────
function injectBg(container, url, alt = "") {
  container.classList.remove("media-loading");
  container.classList.add("media-loaded");
  container.querySelectorAll(".r2-bg").forEach(el => el.remove());
  const img = new Image();
  img.src = url; img.alt = alt; img.className = "r2-bg";
  img.onload = () => img.classList.add("r2-bg--visible");
  container.insertBefore(img, container.firstChild);
}

// ═══════════════════════════════════════════════════════
//  1. HERO IMAGE PANEL
//  Слот: <div class="hero-image-panel">
//  R2:   photos/hero/
// ═══════════════════════════════════════════════════════
async function loadHeroPanels() {
  const panels = document.querySelectorAll(".hero-image-panel");
  if (!panels.length) return;
  for (const panel of panels) {
    const subfolder = panel.dataset.folder || "hero";
    panel.classList.add("media-loading");
    const data = await apiFetch(`/api/photos/latest?subfolder=${encodeURIComponent(subfolder)}`);
    if (data?.item) injectBg(panel, data.item.url, "GBWC");
    else panel.classList.remove("media-loading");
  }
}

// ═══════════════════════════════════════════════════════
//  2. EVENT PHOTOS
//  Слот: <div class="event-photo" data-event="event-2023">
//  R2:   photos/events/event-2023/
// ═══════════════════════════════════════════════════════
async function loadEventPhotos() {
  const slots = document.querySelectorAll(".event-photo[data-event]");
  if (!slots.length) return;
  for (const slot of slots) {
    slot.classList.add("media-loading");
    const data = await apiFetch(`/api/photos/latest?subfolder=events/${slot.dataset.event}`);
    if (data?.item) injectBg(slot, data.item.url, slot.dataset.event);
    else slot.classList.remove("media-loading");
  }
}

// ═══════════════════════════════════════════════════════
//  3. FOUNDER PHOTOS
//  Слот: <div class="founder-photo" data-founder="zhanna">
//  R2:   photos/founders/zhanna/
// ═══════════════════════════════════════════════════════
async function loadFounderPhotos() {
  const slots = document.querySelectorAll(".founder-photo[data-founder]");
  if (!slots.length) return;
  for (const slot of slots) {
    slot.classList.add("media-loading");
    const data = await apiFetch(`/api/photos/latest?subfolder=founders/${slot.dataset.founder}`);
    if (data?.item) {
      const existingImg = slot.querySelector(".founder-photo-img");
      if (existingImg) {
        existingImg.src = data.item.url;
        existingImg.classList.add("r2-loaded");
      } else {
        injectBg(slot, data.item.url, slot.dataset.founder);
      }
      slot.classList.remove("media-loading");
      slot.classList.add("media-loaded");
    } else slot.classList.remove("media-loading");
  }
}

// ═══════════════════════════════════════════════════════
//  4. MEDIA CARD PHOTOS
//  Слот: <div class="media-photo" data-media-key="article-1">
//  R2:   photos/media/article-1/
// ═══════════════════════════════════════════════════════
async function loadMediaPhotos() {
  const slots = document.querySelectorAll(".media-photo[data-media-key]");
  if (!slots.length) return;
  for (const slot of slots) {
    slot.classList.add("media-loading");
    const data = await apiFetch(`/api/photos/latest?subfolder=media/${slot.dataset.mediaKey}`);
    if (data?.item) injectBg(slot, data.item.url, slot.dataset.mediaKey);
    else slot.classList.remove("media-loading");
  }
}

// ═══════════════════════════════════════════════════════
//  5. PARTNER LOGOS — новая структура partner-chip
//  Слот: <div class="partner-chip"><img src="/img/logos/partners/ebrd.svg" alt="EBRD">
//  R2:   icons/  (файлы: ebrd.svg, world-bank.svg, ...)
//  Логика: берём alt текст img → ищем совпадение в R2 по имени файла
// ═══════════════════════════════════════════════════════
async function loadPartnerLogos() {
  const chips = document.querySelectorAll(".partner-chip img");
  if (!chips.length) return;

  const data = await apiFetch("/api/icons");
  if (!data?.items?.length) return;

  // Строим карту: filename_без_расширения → url
  const iconMap = {};
  for (const icon of data.items) {
    const name = icon.filename.toLowerCase().replace(/\.(svg|png|jpg|jpeg|webp)$/i, "");
    iconMap[name] = icon.url;
  }

  for (const img of chips) {
    const alt = img.alt.toLowerCase().trim();
    // Пробуем найти по alt или по src filename
    const srcFile = img.src.split("/").pop().replace(/\.(svg|png|jpg|jpeg|webp)$/i,"").toLowerCase();

    const url = iconMap[alt] || iconMap[srcFile] ||
      // Частичное совпадение
      Object.entries(iconMap).find(([k]) => k.includes(alt) || alt.includes(k))?.[1] ||
      Object.entries(iconMap).find(([k]) => k.includes(srcFile) || srcFile.includes(k))?.[1];

    if (url) {
      img.src = url;
      img.classList.add("r2-loaded");
      // Скрываем fallback текст если он был показан
      const fallback = img.nextElementSibling;
      if (fallback?.classList.contains("partner-chip-text")) {
        fallback.style.display = "none";
        img.style.display = "";
      }
    }
  }
}

// ═══════════════════════════════════════════════════════
//  ЗАПУСК
// ═══════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  loadPartnerLogos();
  loadHeroPanels();
  loadEventPhotos();
  loadFounderPhotos();
  loadMediaPhotos();
});

export { loadPartnerLogos, loadHeroPanels, loadEventPhotos, loadFounderPhotos, loadMediaPhotos };
