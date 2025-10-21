import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

const Fitness = () => {
  const [heightCm, setHeightCm] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const bmi = useMemo(() => {
    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!h || !w) return 0;
    const m = h / 100;
    return Number((w / (m * m)).toFixed(1));
  }, [heightCm, weightKg]);
  const bmiInfo = useMemo(() => {
    if (!bmi) return { label: "—", advice: "أدخل الطول والوزن لحساب BMI" };
    if (bmi < 18.5) return { label: "نحافة", advice: "زِد السعرات بشكل صحي واستشر مختص عند الحاجة" };
    if (bmi < 25) return { label: "طبيعي", advice: "حافظ على نشاط يومي 30 دقيقة" };
    if (bmi < 30) return { label: "زيادة وزن", advice: "قلل السكريات وامشِ 7-10 آلاف خطوة يومياً" };
    return { label: "سمنة", advice: "اتبِع نظاماً متوازناً وزِد النشاط واستشر مختص" };
  }, [bmi]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 mb-6 shadow-custom-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              اللياقة والنشاط البدني
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              متابعة النشاط اليومي والتمارين الرياضية
            </p>
          </div>

          <div className="max-w-2xl mx-auto animate-slide-up">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4 font-arabic">حاسبة مؤشر كتلة الجسم (BMI)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-arabic">
                <div>
                  <label className="text-sm text-muted-foreground">الطول (سم)</label>
                  <Input type="number" min={0} value={heightCm} onChange={(e)=>setHeightCm(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">الوزن (كغ)</label>
                  <Input type="number" min={0} value={weightKg} onChange={(e)=>setWeightKg(e.target.value)} />
                </div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-secondary/20">
                <div className="text-lg font-bold font-arabic">BMI: {bmi || "—"} — {bmiInfo.label}</div>
                <p className="text-muted-foreground font-arabic mt-2">{bmiInfo.advice}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-primary mb-2 font-arabic">نصائح نشاط يومية</h3>
                <ul className="list-disc pr-6 space-y-1 text-sm text-foreground font-arabic">
                  <li>المشي 30 دقيقة أو 7-10 آلاف خطوة</li>
                  <li>تمارين مرونة 10 دقائق (تمطيط العضلات)</li>
                  <li>شرب الماء بانتظام وتقليل المشروبات السكرية</li>
                  <li>نوم 7-8 ساعات للحفاظ على التعافي والطاقة</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fitness;
