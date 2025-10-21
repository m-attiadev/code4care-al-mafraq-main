import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle, Search, HeartPulse, ShieldCheck, Sun, Sparkles, Syringe, Eye, BookOpen, SunSnow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast";

const Diseases = () => {
  // قاموس الأمراض من WHO (قابل للتحديث)
  const [query, setQuery] = useState("");
  const initialDiseases = [
    {
      name: "الإنفلونزا",
      desc: "مرض فيروسي موسمي يسبب ارتفاع الحرارة والسعال وألم العضلات",
      tips: ["التطعيم السنوي ضد الإنفلونزا", "غسل اليدين وتغطية الفم عند السعال", "الراحة وشرب السوائل"],
      link: "https://www.who.int/ar/health-topics/influenza",
    },
    {
      name: "السكري",
      desc: "اضطراب مزمن يؤثر على تنظيم سكر الدم",
      tips: ["نظام غذائي متوازن", "نشاط بدني ومراقبة السكر", "اتباع تعليمات الطبيب"],
      link: "https://www.who.int/ar/news-room/fact-sheets/detail/diabetes",
    },
    {
      name: "ضغط الدم",
      desc: "ارتفاع الضغط يزيد خطر أمراض القلب والسكتة",
      tips: ["تقليل الملح", "قياس الضغط بانتظام", "الالتزام بالأدوية"],
      link: "https://www.who.int/ar/news-room/fact-sheets/detail/hypertension",
    },
    {
      name: "أمراض الجهاز التنفسي",
      desc: "مثل الربو والتهاب الشعب؛ تتأثر بالعوامل البيئية",
      tips: ["تجنب المهيجات", "استخدام الكمامة في الأماكن المزدحمة", "مراجعة الطبيب عند ضيق النفس"],
      link: "https://www.who.int/ar/health-topics/respiratory-diseases",
    },
  ];
  const [diseases, setDiseases] = useState(initialDiseases);
  const filtered = diseases.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()) || d.desc.toLowerCase().includes(query.toLowerCase()),
  );

  const fetchWho = async () => {
    try {
      const res = await fetch("/who_diseases.json");
      if (!res.ok) throw new Error("تعذر الوصول لملف WHO المحلي");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((d: any) => ({
        name: d.name,
        desc: d.desc || "",
        tips: [],
        link: d.link,
      }));
      if (normalized.length > 0) {
        setDiseases(normalized);
        showSuccessToast("تم التحديث من منظمة الصحة العالمية (WHO).");
      } else {
        showErrorToast("لا توجد عناصر في المصدر WHO.");
      }
    } catch (e) {
      showErrorToast("حدث خطأ أثناء جلب بيانات WHO.");
    }
  };

  // مساعد الأعراض
  const SYMPTOMS = [
    { key: "fever", label: "حمى" },
    { key: "cough", label: "سعال" },
    { key: "sore_throat", label: "التهاب حلق" },
    { key: "headache", label: "صداع" },
    { key: "short_breath", label: "ضيق نفس" },
    { key: "chest_pain", label: "ألم صدر" },
    { key: "rash", label: "طفح جلدي" },
    { key: "vomit", label: "إقياء" },
    { key: "diarrhea", label: "إسهال" },
  ];
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const toggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };
  const symptomHints = useMemo(() => {
    const s = new Set(selectedSymptoms);
    const hints: { title: string; tips: string[]; urgent?: boolean }[] = [];
    if (s.has("fever") && s.has("cough")) {
      hints.push({
        title: "إنفلونزا أو نزلة برد",
        tips: ["راحة وسوائل دافئة", "مسكنات خفيفة عند الحاجة", "ابتعد عن التجمعات"],
      });
    }
    if (s.has("short_breath") || s.has("chest_pain")) {
      hints.push({
        title: "أعراض تستدعي تقييمًا عاجلًا",
        tips: ["توجه للطوارئ أو اتصل بخدمة الإسعاف فورًا", "تجنب الجهد", "راقب الأعراض"],
        urgent: true,
      });
    }
    if (s.has("rash") && s.has("fever")) {
      hints.push({ title: "التهاب أو حساسية جلدية", tips: ["تجنب المهيجات", "مراجعة طبيب جلدية إن استمر"] });
    }
    if (hints.length === 0 && s.size > 0) {
      hints.push({ title: "نصيحة عامة", tips: ["اشرب ماءً كافيًا", "نم جيدًا", "راقب الأعراض لمدة 24–48 ساعة"] });
    }
    return hints;
  }, [selectedSymptoms]);

  // خطة الوقاية الشخصية
  const [ageGroup, setAgeGroup] = useState("adult");
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [isSmoker, setIsSmoker] = useState(false);
  const [activity, setActivity] = useState("medium");
  const plan = useMemo(() => {
    const items: string[] = [];
    items.push(activity === "high" ? "نشاط بدني 150 دقيقة أسبوعيًا" : activity === "medium" ? "امشِ يوميًا 30 دقيقة" : "ابدأ بالمشي الخفيف 10–15 دقيقة");
    items.push("نظام متوازن: خضار/فاكهة/بروتينات خفيفة وتقليل السكريات");
    if (hasDiabetes) items.push("مراقبة سكر الدم ووجبات منتظمة");
    if (hasHypertension) items.push("تقليل الملح وقياس الضغط أسبوعيًا");
    if (isSmoker) items.push("خطة للإقلاع عن التدخين ودعم سلوكي");
    items.push(ageGroup === "senior" ? "فحوصات دورية للقلب والعظام والرؤية" : ageGroup === "youth" ? "نوم كافٍ وتطعيمات محدثة" : "فحص سنوي شامل");
    return items;
  }, [ageGroup, hasDiabetes, hasHypertension, isSmoker, activity]);

  // التنبيهات الموسمية
  const [season, setSeason] = useState("summer");
  const seasonTips: Record<string, string[]> = {
    summer: ["شرب الماء كل ساعة", "تجنب الشمس وقت الذروة", "استخدام واقي الشمس"],
    winter: ["طبقات ملابس دافئة", "تطعيم الإنفلونزا", "تهوية الأماكن المغلقة"],
    dust: ["كمامة في العواصف", "إغلاق النوافذ", "أدوية الربو جاهزة"],
  };

  // جدول التطعيمات والفحوصات
  const [vxAge, setVxAge] = useState("adult");
  const [vxSource, setVxSource] = useState("jordan");
  const [vaccinesData, setVaccinesData] = useState<any>(null);
  const vxTitles: Record<string, string> = { child: "الأطفال", adult: "البالغون", senior: "كبار السن" };

  async function fetchVaccines() {
    try {
      const res = await fetch("/vaccines.json");
      if (!res.ok) throw new Error("Failed to load vaccines.json");
      const data = await res.json();
      setVaccinesData(data);
      showSuccessToast("تم تحديث اللقاحات من المصادر.");
    } catch (e) {
      showErrorToast("تعذّر جلب بيانات اللقاحات. حاول لاحقاً.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* العنوان */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6 shadow-custom-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-3 font-arabic">الأمراض والوقاية</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              مركز مبتكر للتثقيف الصحي والمساعدة السريعة على الجوال
            </p>
          </div>

          {/* التبويبات الرئيسية */}
          <Tabs defaultValue="symptoms" className="w-full">
            <TabsList className="flex w-full overflow-x-auto snap-x snap-mandatory flex-row-reverse gap-2 pb-2 mb-8 no-scrollbar">
              <TabsTrigger value="symptoms" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <HeartPulse className="w-4 h-4 ml-2" />
                مساعد الأعراض
              </TabsTrigger>
              <TabsTrigger value="prevention" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <ShieldCheck className="w-4 h-4 ml-2" />
                الوقاية
              </TabsTrigger>
              <TabsTrigger value="season" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <SunSnow className="w-4 h-4 ml-2" />
                الأمراض الموسمية
              </TabsTrigger>
              <TabsTrigger value="myths" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <Eye className="w-4 h-4 ml-2" />
                تصحيح المعتقدات
              </TabsTrigger>
              <TabsTrigger value="dictionary" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <BookOpen className="w-4 h-4 ml-2" />
                قاموس الأمراض
              </TabsTrigger>
              <TabsTrigger value="vaccines" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <Syringe className="w-4 h-4 ml-2" />
                اللقاحات
              </TabsTrigger>
            </TabsList>

            {/* تبويب مساعد الأعراض */}
            <TabsContent value="symptoms">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><HeartPulse className="w-6 h-6" />مساعد الأعراض</h2>
                <p className="text-muted-foreground mb-4 font-arabic">اختر الأعراض التي تشعر بها لرؤية اقتراحات فورية. هذه معلومات عامة وليست تشخيصًا نهائيًا.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {SYMPTOMS.map((s) => (
                    <label key={s.key} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer">
                      <Checkbox checked={selectedSymptoms.includes(s.key)} onCheckedChange={() => toggleSymptom(s.key)} />
                      <span className="font-arabic text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>
                {symptomHints.length > 0 && (
                  <div className="space-y-4">
                    {symptomHints.map((h, i) => (
                      <Card key={i} className={`p-4 ${h.urgent ? "border-red-500" : ""}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={h.urgent ? "destructive" : "secondary"} className="font-arabic">{h.urgent ? "تنبيه مهم" : "اقتراح"}</Badge>
                          <span className="font-arabic font-semibold">{h.title}</span>
                        </div>
                        <ul className="list-disc pr-6 space-y-1 text-sm font-arabic">
                          {h.tips.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* تبويب خطة الوقاية */}
            <TabsContent value="prevention">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><ShieldCheck className="w-6 h-6" />خطة الوقاية الشخصية</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm mb-2 font-arabic">الفئة العمرية</label>
                    <Select value={ageGroup} onValueChange={setAgeGroup}>
                      <SelectTrigger className="font-arabic"><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youth">ناشئ/شاب</SelectItem>
                        <SelectItem value="adult">بالغ</SelectItem>
                        <SelectItem value="senior">كبار السن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-arabic">الحالات المزمنة</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2"><Checkbox checked={hasDiabetes} onCheckedChange={() => setHasDiabetes((v) => !v)} /> <span className="text-sm font-arabic">سكري</span></label>
                      <label className="flex items-center gap-2"><Checkbox checked={hasHypertension} onCheckedChange={() => setHasHypertension((v) => !v)} /> <span className="text-sm font-arabic">ضغط</span></label>
                      <label className="flex items-center gap-2"><Checkbox checked={isSmoker} onCheckedChange={() => setIsSmoker((v) => !v)} /> <span className="text-sm font-arabic">مدخن</span></label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-arabic">مستوى النشاط</label>
                    <div className="flex gap-2">
                      {[
                        { key: "low", label: "منخفض" },
                        { key: "medium", label: "متوسط" },
                        { key: "high", label: "مرتفع" },
                      ].map((a) => (
                        <Button key={a.key} variant={activity === a.key ? "default" : "outline"} className="font-arabic" onClick={() => setActivity(a.key)}>
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 font-arabic">خطة مقترحة</h3>
                  <ul className="list-disc pr-6 space-y-1 text-sm font-arabic">
                    {plan.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            </TabsContent>

            {/* تبويب التنبيهات الموسمية */}
            <TabsContent value="season">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><Sun className="w-6 h-6" />تنبيهات موسمية</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { key: "summer", label: "الصيف" },
                    { key: "winter", label: "الشتاء" },
                    { key: "dust", label: "العواصف الترابية" },
                  ].map((s) => (
                    <Button key={s.key} variant={season === s.key ? "default" : "outline"} className="font-arabic" onClick={() => setSeason(s.key)}>
                      {s.label}
                    </Button>
                  ))}
                </div>
                <ul className="list-disc pr-6 space-y-1 text-sm font-arabic">
                  {seasonTips[season].map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            {/* تبويب أساطير وحقائق */}
            <TabsContent value="myths">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><Sparkles className="w-6 h-6" />أساطير وحقائق</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="m1">
                    <AccordionTrigger className="font-arabic">المضادات الحيوية تعالج الفيروسات؟</AccordionTrigger>
                    <AccordionContent className="font-arabic">خاطئ. المضادات الحيوية تعمل على البكتيريا وليس الفيروسات مثل الإنفلونزا.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="m2">
                    <AccordionTrigger className="font-arabic">الحمى دائمًا خطيرة؟</AccordionTrigger>
                    <AccordionContent className="font-arabic">ليست دائمًا. الحمى علامة على مقاومة الجسم، ويجب تقييمها مع الأعراض الأخرى.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="m3">
                    <AccordionTrigger className="font-arabic">اللقاحات تسبب المرض؟</AccordionTrigger>
                    <AccordionContent className="font-arabic">غير صحيح. اللقاحات آمنة وتقلل خطر الأمراض الشديدة وفقًا للمنظمات الصحية.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </TabsContent>

            {/* تبويب قاموس الأمراض */}
            <TabsContent value="dictionary">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-primary font-arabic flex items-center gap-2"><AlertCircle className="w-6 h-6" />قاموس الأمراض</h2>
                  <Button variant="secondary" className="font-arabic" onClick={fetchWho}>تحديث من WHO</Button>
                </div>
                <div className="mb-4 max-w-2xl">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input placeholder="ابحث عن مرض أو نصيحة وقائية..." value={query} onChange={(e) => setQuery(e.target.value)} className="pr-10 font-arabic" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((d, i) => (
                    <Card key={d.name} className="p-6 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      <h3 className="text-xl font-bold text-primary mb-2 font-arabic flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> {d.name}
                      </h3>
                      <p className="text-muted-foreground font-arabic mb-4">{d.desc}</p>
                      <ul className="list-disc pr-6 space-y-1 text-sm text-foreground font-arabic">
                        {d.tips.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <Button variant="outline" className="font-arabic" onClick={() => window.open(d.link, "_blank")}>مصدر موثوق</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* تبويب التطعيمات والفحوصات */}
            <TabsContent value="vaccines">
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><Syringe className="w-6 h-6" />التطعيمات والفحوصات</h2>
                <div className="flex flex-col md:flex-row md:items-center md:gap-3 max-w-2xl mb-4">
                  <div className="max-w-sm">
                    <label className="block text-sm mb-2 font-arabic">المصدر</label>
                    <Select value={vxSource} onValueChange={setVxSource}>
                      <SelectTrigger className="font-arabic"><SelectValue placeholder="اختر المصدر" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jordan">الأردن (البرنامج الوطني)</SelectItem>
                        <SelectItem value="who">WHO (إرشادات عامة)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="max-w-sm">
                    <label className="block text-sm mb-2 font-arabic">الفئة العمرية</label>
                    <Select value={vxAge} onValueChange={setVxAge}>
                      <SelectTrigger className="font-arabic"><SelectValue placeholder="الفئة" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="child">أطفال</SelectItem>
                        <SelectItem value="adult">بالغون</SelectItem>
                        <SelectItem value="senior">كبار السن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2 md:mt-6">
                    <Button variant="secondary" className="font-arabic" onClick={fetchVaccines}>تحديث اللقاحات</Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="font-semibold font-arabic">{vxTitles[vxAge]}</div>
                  {(() => {
                    const vxList = vaccinesData?.[vxSource]?.[vxAge] || [];
                    if (!vxList.length) {
                      return <p className="text-sm text-muted-foreground font-arabic">حمّل البيانات أو اختر مصدر مختلف.</p>;
                    }
                    return (
                      <div className="space-y-3">
                        {vxList.map((v: any) => (
                          <div key={v.name} className="flex flex-col md:flex-row md:items-center md:gap-3 p-3 rounded-lg border">
                            <Badge variant="secondary" className="font-arabic">{v.name}</Badge>
                            <div className="text-xs text-muted-foreground font-arabic">{v.schedule}</div>
                            <div className="text-xs text-foreground font-arabic">{v.notes}</div>
                            <Button variant="outline" size="sm" className="font-arabic mt-2 md:mt-0" onClick={() => window.open(v.source, "_blank")}>مصدر</Button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Diseases;
