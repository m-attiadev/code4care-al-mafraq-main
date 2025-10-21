import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, AlertTriangle, Stethoscope, HeartPulse } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

type Answer = "none" | "mild" | "moderate" | "severe";

const Telehealth = () => {
  const [fever, setFever] = useState<Answer>("none");
  const [cough, setCough] = useState<Answer>("none");
  const [breath, setBreath] = useState<Answer>("none");
  const [chestPain, setChestPain] = useState<Answer>("none");
  const [durationDays, setDurationDays] = useState<string>("0");

  const triage = useMemo(() => {
    const days = Number(durationDays || "0");
    const emergent = breath === "severe" || chestPain === "severe";
    const urgent = fever === "severe" || cough === "severe" || breath === "moderate" || chestPain === "moderate";
    if (emergent) {
      return {
        level: "طارئ",
        advice: "توجّه فوراً إلى أقرب قسم طوارئ أو اتصل بـ 911",
        color: "text-red-600",
      };
    }
    if (urgent || days >= 3) {
      return {
        level: "مستعجل",
        advice: "يفضل مراجعة طبيب خلال 24 ساعة واتباع التعليمات الوقائية",
        color: "text-orange-600",
      };
    }
    if (fever !== "none" || cough !== "none") {
      return {
        level: "غير طارئ",
        advice: "الراحة وشرب السوائل، راقب الأعراض واطلب استشارة إن ساءت",
        color: "text-emerald-600",
      };
    }
    return {
      level: "طبيعي",
      advice: "لا توجد مؤشرات مقلقة حالياً. حافظ على الإرشادات العامة للصحة",
      color: "text-slate-600",
    };
  }, [fever, cough, breath, chestPain, durationDays]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 mb-6 shadow-custom-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              الاستشارات الطبية عن بُعد
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              استشارات صحية ذكية بمساعدة الذكاء الاصطناعي
            </p>
          </div>

          {/* نموذج تقييم أولي للأعراض */}
          <div className="max-w-2xl mx-auto animate-slide-up">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> تقييم الأعراض الأولي
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-arabic">
                <div>
                  <label className="text-sm text-muted-foreground">الحمّى</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {(["none","mild","moderate","severe"] as Answer[]).map((v) => (
                      <Button key={v} variant={fever===v?"default":"outline"} size="sm" onClick={() => setFever(v)}>
                        {v === "none" ? "لا توجد" : v === "mild" ? "خفيفة" : v === "moderate" ? "متوسطة" : "شديدة"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">السعال</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {(["none","mild","moderate","severe"] as Answer[]).map((v) => (
                      <Button key={v} variant={cough===v?"default":"outline"} size="sm" onClick={() => setCough(v)}>
                        {v === "none" ? "لا يوجد" : v === "mild" ? "خفيف" : v === "moderate" ? "متوسط" : "شديد"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">ضيق التنفس</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {(["none","mild","moderate","severe"] as Answer[]).map((v) => (
                      <Button key={v} variant={breath===v?"default":"outline"} size="sm" onClick={() => setBreath(v)}>
                        {v === "none" ? "لا يوجد" : v === "mild" ? "خفيف" : v === "moderate" ? "متوسط" : "شديد"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">ألم الصدر</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {(["none","mild","moderate","severe"] as Answer[]).map((v) => (
                      <Button key={v} variant={chestPain===v?"default":"outline"} size="sm" onClick={() => setChestPain(v)}>
                        {v === "none" ? "لا يوجد" : v === "mild" ? "خفيف" : v === "moderate" ? "متوسط" : "شديد"}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">مدة الأعراض (أيام)</label>
                  <Input value={durationDays} onChange={(e)=>setDurationDays(e.target.value)} type="number" min={0} />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-secondary/20">
                <div className={`text-lg font-bold font-arabic flex items-center gap-2 ${triage.color}`}>
                  <AlertTriangle className="w-5 h-5" /> مستوى القلق: {triage.level}
                </div>
                <p className="text-muted-foreground font-arabic mt-2">{triage.advice}</p>
                <p className="text-xs text-muted-foreground font-arabic mt-2">هذه الأداة لا تُغني عن تقييم الطبيب. في الحالات الطارئة اتصل بـ 911 فوراً.</p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                <Button className="font-arabic" onClick={() => window.open("tel:911")}>اتصل بالطوارئ 911</Button>
                <Button variant="outline" className="font-arabic" onClick={() => window.open(`/hospitals?type=${triage.level==="طارئ"?"حكومي":"all"}&q=مستشفى`,`_self`)}>
                  <HeartPulse className="w-4 h-4 ml-2" /> المستشفيات القريبة
                </Button>
                <Button variant="outline" className="font-arabic" onClick={() => window.open("/doctors","_self")}>
                  <Stethoscope className="w-4 h-4 ml-2" /> دليل الأطباء
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Telehealth;
