/**
 * db.js — подключение к MongoDB + модели
 */
import mongoose from "mongoose";

// ── Подключение ────────────────────────────────────────
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI не задан в .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log("✅ MongoDB подключена");
}

// ══════════════════════════════════════════════════════
//  Модель: Заявка с формы
// ══════════════════════════════════════════════════════
const submissionSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  company:   { type: String, default: "" },
  email:     { type: String, required: true },
  topic:     { type: String, required: true },
  message:   { type: String, required: true },
  ip:        { type: String },
  lang:      { type: String, default: "ru" },   // ru / en / kk
  status:    { type: String, default: "new", enum: ["new", "read", "replied", "archived"] },
  notes:     { type: String, default: "" },      // заметки админа
  createdAt: { type: Date, default: Date.now },
});

// ── Индексы для быстрой фильтрации в админке ──────────
submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ email: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);

// ══════════════════════════════════════════════════════
//  Модель: Админ пользователь
// ══════════════════════════════════════════════════════
const adminSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true }, // bcrypt hash
  createdAt: { type: Date, default: Date.now },
});

export const Admin = mongoose.model("Admin", adminSchema);
