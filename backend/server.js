import express from "express";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { initMailer, handleContact } from "./contact.js";
import { requireAuth, login, initAdmin, getSubmissions, getSubmission, updateSubmission, deleteSubmission } from "./admin.js";

dotenv.config();

// ── Проверка обязательных переменных ──────────────────
["CF_ACCOUNT_ID","CF_R2_ACCESS_KEY_ID","CF_R2_SECRET_ACCESS_KEY","CF_R2_BUCKET_NAME"].forEach(k => {
  if (!process.env[k]) { console.error(`❌ Нет переменной: ${k}`); process.exit(1); }
});

// ── Подключение MongoDB ────────────────────────────────
await connectDB();
initMailer();

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

// ── Блокируем чужие домены ─────────────────────────────
app.use((req, res, next) => {
  const origin  = req.headers.origin;
  const allowed = process.env.ALLOWED_ORIGIN;
  if (origin && allowed && origin !== allowed)
    return res.status(403).json({ ok: false, error: "Forbidden" });
  next();
});

// ── Rate Limit 60 req/min ─────────────────────────────
const rlMap = new Map();
setInterval(() => { const n = Date.now(); for (const [k,v] of rlMap) if (v.r < n) rlMap.delete(k); }, 5*60_000);
function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress, now = Date.now(), e = rlMap.get(ip);
  if (!e || e.r < now) { rlMap.set(ip, { c: 1, r: now + 60_000 }); return next(); }
  if (++e.c > 60) { res.set("Retry-After","60"); return res.status(429).json({ ok:false, error:"Too many requests" }); }
  next();
}
app.use("/api", rateLimit);

// ── R2 ─────────────────────────────────────────────────
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.CF_R2_ACCESS_KEY_ID, secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY },
});
const BUCKET = process.env.CF_R2_BUCKET_NAME;
const IMG = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i;
const VID = /\.(mp4|webm|mov|avi)$/i;

const urlCache = new Map();
function getCached(k) { const e=urlCache.get(k); if(e&&e.exp>Date.now()) return e.url; urlCache.delete(k); return null; }
function setCache(k,url) { urlCache.set(k,{url,exp:Date.now()+50*60_000}); }
async function presign(key) {
  const c = getCached(key); if (c) return c;
  const url = await getSignedUrl(r2, new GetObjectCommand({Bucket:BUCKET,Key:key}), {expiresIn:3600});
  setCache(key, url); return url;
}
const SAFE = /^[a-zA-Z0-9_\-/]+$/;
function vFolder(f) {
  if (!f) return "";
  if (!SAFE.test(f)||f.includes("..")) throw new Error("Недопустимое имя папки");
  return f.endsWith("/") ? f : f+"/";
}

// ════════════════════════════════════════════════════
//  R2 ЭНДПОИНТЫ
// ════════════════════════════════════════════════════

// GET /api/icons — логотипы партнёров
app.get("/api/icons", async (req, res) => {
  try {
    const { Contents=[] } = await r2.send(new ListObjectsV2Command({Bucket:BUCKET,Prefix:"icons/",MaxKeys:200}));
    const items = await Promise.all(
      Contents.filter(o=>IMG.test(o.Key)).map(async o => ({
        key: o.Key, filename: o.Key.split("/").pop(), url: await presign(o.Key)
      }))
    );
    res.set("Cache-Control","public, max-age=3600");
    res.json({ ok:true, items });
  } catch(err) { res.status(500).json({ok:false,error:err.message}); }
});

// GET /api/photos — фото из photos/
// ?subfolder=hero&limit=20
app.get("/api/photos", async (req, res) => {
  try {
    const sub   = req.query.subfolder ? `photos/${req.query.subfolder}/` : "photos/";
    const limit = Math.min(parseInt(req.query.limit)||20, 100);
    const { Contents=[] } = await r2.send(new ListObjectsV2Command({Bucket:BUCKET,Prefix:sub,MaxKeys:200}));
    const items = await Promise.all(
      Contents.filter(o=>IMG.test(o.Key)).slice(0,limit).map(async o => ({
        key:o.Key, filename:o.Key.split("/").pop(), url:await presign(o.Key)
      }))
    );
    res.set("Cache-Control","public, max-age=600");
    res.json({ ok:true, items });
  } catch(err) { res.status(500).json({ok:false,error:err.message}); }
});

