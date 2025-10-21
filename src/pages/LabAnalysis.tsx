import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FlaskConical,
  Info,
  Droplets,
  TestTube,
  Heart,
  Pill,
  Activity,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Clock,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

type BloodTestValues = {
  hb?: number;
  wbc?: number;
  rbc?: number;
  platelets?: number;
  hematocrit?: number;
  mcv?: number;
  mch?: number;
  mchc?: number;
};

type BiochemistryValues = {
  glucose?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  urea?: number;
  creatinine?: number;
  uricAcid?: number;
  alt?: number;
  ast?: number;
  bilirubin?: number;
};

type UrineTestValues = {
  protein?: string;
  glucose?: string;
  ketones?: string;
  blood?: string;
  nitrites?: string;
  leukocytes?: string;
  specificGravity?: number;
  ph?: number;
};

type HormoneValues = {
  tsh?: number;
  t3?: number;
  t4?: number;
  cortisol?: number;
  insulin?: number;
  testosterone?: number;
  estrogen?: number;
  progesterone?: number;
};

type VitaminValues = {
  vitaminD?: number;
  vitaminB12?: number;
  folate?: number;
  iron?: number;
  ferritin?: number;
  transferrin?: number;
};

// المعدلات الطبيعية
const bloodRanges = {
  hb: { min: 12, max: 16, unit: "g/dL" },
  wbc: { min: 4, max: 10, unit: "×10³/μL" },
  rbc: { min: 4.2, max: 5.4, unit: "×10⁶/μL" },
  platelets: { min: 150, max: 400, unit: "×10³/μL" },
  hematocrit: { min: 36, max: 46, unit: "%" },
  mcv: { min: 80, max: 100, unit: "fL" },
  mch: { min: 27, max: 32, unit: "pg" },
  mchc: { min: 32, max: 36, unit: "g/dL" },
};

const biochemistryRanges = {
  glucose: { min: 70, max: 99, unit: "mg/dL" },
  cholesterol: { min: 0, max: 200, unit: "mg/dL" },
  triglycerides: { min: 0, max: 150, unit: "mg/dL" },
  hdl: { min: 40, max: 100, unit: "mg/dL" },
  ldl: { min: 0, max: 100, unit: "mg/dL" },
  urea: { min: 15, max: 45, unit: "mg/dL" },
  creatinine: { min: 0.6, max: 1.2, unit: "mg/dL" },
  uricAcid: { min: 3.5, max: 7.2, unit: "mg/dL" },
  alt: { min: 7, max: 56, unit: "U/L" },
  ast: { min: 10, max: 40, unit: "U/L" },
  bilirubin: { min: 0.3, max: 1.2, unit: "mg/dL" },
};

const hormoneRanges = {
  tsh: { min: 0.27, max: 4.2, unit: "μIU/mL" },
  t3: { min: 80, max: 200, unit: "ng/dL" },
  t4: { min: 5.1, max: 14.1, unit: "μg/dL" },
  cortisol: { min: 6.2, max: 19.4, unit: "μg/dL" },
  insulin: { min: 2.6, max: 24.9, unit: "μIU/mL" },
  testosterone: { min: 300, max: 1000, unit: "ng/dL" },
  estrogen: { min: 15, max: 350, unit: "pg/mL" },
  progesterone: { min: 0.2, max: 25, unit: "ng/mL" },
};

const vitaminRanges = {
  vitaminD: { min: 30, max: 100, unit: "ng/mL" },
  vitaminB12: { min: 200, max: 900, unit: "pg/mL" },
  folate: { min: 2.7, max: 17, unit: "ng/mL" },
  iron: { min: 60, max: 170, unit: "μg/dL" },
  ferritin: { min: 15, max: 150, unit: "ng/mL" },
  transferrin: { min: 200, max: 360, unit: "mg/dL" },
};

