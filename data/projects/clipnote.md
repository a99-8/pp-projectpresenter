---
slug: clipnote
name: ClipNote
tagline: إضافة متصفح لحفظ المقتطفات والملاحظات السريعة من أي صفحة
description: |
  إضافة خفيفة تتيح تحديد أي نص في الصفحة وحفظه كملاحظة موسومة،
  مع بحث فوري وتصدير Markdown. كل البيانات تبقى على جهازك.
source: open
repoUrl: https://github.com/username/clipnote
type: extension
framework:
  name: TypeScript
  icon: typescript
stack:
  - TypeScript
  - Vite
  - WebExtensions API
storage: local
status: active
featured: false
year: 2024
features:
  - حفظ المقتطف المحدد بنقرة واحدة من قائمة السياق
  - وسوم وبحث فوري عبر كل الملاحظات
  - تصدير الملاحظات بصيغة Markdown
  - مزامنة اختيارية عبر chrome.storage.sync
highlights:
  - "خصوصية كاملة: لا خوادم، لا تتبع، كل شيء محلي"
  - حجم أقل من 200KB
  - تعمل على Chrome وFirefox وEdge
challenges:
  - title: توافق Manifest V3
    problem: الانتقال من Manifest V2 إلى V3 ألغى صفحات الخلفية الدائمة التي كان يعتمد عليها البحث.
    solution: نقل الفهرسة إلى Service Worker مع فهرس مصغّر يُبنى كسولاً عند أول بحث، فبقيت الاستجابة أقل من 50ms.
screens:
  - id: popup
    title: نافذة الإضافة
    device: desktop
    description: الواجهة المنبثقة لحفظ ملاحظة جديدة من الصفحة الحالية.
    content:
      type: html
      html: "<div style='height:100%;background:#fff;font-family:system-ui;color:#0f172a;display:flex;flex-direction:column'><div style='padding:10px 12px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:8px'><div style='width:22px;height:22px;border-radius:6px;background:#f59e0b;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800'>✎</div><div style='font-size:12px;font-weight:800'>ClipNote</div><div style='margin-right:auto;font-size:9px;color:#64748b'>127 ملاحظة</div></div><div style='padding:10px 12px;flex:1;display:flex;flex-direction:column;gap:8px'><div style='border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:10px;color:#94a3b8;height:70px'>النص المحدد من الصفحة يظهر هنا…</div><div style='display:flex;gap:6px'><div style='font-size:9px;background:#fef3c7;color:#b45309;border-radius:6px;padding:4px 8px'>+ وسم</div><div style='font-size:9px;background:#f1f5f9;color:#64748b;border-radius:6px;padding:4px 8px'>برمجة</div><div style='font-size:9px;background:#f1f5f9;color:#64748b;border-radius:6px;padding:4px 8px'>أفكار</div></div></div><div style='padding:10px 12px;border-top:1px solid #e2e8f0;display:flex;gap:8px'><div style='flex:1;background:#f59e0b;color:#fff;text-align:center;border-radius:8px;padding:8px;font-size:11px;font-weight:700'>حفظ الملاحظة</div><div style='background:#f1f5f9;color:#334155;border-radius:8px;padding:8px 10px;font-size:11px'>🔍</div></div></div>"
    links:
      - label: حفظ والانتقال للمكتبة
        target: libcode
        hotspot:
          x: 3
          y: 84
          w: 72
          h: 12
  - id: libcode
    title: طبقة التخزين
    device: desktop
    description: قراءة وكتابة الملاحظات في التخزين المحلي للإضافة.
    content:
      type: code
      language: ts
      fileName: src/lib/storage.ts
      code: |
        export interface Note {
          id: string;
          text: string;
          tags: string[];
          sourceUrl: string;
          createdAt: number;
        }

        const KEY = "notes";

        export async function getNotes(): Promise<Note[]> {
          const { [KEY]: notes = [] } =
            await chrome.storage.local.get(KEY);
          return notes;
        }

        export async function saveNote(note: Note) {
          const notes = await getNotes();
          await chrome.storage.local.set({
            [KEY]: [note, ...notes],
          });
        }
    links: []
---

## لماذا ClipNote؟

أدوات تدوين الملاحظات الكاملة ثقيلة لمجرد **حفظ فقرة أعجبتك** أثناء القراءة.
ClipNote تسد هذه الفجوة: تحدد النص، نقرة يمين، «حفظ في ClipNote» — انتهى.

- لا حسابات ولا تسجيل دخول
- البيانات ملكك بالكامل وتُصدَّر بضغطة واحدة
- البحث يعمل على النص والوسوم وعنوان الصفحة المصدر
