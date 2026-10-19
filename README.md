# PP | Project Presenter

منصة معرض أعمال (Portfolio) تفاعلية لعرض المشاريع البرمجية — عارض فقط (Read-only)
يتغذى من ملفات بيانات داخل المستودع، بلا لوحة تحكم ولا قاعدة بيانات.

## المزايا

- **الرئيسية** — بطل بتأثيرات إضاءة، إحصاءات، ومشاريع مميزة.
- **معرض المشاريع** — شبكة بطاقات مع بحث وتصفية (النوع، الإطار، التخزين، المصدر).
- **صفحة المشروع** — وصف Markdown، خصائص ومميزات، تحديات وحلول، مخطط معمارية،
  وعارض شاشات تفاعلي.
- **العارض الذكي** — إطارا جوال/متصفح، شاشات `html` (معقّمة بـ DOMPurify) أو
  `iframe` أو `image` أو `code` (ملوّنة بـ Shiki)، ونقاط ساخنة تحاكي أزرار الواجهة.
- **نبذة عني** — ملف شخصي، مهارات، روابط اجتماعية، وجدول زمني.
- وضع داكن/فاتح (`next-themes`)، حركات `motion`، واجهة عربية RTL.

## التقنيات

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · Tailwind CSS 4 ·
TypeScript · shiki · DOMPurify · gray-matter + react-markdown · lucide + simple-icons

## التشغيل

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # بناء الإنتاج
```

## إدارة المحتوى

المحتوى ملفات داخل `data/` — عدّلها وانشر من جديد:

- `data/profile.json` — الملف الشخصي.
- `data/projects/*.json` أو `*.md` — مشروع لكل ملف.

الدليل الكامل لصيغة الملفات: [`docs/PROJECT_SCHEMA.md`](docs/PROJECT_SCHEMA.md)