// GET /api/photos/latest — последнее фото из папки
app.get("/api/photos/latest", async (req, res) => {
  try {
    const sub = req.query.subfolder ? `photos/${req.query.subfolder}/` : "photos/";
    const { Contents=[] } = await r2.send(new ListObjectsV2Command({Bucket:BUCKET,Prefix:sub,MaxKeys:50}));
    const photos = Contents.filter(o=>IMG.test(o.Key));
    if (!photos.length) return res.json({ok:true,item:null});
    photos.sort((a,b)=>new Date(b.LastModified)-new Date(a.LastModified));
    const url = await presign(photos[0].Key);
    res.set("Cache-Control","public, max-age=600");
    res.json({ ok:true, item:{key:photos[0].Key, url} });
  } catch(err) { res.status(500).json({ok:false,error:err.message}); }
});

// GET /api/videos — видео из videos/
app.get("/api/videos", async (req, res) => {
  try {
    const sub   = req.query.subfolder ? `videos/${req.query.subfolder}/` : "videos/";
    const limit = Math.min(parseInt(req.query.limit)||10, 50);
    const { Contents=[] } = await r2.send(new ListObjectsV2Command({Bucket:BUCKET,Prefix:sub,MaxKeys:100}));
    const items = await Promise.all(
      Contents.filter(o=>VID.test(o.Key)).slice(0,limit).map(async o => ({
        key:o.Key, filename:o.Key.split("/").pop(), url:await presign(o.Key)
      }))
    );
    res.set("Cache-Control","public, max-age=600");
    res.json({ ok:true, items });
  } catch(err) { res.status(500).json({ok:false,error:err.message}); }
});

// Обратная совместимость с hero-media.js
app.get("/api/media/hero", async (req, res) => {
  try {
    const sub = req.query.folder ? `photos/${req.query.folder}/` : "photos/hero/";
    const { Contents=[] } = await r2.send(new ListObjectsV2Command({Bucket:BUCKET,Prefix:sub,MaxKeys:50}));
    const imgs = Contents.filter(o=>IMG.test(o.Key));
    if (!imgs.length) return res.json({ok:true,item:null});
    imgs.sort((a,b)=>new Date(b.LastModified)-new Date(a.LastModified));
    const url = await presign(imgs[0].Key);
    res.set("Cache-Control","public, max-age=600");
    res.json({ ok:true, item:{key:imgs[0].Key,url,type:"image"} });
  } catch(err) { res.status(400).json({ok:false,error:err.message}); }
});

// ════════════════════════════════════════════════════
//  ФОРМА ОБРАТНОЙ СВЯЗИ
// ════════════════════════════════════════════════════
app.post("/api/contact", handleContact);

// ════════════════════════════════════════════════════
//  АДМИН ПАНЕЛЬ API
// ════════════════════════════════════════════════════

// Создать первого админа (только если нет ни одного)
app.post("/api/admin/init", initAdmin);

// Логин → получить JWT токен
app.post("/api/admin/login", login);

// Все следующие роуты требуют токен
app.get   ("/api/admin/submissions",     requireAuth, getSubmissions);
app.get   ("/api/admin/submissions/:id", requireAuth, getSubmission);
app.patch ("/api/admin/submissions/:id", requireAuth, updateSubmission);
app.delete("/api/admin/submissions/:id", requireAuth, deleteSubmission);

// ── Health check ───────────────────────────────────
app.get("/health", (_, res) => res.json({ ok:true }));
app.use((_, res) => res.status(404).json({ ok:false, error:"Not found" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ GBWC backend on 127.0.0.1:${PORT}`);
  console.log(`   Бакет: ${BUCKET}`);
  console.log(`   POST /api/contact`);
  console.log(`   POST /api/admin/init   ← создать первого админа`);
  console.log(`   POST /api/admin/login  ← получить токен`);
  console.log(`   GET  /api/admin/submissions`);
});
