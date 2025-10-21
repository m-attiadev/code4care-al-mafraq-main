# Code4Care المفرق — توثيق المشروع

## نظرة عامة

منصة صحية موجهة لسكان محافظة المفرق، تقدّم صفحات وخدمات للتثقيف الصحي، التبرع بالدم، قراءة التحاليل، دليل الأطباء، والمستشفيات، مع تجربة عربية كاملة (RTL). تعتمد على React + Vite + TypeScript وواجهة shadcn-ui و Tailwind CSS.

## التقنيات المستخدمة

- React 18 و TypeScript
- Vite (تطوير وبناء) — المنفذ الافتراضي للتطوير: `8080`
- React Router v6 (التوجيه)
- shadcn-ui + Radix UI + Tailwind CSS
- Lucide Icons
- TanStack Query (تهيئة مزوّد البيانات)

## بنية المشروع

- `src/App.tsx`: الجذر، يهيّئ `BrowserRouter`، المزودات، و RTL.
- `src/main.tsx`: نقطة الدخول للتطبيق.
- `src/pages/*`: صفحات التطبيق (مثلاً: `Hospitals.tsx`, `Doctors.tsx`, `HealthAI.tsx`, `BloodDonation.tsx`, `Telehealth.tsx`, `Nutrition.tsx`, `LabAnalysis.tsx`, `MentalHealth.tsx`, `Fitness.tsx`, `Diseases.tsx`, `Government.tsx`, `Blog.tsx`, `Index.tsx`, `NotFound.tsx`).
- `src/components/*`: مكوّنات مشتركة مثل `Header`, `Footer`, `Services`, `ThemeProvider`, `ScrollToHash`.
- `src/components/ui/*`: مكوّنات shadcn-ui المغلفة.
- `src/lib/*`: أدوات ومسارات؛ `navigation-menu.ts` يحوي عناصر القائمة.
- `src/hooks/*`: هوكات مثل `use-toast` و `use-mobile`.
- `tailwind.config.ts` و `src/index.css`: إعدادات الأنماط.
- `vite.config.ts`: تهيئة Vite (المنفذ 8080، alias `@` إلى `src`).

## المتطلبات

- Node.js و npm مثبتين.

## التثبيت والتشغيل

- تثبيت الاعتمادات:

```sh
npm i
```

- تشغيل بيئة التطوير (يفتح على `http://localhost:8080/`):

```sh
npm run dev
```

- بناء الإنتاج:

```sh
npm run build
```

- معاينة البناء:

```sh
npm run preview
```

## سكربتات npm

- `dev`: تشغيل خادم التطوير.
- `build`: بناء الإنتاج.
- `build:dev`: بناء بنمط التطوير.
- `preview`: معاينة مجلد `dist`.
- `lint`: تشغيل ESLint.

## التوجيه والمسارات

التوجيه في `src/App.tsx` باستخدام `Routes`:

- `/` → الصفحة الرئيسية `Index`
- `/hospitals` → المستشفيات
- `/blood-donation` → التبرع بالدم
- `/lab-analysis` → قراءة التحاليل
- `/health-ai` → الفحوصات الذكية
- `/telehealth` → الاستشارات عن بُعد
- `/doctors` → دليل الأطباء
- `/diseases` → التثقيف الصحي
- `/government` → الجهات الحكومية
- `/blog` → المقالات
- `*` → صفحة غير موجودة `NotFound`

القائمة العليا تبنى من `src/lib/navigation-menu.ts` وتُستخدم داخل `Header`.

## RTL واللغة

يتم ضبط اتجاه الصفحة واللغة العربية عبر `RTLSetter` داخل `App.tsx`:

- يحدد `document.documentElement.dir = "rtl"`
- يحدد `document.documentElement.lang = "ar"`

## المكوّنات الرئيسية

- `Header`: شعار وقائمة التنقل، مع قائمة جانبية للجوال.
- `Footer`: روابط ومعلومات الفريق.
- `Services`: شبكة بطاقات للخدمات تقود إلى الصفحات.
- `ThemeProvider`: تبديل الثيم (فاتح/داكن).
- `Toaster` و `Sonner`: التنبيهات.
- `ScrollToHash`: التمرير إلى المراسي داخل الصفحة.

## الأنماط والتصميم

- Tailwind CSS مفعّل عبر `src/index.css` و `tailwind.config.ts`.
- shadcn-ui مبني على Radix UI؛ المكوّنات موجودة في `src/components/ui/*`.
- استخدام فئة `font-arabic` للخطوط العربية ضمن الصفحات.

## البيانات والخدمات

- صفحات مثل `Hospitals` و `Doctors` تستعمل Overpass API وخرائط جوجل عبر روابط خارجية، مع تخزين محلي `localStorage` للتخزين المؤقت.
- مزوّد TanStack Query مهيّأ عالميًا في `App.tsx` لتهيئة مستقبلًا لأي جلب بيانات.

## إضافة صفحة جديدة

1. أنشئ ملفًا داخل `src/pages/MyPage.tsx`.
2. أضف مسارًا داخل `src/App.tsx`:

```tsx
<Route path="/my-page" element={<MyPage />} />
```

3. (اختياري) أضف رابطًا جديدًا في القائمة عبر `src/lib/navigation-menu.ts`.
4. (اختياري) أضف بطاقة في `Services` للانتقال إلى الصفحة.

## تغيير المنفذ

- المنفذ مضبوط إلى `8080` في `vite.config.ts` تحت `server.port`. يمكن تغييره هناك.

## النشر

- نفّذ `npm run build` ثم ارفع محتوى مجلد `dist` لأي خادم ثابت (Netlify/Vercel/Nginx).

## ملاحظات وأفضل الممارسات

- حافظ على النصوص العربية و RTL متسقين.
- استخدم مكوّنات `ui/` لواجهة موحّدة.
- حدّث `navigation-menu.ts` عند إضافة/حذف صفحات.
- راقب استدعاءات الشبكة لـ Overpass API لتجنّب تجاوز المعدل.
