# كيفية إضافة مشروع جديد إلى PP | Project Presenter

المشاريع تُدار كملفات داخل المستودع — لا توجد لوحة تحكم ولا قاعدة بيانات.
لإضافة مشروع: أنشئ ملفاً في `data/projects/` بصيغة **JSON** أو **Markdown** (`.md` / `.mdx`)،
ثم انشر الموقع من جديد.

- `data/profile.json` — ملفك الشخصي (الاسم، المهارات، الروابط، الجدول الزمني).
- `data/projects/*.json` — مشروع واحد لكل ملف.
- `data/projects/*.md` أو `*.mdx` — البيانات الوصفية في الـ Frontmatter، والنص التالي يصبح وصف المشروع (يُعرض كـ Markdown).

> **ملاحظة أثناء التطوير:** بعد تعديل ملفات `data/` أعد تشغيل `pnpm dev` لأن
> قراءة الملفات تتم على نظام الملفات وليست جزءاً من رسم الاعتماديات للتحديث الحي.

---

## الحقول

| الحقل | النوع | مطلوب | الوصف |
|---|---|---|---|
| `slug` | نص | ✅ | معرّف فريد يظهر في الرابط `/projects/<slug>` |
| `name` | نص | ✅ | اسم المشروع |
| `tagline` | نص | ✅ | سطر تعريفي قصير |
| `description` | نص | – | وصف أطول (يدعم Markdown) |
| `source` | `"open"` \| `"closed"` | ✅ | المصدر مفتوح أم مغلق |
| `repoUrl` | نص (رابط) | – | رابط المستودع |
| `demoUrl` | نص (رابط) | – | رابط معاينة حية |
| `type` | `"mobile"` \| `"web"` \| `"extension"` \| `"desktop"` \| `"cli"` | ✅ | نوع المشروع |
| `framework` | `{ "name": "...", "icon": "..." }` | ✅ | الإطار. `icon` اختياري ويُستنتج غالباً من الاسم |
| `stack` | نص[] | – | التقنيات المستخدمة |
| `storage` | `"cloud"` \| `"local"` \| `"none"` | ✅ | نوع التخزين |
| `status` | `"active"` \| `"wip"` \| `"archived"` | – | الحالة (افتراضي `active`) |
| `featured` | منطقي | – | إبراز في الصفحة الرئيسية |
| `year` | رقم | – | سنة المشروع |
| `features` | نص[] | – | خصائص المشروع (نقاط) |
| `highlights` | نص[] | – | مميزات المشروع (نقاط) |
| `challenges` | كائن[] | – | التحديات: `{ title, problem, solution }` |
| `architecture` | كائن | – | مخطط الهيكلية — انظر أدناه |
| `screens` | كائن[] | – | شاشات العارض الذكي — انظر أدناه |

### الأيقونات

تُحسم الأيقونات بالاسم تلقائياً: `framework.icon`، `stack`، `architecture.nodes[].icon`،
و`profile.socials[].icon`. جرّب كتابة اسم التقنية كما هو (`"Next.js"`, `"flutter"`, `"github"`)
— يُبحث أولاً في أيقونات البراندات ثم في مجموعة أسماء عامة (`mobile`, `web`, `cloud`,
`local`, `database`, `lock`, `open`, `rocket`, `graduation`…). عند عدم التطابق تظهر أيقونة احتياطية.

---

## مخطط الهيكلية `architecture`

```json
"architecture": {
  "layers": [
    {
      "title": "العميل",
      "nodes": [
        { "id": "ui", "label": "واجهة Flutter", "description": "شاشات + Riverpod", "icon": "mobile" }
      ]
    },
    { "title": "البيانات", "nodes": [ { "id": "db", "label": "Firestore", "icon": "database" } ] }
  ],
  "flows": [
    { "from": "ui", "to": "db", "label": "مزامنة" }
  ]
}
```

- كل عنصر في `layers` = عمود في المخطط (ترتيب التدفق يسار → يمين).
- `flows` أسهم بين معرّفات العقد، ويجب أن تشير لمعرّفات موجودة فعلاً.

---

## شاشات العارض الذكي `screens`

```json
"screens": [
  {
    "id": "home",
    "title": "الرئيسية",
    "device": "mobile",
    "description": "نص توضيحي يظهر جانب العارض",
    "content": { "type": "html", "html": "<div>…محاكاة الواجهة…</div>" },
    "links": [
      { "label": "إضافة مهمة", "target": "add", "hotspot": { "x": 36, "y": 82, "w": 28, "h": 12 } }
    ]
  }
]
```

- `device`: `"mobile"` (إطار جوال) أو `"desktop"` (إطار متصفح) — ويمكن للزائر التبديل.
- `links[].target` يجب أن يطابق `id` شاشة أخرى — هكذا يُحاكى تدفق المستخدم.
- `hotspot` (اختياري): منطقة نابضة فوق الشاشة تنقل عند الضغط. الإحداثيات **نسب مئوية**
  من أبعاد الشاشة: `x,y` الزاوية العلوية اليسرى، و`w,h` العرض والارتفاع.

### أنواع المحتوى `content.type`

| النوع | الحقول | الاستخدام |
|---|---|---|
| `"html"` | `html` | محاكاة واجهة بـ HTML — يُطهَّر عبر DOMPurify ويعرض في iframe معزول |
| `"iframe"` | `url` | معاينة حية لموقع/ديمو خارجي |
| `"image"` | `src`, `alt` | لقطة شاشة (ضعها في `public/` وأشر إليها مثل `/shots/x.png`) |
| `"code"` | `language`, `code`, `fileName` | عرض كود ملوّن بـ Shiki بأسلوب VS Code |

> **أمان:** محتوى `html` يمر عبر DOMPurify قبل العرض داخل `<iframe sandbox>` —
> تُزال السكربتات ومعالجات الأحداث تلقائياً.

---

## مثال Markdown / MDX

نفس الحقول تُكتب YAML في الـ Frontmatter، ونص الملف يصبح وصف المشروع:

```markdown
---
slug: clipnote
name: ClipNote
tagline: إضافة متصفح لحفظ المقتطفات
source: open
type: extension
framework:
  name: TypeScript
storage: local
features:
  - حفظ بنقرة واحدة
screens:
  - id: popup
    title: النافذة
    device: desktop
    content:
      type: image
      src: /shots/clipnote.png
---

## لماذا ClipNote؟
نص Markdown حر يُعرض في صفحة المشروع…
```

انظر `data/projects/clipnote.md` و`data/projects/taskflow.json` لمثالين كاملين.

> **انتبه في YAML:** النص الذي يحتوي نقطتين `:` يجب تطويقه بعلامتي اقتباس،
> وإلا فسّره YAML ككائن:
> `- "خصوصية كاملة: لا خوادم"` ✅ وليس `- خصوصية كاملة: لا خوادم` ❌

## التحقق

عند البناء يتحقق المشروع من الحقول المطلوبة والقيم وصحة `links[].target`
ومعرّفات `architecture` — أي خطأ يوقف البناء برسالة توضح الملف والحقل.