// دالة تفسير النتائج
const interpretResults = (values: any, ranges: any) => {
  const results: Array<{
    text: string;
    status: "normal" | "high" | "low" | "critical";
  }> = [];

  Object.keys(values).forEach((key) => {
    const value = values[key];
    const range = ranges[key];

    if (value !== undefined && value !== "" && range) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        if (numValue < range.min) {
          results.push({
            text: `${key}: ${value} ${range.unit} - منخفض (الطبيعي: ${range.min}-${range.max})`,
            status: numValue < range.min * 0.7 ? "critical" : "low",
          });
        } else if (numValue > range.max) {
          results.push({
            text: `${key}: ${value} ${range.unit} - مرتفع (الطبيعي: ${range.min}-${range.max})`,
            status: numValue > range.max * 1.5 ? "critical" : "high",
          });
        } else {
          results.push({
            text: `${key}: ${value} ${range.unit} - طبيعي`,
            status: "normal",
          });
        }
      }
    }
  });

  return results;
};

// تعريف نوع المختبر وقائمة مختبرات المفرق
type Lab = {
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  mapsQuery?: string;
};

const mafraqLabs: Lab[] = [
  {
    name: "مختبر المفرق الطبي",
    address: "شارع الملك عبدالله، قرب مستشفى المفرق",
    phone: "079 000 0001",
    workingHours: "8:00 ص – 10:00 م",
    mapsQuery: "مختبر المفرق الطبي",
  },
  {
    name: "مختبر المرجع الطبي - المفرق",
    address: "وسط البلد، المفرق",
    phone: "079 000 0002",
    workingHours: "9:00 ص – 9:00 م",
    mapsQuery: "مختبر المرجع الطبي المفرق",
  },
  {
    name: "مختبر الرائد الطبي - المفرق",
    address: "حي الحسين، المفرق",
    phone: "079 000 0003",
    workingHours: "8:30 ص – 8:30 م",
    mapsQuery: "مختبر الرائد الطبي المفرق",
  },
  {
    name: "مختبرات المفرق الحديثة",
    address: "شارع الجامعة، المفرق",
    phone: "079 000 0004",
    workingHours: "8:00 ص – 10:00 م",
    mapsQuery: "مختبرات المفرق الحديثة",
  },
];

