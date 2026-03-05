
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Submission, Admin } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_env";
const JWT_EXPIRES = "8h";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, error: "Не авторизован" });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ ok: false, error: "Токен недействителен" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ ok: false, error: "Укажите логин и пароль" });

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ ok: false, error: "Неверный логин или пароль" });

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return res.status(401).json({ ok: false, error: "Неверный логин или пароль" });

  const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.json({ ok: true, token });
}

export async function getSubmissions(req, res) {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const skip   = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search?.trim();

    const filter = {};
    if (status && ["new","read","replied","archived"].includes(status)) filter.status = status;
    if (search) {
      filter.$or = [
        { name:    { $regex: search, $options: "i" } },
        { email:   { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total, counts] = await Promise.all([
      Submission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Submission.countDocuments(filter),
      Submission.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const statusCounts = { new: 0, read: 0, replied: 0, archived: 0 };
    counts.forEach(c => { if (statusCounts[c._id] !== undefined) statusCounts[c._id] = c.count; });

    res.json({ ok: true, items, total, page, pages: Math.ceil(total / limit), statusCounts });
  } catch (err) {
    console.error("[admin] getSubmissions:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
}

export async function updateSubmission(req, res) {
  try {
    const { status, notes } = req.body || {};
    const update = {};
    if (status && ["new","read","replied","archived"].includes(status)) update.status = status;
    if (typeof notes === "string") update.notes = notes.slice(0, 2000);

    const item = await Submission.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ ok: false, error: "Не найдено" });
    res.json({ ok: true, item });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

export async function deleteSubmission(req, res) {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

export async function getSubmission(req, res) {
  try {
    const item = await Submission.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ ok: false, error: "Не найдено" });
    // Автоматически помечаем как прочитанное
    if (item.status === "new") await Submission.findByIdAndUpdate(req.params.id, { status: "read" });
    res.json({ ok: true, item });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

export async function initAdmin(req, res) {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ ok: false, error: "Админ уже создан" });

    const { username, password } = req.body || {};
    if (!username || !password || password.length < 8)
      return res.status(400).json({ ok: false, error: "Логин и пароль (мин. 8 символов) обязательны" });

    const hash = await bcrypt.hash(password, 12);
    await Admin.create({ username, password: hash });
    res.json({ ok: true, message: "Админ создан. Теперь войдите через /api/admin/login" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