// ... existing code ...
const LabAnalysis = () => {
  const [activeTab, setActiveTab] = useState("blood");
  const [savedTests, setSavedTests] = useState<any[]>([]);

  // حالات التحاليل المختلفة
  const [bloodValues, setBloodValues] = useState<BloodTestValues>({});
  const [biochemistryValues, setBiochemistryValues] =
    useState<BiochemistryValues>({});
  const [urineValues, setUrineValues] = useState<UrineTestValues>({});
  const [hormoneValues, setHormoneValues] = useState<HormoneValues>({});
  const [vitaminValues, setVitaminValues] = useState<VitaminValues>({});
  const [mainTab, setMainTab] = useState<"analyses" | "labs">("labs");
  const [labQuery, setLabQuery] = useState<string>("");
  const [labText, setLabText] = useState<string>("");
  const [extractMessage, setExtractMessage] = useState<string>("");
  const [copyMessage, setCopyMessage] = useState<string>("");
  const navigate = useNavigate();

  const filteredLabs = useMemo(
    () =>
      mafraqLabs.filter((lab) => {
        const q = labQuery.trim();
        if (!q) return true;
        const normalizedQ = q.replace(/\s+/g, "");
        return (
          lab.name.includes(q) ||
          lab.address.includes(q) ||
          lab.phone.replace(/\s+/g, "").includes(normalizedQ)
        );
      }),
    [labQuery]
  );

  // تفسير النتائج
  const bloodResults = useMemo(
    () => interpretResults(bloodValues, bloodRanges),
    [bloodValues]
  );
  const biochemistryResults = useMemo(
    () => interpretResults(biochemistryValues, biochemistryRanges),
    [biochemistryValues]
  );
  const hormoneResults = useMemo(
    () => interpretResults(hormoneValues, hormoneRanges),
    [hormoneValues]
  );
  const vitaminResults = useMemo(
    () => interpretResults(vitaminValues, vitaminRanges),
    [vitaminValues]
  );

  const allResults = useMemo(() => {
    return [
      ...bloodResults,
      ...biochemistryResults,
      ...hormoneResults,
      ...vitaminResults,
    ];
  }, [bloodResults, biochemistryResults, hormoneResults, vitaminResults]);

  const summaryCounts = useMemo(() => {
    const counts = { normal: 0, high: 0, low: 0, critical: 0 } as Record<string, number>;
    allResults.forEach((r: any) => {
      if (r?.status && counts[r.status] !== undefined) counts[r.status]++;
    });
    const total = allResults.length || 1;
    const normalPercent = Math.round((counts.normal / total) * 100);
    return { counts, total, normalPercent };
  }, [allResults]);

  const saveCurrentTest = () => {
    const testData = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ar-SA"),
      blood: bloodValues,
      biochemistry: biochemistryValues,
      urine: urineValues,
      hormones: hormoneValues,
      vitamins: vitaminValues,
    };
    setSavedTests((prev) => [testData, ...prev]);
  };

  const copyResults = () => {
    try {
      const text = allResults
        .map((r: any) => (typeof r?.text === "string" ? r.text : ""))
        .filter(Boolean)
        .join("\n");
      if (text) {
        navigator.clipboard?.writeText(text);
        setCopyMessage("تم نسخ النتائج إلى الحافظة");
      } else {
        setCopyMessage("لا توجد نتائج لنسخها");
      }
    } catch (e) {
      setCopyMessage("تعذّر النسخ، جرّب مجددًا");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "high":
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case "low":
        return <TrendingUp className="w-4 h-4 text-blue-500 rotate-180" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      normal: "bg-green-50 text-green-700 border border-green-200",
      high: "bg-orange-50 text-orange-700 border border-orange-200",
      low: "bg-blue-50 text-blue-700 border border-blue-200",
      critical: "bg-red-50 text-red-700 border border-red-200",
    };
    return (
      variants[status as keyof typeof variants] ||
      "bg-gray-50 text-gray-700 border"
    );
  };

  const normalizeNumber = (s: string) => {
    const cleaned = s
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/[^0-9.,]/g, "")
      .replace(/,/g, ".");
    const num = Number(cleaned);
    return isNaN(num) ? undefined : num;
  };

  const parseLabText = (text: string) => {
    const t = text.toLowerCase();
    const get = (patterns: RegExp[]) => {
      for (const p of patterns) {
        const m = t.match(p);
        if (m && m[1]) {
          const v = normalizeNumber(m[1]);
          if (v !== undefined) return v;
        }
      }
      return undefined;
    };
    const toString = (patterns: RegExp[]) => {
      for (const p of patterns) {
        const m = t.match(p);
        if (m && m[1]) return m[1].trim();
      }
      return undefined;
    };

    const blood: BloodTestValues = {
      hb: get([/(?:\bhb\b|hemoglobin|هيمو?غلوبين)[^\d]*([\d.,]+)/i]),
      wbc: get([/(?:\bwbc\b|white\s*blood|كريات\s*بيضاء)[^\d]*([\d.,]+)/i]),
      rbc: get([/(?:\brbc\b|كريات\s*حمراء)[^\d]*([\d.,]+)/i]),
      platelets: get([/(?:platelets|\bplt\b|صفائح)[^\d]*([\d.,]+)/i]),
      hematocrit: get([/(?:\bhct\b|hematocrit|هيماتوكريت)[^\d]*([\d.,]+)/i]),
      mcv: get([/(?:\bmcv\b)[^\d]*([\d.,]+)/i]),
      mch: get([/(?:\bmch\b)[^\d]*([\d.,]+)/i]),
      mchc: get([/(?:\bmchc\b)[^\d]*([\d.,]+)/i]),
    };

    const biochemistry: BiochemistryValues = {
      glucose: get([
        /(?:glucose|سكر\s*الدم|ف?بس|\bfbs\b|blood\s*sugar)[^\d]*([\d.,]+)/i,
      ]),
      cholesterol: get([/(?:cholesterol|كوليسترول)[^\d]*([\d.,]+)/i]),
      triglycerides: get([/(?:triglycerides|دهون\s*ثلاثية)[^\d]*([\d.,]+)/i]),
      hdl: get([/(?:\bhdl\b)[^\d]*([\d.,]+)/i]),
      ldl: get([/(?:\bldl\b)[^\d]*([\d.,]+)/i]),
      urea: get([/(?:urea|يوريا)[^\d]*([\d.,]+)/i]),
      creatinine: get([/(?:creatinine|كرياتينين)[^\d]*([\d.,]+)/i]),
      uricAcid: get([/(?:uric\s*acid|حمض\s*البوليك)[^\d]*([\d.,]+)/i]),
      alt: get([/(?:\balt\b|sgpt)[^\d]*([\d.,]+)/i]),
      ast: get([/(?:\bast\b|sgot)[^\d]*([\d.,]+)/i]),
      bilirubin: get([/(?:bilirubin|بيليروبين)[^\d]*([\d.,]+)/i]),
    };

    const urine: UrineTestValues = {
      protein: toString([
        /(?:urine\s*protein|بروتين\s*في\s*البول)[^\w]*(negative|positive|سالب|موجب)/i,
      ]),
      glucose: toString([
        /(?:urine\s*glucose|جلوكوز\s*بول)[^\w]*(negative|positive|سالب|موجب)/i,
      ]),
      ketones: toString([
        /(?:ketones|كيتونات)[^\w]*(negative|positive|سالب|موجب)/i,
      ]),
      blood: toString([
        /(?:blood\s*in\s*urine|دم\s*في\s*البول)[^\w]*(negative|positive|سالب|موجب)/i,
      ]),
      nitrites: toString([
        /(?:nitrites|نتريت)[^\w]*(negative|positive|سالب|موجب)/i,
      ]),
      leukocytes: toString([
        /(?:leukocytes|le\.?u?ko?cytes|كريات\s*بيضاء\s*بول)[^\w]*(negative|positive|سالب|موجب)/i,
      ]),
      specificGravity: get([
        /(?:specific\s*gravity|الكثافة\s*النوعية)[^\d]*([\d]+\.[\d]+)/i,
      ]),
      ph: get([/(?:urine\s*p\s*h|حموضة\s*البول|\bpH\b)[^\d]*([\d]+\.?[\d]*)/i]),
    };

    const hormones: HormoneValues = {
      tsh: get([/(?:\btsh\b)[^\d]*([\d.,]+)/i]),
      t3: get([/(?:\bt3\b)[^\d]*([\d.,]+)/i]),
      t4: get([/(?:\bt4\b)[^\d]*([\d.,]+)/i]),
      cortisol: get([/(?:cortisol|كورتيزول)[^\d]*([\d.,]+)/i]),
      insulin: get([/(?:insulin|انسولين)[^\d]*([\d.,]+)/i]),
      testosterone: get([/(?:testosterone|تيستوستيرون)[^\d]*([\d.,]+)/i]),
      estrogen: get([/(?:estradiol|estrogen|استروجين)[^\d]*([\d.,]+)/i]),
      progesterone: get([/(?:progesterone|بروجسترون)[^\d]*([\d.,]+)/i]),
    };

    const vitamins: VitaminValues = {
      vitaminD: get([/(?:vitamin\s*d|فيتامين\s*د)[^\d]*([\d.,]+)/i]),
      vitaminB12: get([
        /(?:vitamin\s*b12|\bb12\b|فيتامين\s*ب\s*12)[^\d]*([\d.,]+)/i,
      ]),
      folate: get([/(?:folate|حمض\s*الفوليك)[^\d]*([\d.,]+)/i]),
      iron: get([/(?:iron|حديد)[^\d]*([\d.,]+)/i]),
      ferritin: get([/(?:ferritin|فيريتين)[^\d]*([\d.,]+)/i]),
      transferrin: get([/(?:transferrin|ترانسفيرين)[^\d]*([\d.,]+)/i]),
    };

    return { blood, biochemistry, urine, hormones, vitamins };
  };

  const extractFromText = () => {
    setExtractMessage("");
    const { blood, biochemistry, urine, hormones, vitamins } = parseLabText(labText);
    setBloodValues((prev) => ({ ...prev, ...blood }));
    setBiochemistryValues((prev) => ({ ...prev, ...biochemistry }));
    setUrineValues((prev) => ({ ...prev, ...urine }));
    setHormoneValues((prev) => ({ ...prev, ...hormones }));
    setVitaminValues((prev) => ({ ...prev, ...vitamins }));
    setExtractMessage("تم استخراج القيم من النص بنجاح");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12" dir="ltr">
        <div className="container mx-auto px-4">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 shadow-custom-lg">
              <FlaskConical className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              مختبر التحاليل الطبية المتقدم
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-arabic leading-relaxed">
              منصة شاملة لإدخال وتحليل وتفسير جميع أنواع التحاليل الطبية مع حفظ
              السجلات وتتبع التطور
            </p>
          </div>



          {/* إجراءات سريعة واضحة */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">

            <Button variant="secondary" className="font-arabic" onClick={() => setMainTab('labs')}>
              <Building2 className="w-4 h-4 mr-2" />
              زيارة المختبرات
            </Button>

          </div>

          {/* تبويب عام: زيارة مختبرات المفرق */}
          <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">

            <TabsContent value="labs">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  زيارة المختبرات في محافظة المفرق
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <Input
                    value={labQuery}
                    onChange={(e) => setLabQuery(e.target.value)}
                    placeholder="ابحث عن مختبر أو عنوان..."
                    className="font-arabic"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLabs.map((lab) => (
                    <Card key={lab.name} className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FlaskConical className="w-5 h-5 text-violet-600" />
                          <span className="font-arabic font-semibold">{lab.name}</span>
                        </div>
                        <Badge variant="outline" className="font-arabic">مختبر</Badge>
                      </div>
                      <div className="space-y-2 text-sm font-arabic text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{lab.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span dir="ltr" className="font-arabic">{lab.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-arabic">{lab.workingHours}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <Button
                          className="font-arabic"
                          onClick={() => (window.location.href = `tel:${lab.phone.replace(/\s+/g, "")}`)}
                        >
                          اتصال
                        </Button>
                        <Button
                          variant="outline"
                          className="font-arabic"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lab.mapsQuery || lab.name + " المفرق")}`,
                              "_blank"
                            )
                          }
                        >
                          عرض على الخريطة
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {filteredLabs.length === 0 && (
                    <div className="col-span-full text-center text-sm text-muted-foreground font-arabic">
                      لا توجد نتائج مطابقة لبحثك.
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analyses">
                <div className="max-w-6xl mx-auto">
                  {/* التبويبات الرئيسية */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="sticky top-16 z-20 flex w-full overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 py-2 md:max-w-xl md:mx-auto md:justify-center mb-6 rounded-full bg-muted/30 backdrop-blur px-3 shadow-sm">
                      <TabsTrigger value="blood" className="font-arabic font-semibold text-base flex items-center justify-center gap-2 px-5 py-3 min-w-[180px] shrink-0 snap-start whitespace-nowrap rounded-full border border-muted-foreground/30 bg-background hover:bg-background/80 text-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Droplets className="w-5 h-5 ml-2" />
                        تحاليل الدم
                      </TabsTrigger>
                      <TabsTrigger value="biochemistry" className="font-arabic font-semibold text-base flex items-center justify-center gap-2 px-5 py-3 min-w-[180px] shrink-0 snap-start whitespace-nowrap rounded-full border border-muted-foreground/30 bg-background hover:bg-background/80 text-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <TestTube className="w-5 h-5 ml-2" />
                        الكيمياء الحيوية
                      </TabsTrigger>
                      <TabsTrigger value="urine" className="font-arabic font-semibold text-base flex items-center justify-center gap-2 px-5 py-3 min-w-[180px] shrink-0 snap-start whitespace-nowrap rounded-full border border-muted-foreground/30 bg-background hover:bg-background/80 text-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Activity className="w-5 h-5 ml-2" />
                        تحليل البول
                      </TabsTrigger>
                      <TabsTrigger value="hormones" className="font-arabic font-semibold text-base flex items-center justify-center gap-2 px-5 py-3 min-w-[180px] shrink-0 snap-start whitespace-nowrap rounded-full border border-muted-foreground/30 bg-background hover:bg-background/80 text-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Heart className="w-5 h-5 ml-2" />
                        الهرمونات
                      </TabsTrigger>
                      <TabsTrigger value="vitamins" className="font-arabic font-semibold text-base flex items-center justify-center gap-2 px-5 py-3 min-w-[180px] shrink-0 snap-start whitespace-nowrap rounded-full border border-muted-foreground/30 bg-background hover:bg-background/80 text-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Pill className="w-5 h-5 ml-2" />
                        الفيتامينات
                      </TabsTrigger>
                    </TabsList>

                    {/* عنوان ديناميق للتبويب النشط */}
                    <div className="text-center my-4">
                      <div className="inline-flex items-center justify-center gap-2 font-arabic text-lg font-semibold text-foreground">
                        {activeTab === "blood" && (<Droplets className="w-5 h-5 ml-2" />)}
                        {activeTab === "biochemistry" && (<TestTube className="w-5 h-5 ml-2" />)}
                        {activeTab === "urine" && (<Activity className="w-5 h-5 ml-2" />)}
                        {activeTab === "hormones" && (<Heart className="w-5 h-5 ml-2" />)}
                        {activeTab === "vitamins" && (<Pill className="w-5 h-5 ml-2" />)}
                        <span>
                          {activeTab === "blood"
                            ? "تحاليل الدم"
                            : activeTab === "biochemistry"
                            ? "الكيمياء الحيوية"
                            : activeTab === "urine"
                            ? "تحليل البول"
                            : activeTab === "hormones"
                            ? "الهرمونات"
                            : "الفيتامينات والمعادن"}
                        </span>
                      </div>
                    </div>

                    {/* استخراج تلقائي من نص المختبر + لوحة ملخص */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <Card className="p-6">
                        <h3 className="text-xl font-bold text-primary mb-4 font-arabic">ألصق تقرير المختبر</h3>
                        <Textarea value={labText} onChange={(e)=>setLabText(e.target.value)} placeholder="انسخ نص نتيجة التحليل هنا (بالإنجليزية أو العربية)" className="font-arabic h-32" />
                        <div className="flex items-center gap-3 mt-3">
                          <Button className="font-arabic" onClick={extractFromText}><Download className="w-4 h-4 mr-2"/>استخراج القيم</Button>
                          <Button variant="outline" className="font-arabic" onClick={copyResults}>نسخ النتائج</Button>
                          {extractMessage && (<span className="text-sm text-emerald-600 font-arabic">{extractMessage}</span>)}
                          {copyMessage && (<span className="text-sm text-blue-600 font-arabic">{copyMessage}</span>)}
                        </div>
                      </Card>

                      <Card className="p-6">
                        <h3 className="text-xl font-bold text-primary mb-4 font-arabic">نظرة سريعة</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground font-arabic">نسبة الطبيعي</span>
                            <span className="text-sm font-arabic">{summaryCounts.normalPercent}%</span>
                          </div>
                          <Progress value={summaryCounts.normalPercent} />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <Badge variant="outline" className="font-arabic bg-green-50 text-green-700 border-green-200">طبيعي: {summaryCounts.counts.normal}</Badge>
                            <Badge variant="outline" className="font-arabic bg-orange-50 text-orange-700 border-orange-200">مرتفع: {summaryCounts.counts.high}</Badge>
                            <Badge variant="outline" className="font-arabic bg-blue-50 text-blue-700 border-blue-200">منخفض: {summaryCounts.counts.low}</Badge>
                            <Badge variant="outline" className="font-arabic bg-red-50 text-red-700 border-red-200">حرِج: {summaryCounts.counts.critical}</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <TabsContent value="biochemistry">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            <TestTube className="w-5 h-5 mr-2" />
                            الكيمياء الحيوية
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(biochemistryRanges).map((key) => (
                              <div key={key}>
                                <label className="text-sm font-arabic block mb-1">
                                  {`${key} (${biochemistryRanges[key as keyof typeof biochemistryRanges].unit})`}
                                </label>
                                <Input
                                  type="number"
                                  value={
                                    biochemistryValues[
                                      key as keyof BiochemistryValues
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    setBiochemistryValues((prev) => ({
                                      ...prev,
                                      [key]: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    }))
                                  }
                                  placeholder={`${
                                    biochemistryRanges[
                                      key as keyof typeof biochemistryRanges
                                    ].min
                                  }-${
                                    biochemistryRanges[
                                      key as keyof typeof biochemistryRanges
                                    ].max
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            النتائج والتفسير
                          </h3>
                          {biochemistryResults.length === 0 ? (
                            <p className="text-muted-foreground font-arabic">
                              أدخل القيم لعرض التفسير
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {biochemistryResults.map((result, i) => (
                                <div
                                  key={i}
                                  className={`p-2 rounded-lg ${getStatusBadge(
                                    result.status
                                  )}`}
                                >
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(result.status)}
                                    <span className="text-sm font-arabic">
                                      {result.text}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      </div>
                    </TabsContent>

                    {/* تحليل البول */}
                    <TabsContent value="urine">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-slide-up">
                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            تحليل البول الكامل
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                البروتين
                              </label>
                              <Input
                                value={urineValues.protein || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    protein: e.target.value,
                                  }))
                                }
                                placeholder="سالب/موجب"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                الجلوكوز
                              </label>
                              <Input
                                value={urineValues.glucose || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    glucose: e.target.value,
                                  }))
                                }
                                placeholder="سالب/موجب"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                الكيتونات
                              </label>
                              <Input
                                value={urineValues.ketones || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    ketones: e.target.value,
                                  }))
                                }
                                placeholder="سالب/موجب"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                الدم
                              </label>
                              <Input
                                value={urineValues.blood || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    blood: e.target.value,
                                  }))
                                }
                                placeholder="سالب/موجب"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                النتريت
                              </label>
                              <Input
                                value={urineValues.nitrites || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    nitrites: e.target.value,
                                  }))
                                }
                                placeholder="سالب/موجب"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                كريات بيضاء
                              </label>
                              <Input
                                value={urineValues.leukocytes || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    leukocytes: e.target.value,
                                  }))
                                }
                                placeholder="سالب/موجب"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                الكثافة النوعية
                              </label>
                              <Input
                                type="number"
                                value={urineValues.specificGravity || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    specificGravity: Number(e.target.value),
                                  }))
                                }
                                placeholder="1.003-1.030"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-arabic block mb-1">
                                {`الحموضة (pH)`}
                              </label>
                              <Input
                                type="number"
                                value={urineValues.ph || ""}
                                onChange={(e) =>
                                  setUrineValues((prev) => ({
                                    ...prev,
                                    ph: Number(e.target.value),
                                  }))
                                }
                                placeholder="4.6-8.0"
                              />
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            تفسير تحليل البول
                          </h3>
                          <div className="space-y-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <p className="text-sm font-arabic text-blue-800">
                                <Info className="w-4 h-4 inline mr-2" />
                                تحليل البول يساعد في تشخيص أمراض الكلى والمسالك البولية
                                والسكري
                              </p>
                            </div>
                            {Object.entries(urineValues).map(([key, value]) => {
                              if (value) {
                                return (
                                  <div key={key} className="p-2 bg-gray-50 rounded">
                                    <span className="font-arabic text-sm">
                                      {key}: {value}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* الهرمونات */}
                    <TabsContent value="hormones">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-slide-up">
                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            <Heart className="w-5 h-5 ml-2" />
                            تحاليل الهرمونات
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(hormoneRanges).map((key) => (
                              <div key={key}>
                                <label className="text-sm font-arabic block mb-1">
                                  {`${key} (${hormoneRanges[key as keyof typeof hormoneRanges].unit})`}
                                </label>
                                <Input
                                  type="number"
                                  value={
                                    hormoneValues[key as keyof HormoneValues] || ""
                                  }
                                  onChange={(e) =>
                                    setHormoneValues((prev) => ({
                                      ...prev,
                                      [key]: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    }))
                                  }
                                  placeholder={`${
                                    hormoneRanges[key as keyof typeof hormoneRanges].min
                                  }-${
                                    hormoneRanges[key as keyof typeof hormoneRanges].max
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            النتائج والتفسير
                          </h3>
                          {hormoneResults.length === 0 ? (
                            <p className="text-muted-foreground font-arabic">
                              أدخل القيم لعرض التفسير
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {hormoneResults.map((result, i) => (
                                <div
                                  key={i}
                                  className={`p-2 rounded-lg ${getStatusBadge(
                                    result.status
                                  )}`}
                                >
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(result.status)}
                                    <span className="text-sm font-arabic">
                                      {result.text}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      </div>
                    </TabsContent>

                    {/* الفيتامينات */}
                    <TabsContent value="vitamins">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-slide-up">
                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            <Pill className="w-5 h-5 ml-2" />
                            الفيتامينات والمعادن
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(vitaminRanges).map((key) => (
                              <div key={key}>
                                <label className="text-sm font-arabic block mb-1">
                                  {`${key} (${vitaminRanges[key as keyof typeof vitaminRanges].unit})`}
                                </label>
                                <Input
                                  type="number"
                                  value={
                                    vitaminValues[key as keyof VitaminValues] || ""
                                  }
                                  onChange={(e) =>
                                    setVitaminValues((prev) => ({
                                      ...prev,
                                      [key]: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    }))
                                  }
                                  placeholder={`${
                                    vitaminRanges[key as keyof typeof vitaminRanges].min
                                  }-${
                                    vitaminRanges[key as keyof typeof vitaminRanges].max
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card className="p-6">
                          <h3 className="text-xl font-bold text-primary mb-4 font-arabic">
                            النتائج والتفسير
                          </h3>
                          {vitaminResults.length === 0 ? (
                            <p className="text-muted-foreground font-arabic">
                              أدخل القيم لعرض التفسير
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {vitaminResults.map((result, i) => (
                                <div
                                  key={i}
                                  className={`p-2 rounded-lg ${getStatusBadge(
                                    result.status
                                  )}`}
                                >
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(result.status)}
                                    <span className="text-sm font-arabic">
                                      {result.text}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      </div>
                    </TabsContent>
                    </Tabs>

                    {/* سجل التحاليل السابقة */}
                    <div className="mt-10">
                      <h3 className="text-xl font-bold text-primary mb-4 font-arabic">سجل التحاليل المحفوظة</h3>
                      {savedTests.length === 0 ? (
                        <p className="text-muted-foreground font-arabic">لا توجد سجلات حتى الآن. احفظ التحليل الحالي لعرضه هنا.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {savedTests.map((t) => (
                            <Card key={t.id} className="p-5">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-arabic font-semibold">{t.date}</span>
                                <Badge variant="outline" className="font-arabic">تحليل محفوظ</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground font-arabic">دم/كيمياء/بول/هرمونات/فيتامينات</div>
                              <div className="flex items-center gap-2 mt-3">
                                <Button size="sm" className="font-arabic" onClick={() => {
                                  setBloodValues(t.blood || {});
                                  setBiochemistryValues(t.biochemistry || {});
                                  setUrineValues(t.urine || {});
                                  setHormoneValues(t.hormones || {});
                                  setVitaminValues(t.vitamins || {});
                                  setActiveTab("blood");
                                }}>تحميل</Button>
                                <Button size="sm" variant="outline" className="font-arabic" onClick={() => window.print()}>طباعة</Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                  </TabsContent>
                </Tabs>

                </div>

              </main>
              <Footer />
            </div>
          );
};

export default LabAnalysis;
