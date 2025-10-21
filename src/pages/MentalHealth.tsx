import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeartPulse, Calendar, MapPin, Phone, Video, User, Clock, Stethoscope, Search, Building2, Languages, CalendarCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyBookings from "@/components/EmptyBookings";
import { formatTime12h } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MentalHealth = () => {
  const [q1, setQ1] = useState<number>(0);
  const [q2, setQ2] = useState<number>(0);
  const score = useMemo(() => q1 + q2, [q1, q2]);
  const result = useMemo(() => {
    if (score >= 3) {
      return {
        level: "احتمال وجود أعراض اكتئاب",
        advice: "يفضل التواصل مع مختص نفسي أو طبيب عام لتقييم أعمق",
        color: "text-orange-600",
      };
    }
    if (score >= 1) {
      return {
        level: "مؤشرات خفيفة",
        advice: "جرّب تمارين الاسترخاء والنوم الكافي والمتابعة الذاتية",
        color: "text-emerald-600",
      };
    }
    return {
      level: "طبيعي",
      advice: "لا توجد مؤشرات مقلقة حالياً. استمر بالعادات الصحية",
      color: "text-slate-600",
    };
  }, [score]);

  // GAD-2
  const [g1, setG1] = useState<number>(0);
  const [g2, setG2] = useState<number>(0);
  const gScore = useMemo(() => g1 + g2, [g1, g2]);
  const gResult = useMemo(() => {
    if (gScore >= 3) {
      return {
        level: "احتمال وجود أعراض قلق",
        advice: "يفضل التواصل مع مختص نفسي لتقييم أعمق وإجراءات داعمة",
        color: "text-orange-600",
      };
    }
    if (gScore >= 1) {
      return {
        level: "مؤشرات خفيفة",
        advice: "تمارين التنفس العميق، تنظيم النوم، وتخفيف المنبّهات",
        color: "text-emerald-600",
      };
    }
    return {
      level: "طبيعي",
      advice: "لا توجد مؤشرات مقلقة حالياً. استمر بالعادات الصحية",
      color: "text-slate-600",
    };
  }, [gScore]);

  // بيانات الأطباء النفسيين في المفرق
  type MHDoctor = {
    id: string;
    name: string;
    title?: string;
    clinic: string;
    address: string;
    phone: string;
    methods: ("clinic" | "video" | "phone")[];
    languages?: string[];
    workingHours?: string;
    rating?: number;
  };

  const mentalDoctors = useMemo<MHDoctor[]>(
    () => [
      {
        id: "mh-1",
        name: "د. رائد الخوالدة",
        title: "استشاري طب نفسي",
        clinic: "عيادة الراحة النفسية",
        address: "شارع الجامعة، المفرق",
        phone: "+962 7 9012 3456",
        methods: ["clinic", "video", "phone"],
        languages: ["العربية", "الإنجليزية"],
        workingHours: "السبت–الخميس: 10ص–6م",
        rating: 4.7,
      },
      {
        id: "mh-2",
        name: "د. هبة الزعبي",
        title: "أخصائية علاج نفسي",
        clinic: "مركز التوازن",
        address: "دوار البريد، المفرق",
        phone: "+962 7 9099 1122",
        methods: ["clinic", "video"],
        languages: ["العربية"],
        workingHours: "الأحد–الخميس: 12م–7م",
        rating: 4.6,
      },
      {
        id: "mh-3",
        name: "د. محمد الرواشدة",
        title: "استشاري طب نفسي",
        clinic: "عيادة نور",
        address: "الحسين، المفرق",
        phone: "+962 7 9088 3344",
        methods: ["clinic", "phone"],
        languages: ["العربية"],
        workingHours: "السبت–الخميس: 9ص–5م",
        rating: 4.5,
      },
    ],
    []
  );

  // حالة الحجز
  const [docQuery, setDocQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<MHDoctor | null>(null);
  const [bookingMethod, setBookingMethod] = useState<"clinic" | "video" | "phone">("clinic");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<string>("");
  const [bookingError, setBookingError] = useState<string>("");
  const [myBookings, setMyBookings] = useState<any[]>([]);
const [tab, setTab] = useState<"tests" | "booking" | "my-bookings">("tests");
const [pendingScrollBookingId, setPendingScrollBookingId] = useState<string | null>(null);
const [highlightBookingId, setHighlightBookingId] = useState<string | null>(null);
const myBookingsRef = useRef<HTMLDivElement | null>(null);
const MIN_TIME = "09:00";
const MAX_TIME = "17:00";
const todayString = useMemo(() => new Date().toISOString().slice(0,10), []);
const maxDateString = useMemo(() => { const d = new Date(); d.setDate(d.getDate()+60); return d.toISOString().slice(0,10); }, []);

  const confirmRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("mentalBookings") || "[]");
      list.sort((a:any,b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMyBookings(list);
    } catch {
      setMyBookings([]);
    }
  }, []);

  useEffect(() => {
    if (selectedDoctor && confirmRef.current) {
      confirmRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (tab === "my-bookings") {
      // تمرير سلس إلى رأس الصفحة
      window.scrollTo({ top: 0, behavior: "smooth" });
      // إبراز البطاقة الجديدة إن وُجدت
      if (pendingScrollBookingId) {
        setHighlightBookingId(pendingScrollBookingId);
        setTimeout(() => setHighlightBookingId(null), 1800);
        setPendingScrollBookingId(null);
      }
    }
  }, [tab, pendingScrollBookingId]);

  const filteredDoctors = useMemo(
    () =>
      mentalDoctors.filter(
        (d) =>
          d.name.includes(docQuery) ||
          d.clinic.includes(docQuery) ||
          d.address.includes(docQuery)
      ),
    [docQuery, mentalDoctors]
  );

  const openMap = (d: MHDoctor) => {
    const nameQuery = encodeURIComponent(`${d.clinic} ${d.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${nameQuery}`, "_blank");
  };

  const confirmBooking = () => {
    // إعادة ضبط الرسائل
    setBookingError("");
    setBookingSuccess("");

    // تحقّق الحقول الأساسية
    if (!selectedDoctor || !bookingDate || !bookingTime || !userName || !userPhone) {
      setBookingError("رجاءً أكمل جميع الحقول المطلوبة.");
      return;
    }

    // حدود التاريخ والوقت
    const pad = (n: number) => n.toString().padStart(2, "0");
    const today = new Date();
    const minDateStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
    const maxD = new Date();
    maxD.setDate(maxD.getDate()+60);
    const maxDateStr = `${maxD.getFullYear()}-${pad(maxD.getMonth()+1)}-${pad(maxD.getDate())}`;

    const toMinutes = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60 + m; };

    // تحقّق التاريخ
    const dateObj = new Date(bookingDate);
    const minDateObj = new Date(minDateStr);
    const maxDateObj = new Date(maxDateStr);
    if (isNaN(dateObj.getTime())) {
      setBookingError("رجاءً اختر تاريخاً صالحاً.");
      return;
    }
    if (dateObj < minDateObj || dateObj > maxDateObj) {
      setBookingError(`التاريخ يجب أن يكون بين ${minDateStr} و ${maxDateStr}.`);
      return;
    }

    // تحقّق الوقت
    if (!/^\d{2}:\d{2}$/.test(bookingTime)) {
      setBookingError("رجاءً اختر وقتاً صالحاً.");
      return;
    }
    if (toMinutes(bookingTime) < toMinutes(MIN_TIME) || toMinutes(bookingTime) > toMinutes(MAX_TIME)) {
      setBookingError(`الوقت يجب أن يكون بين ${formatTime12h(MIN_TIME)} و ${formatTime12h(MAX_TIME)}.`);
      return;
    }

    const id = `${Date.now()}`;
    const entry = {
      id,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      clinic: selectedDoctor.clinic,
      method: bookingMethod,
      date: bookingDate,
      time: bookingTime,
      userName,
      userPhone,
      createdAt: new Date().toISOString(),
    };
    const list = JSON.parse(localStorage.getItem("mentalBookings") || "[]");
    const newList = [entry, ...list];
    localStorage.setItem("mentalBookings", JSON.stringify(newList));
    setMyBookings((prev) => [entry, ...prev]);
    setBookingSuccess("تم إرسال طلب الحجز، سنقوم بالتواصل لتأكيد الموعد.");
    setPendingScrollBookingId(id);
    setTab("my-bookings");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 mb-6 shadow-custom-lg">
              <HeartPulse className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              الصحة النفسية والعافية
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              اختبارات ونصائح للصحة النفسية والاسترخاء
            </p>
          </div>

          {/* التبويبات الرئيسية */}
          <Tabs value={tab} onValueChange={(v)=>setTab(v as any)} className="w-full">
            <TabsList className="flex w-full overflow-x-auto snap-x snap-mandatory flex-row-reverse gap-2 pb-2 md:max-w-xl md:mx-auto md:pb-0 mb-8">
              <TabsTrigger value="tests" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <HeartPulse className="w-4 h-4 ml-2" />
                اختبارات سريعة
              </TabsTrigger>
              <TabsTrigger value="booking" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[180px] flex-row-reverse">
                <Calendar className="w-4 h-4 ml-2" />
                حجز جلسة في المفرق
              </TabsTrigger>
              <TabsTrigger value="my-bookings" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <CalendarCheck className="w-4 h-4 ml-2" />
                حجوزاتي
              </TabsTrigger>
            </TabsList>

            {/* تبويب الاختبارات */}
            <TabsContent value="tests">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-slide-up">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-primary mb-4 font-arabic">اختبار PHQ-2 (الاكتئاب)</h2>
                  <div className="space-y-4 font-arabic">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">خلال الأسبوعين الماضيين، كم مرة شعرت بـ: قلة الاهتمام أو المتعة في القيام بالأشياء؟</p>
                      <div className="flex gap-2">
                        {[0,1,2,3].map((v)=> (
                          <Button key={v} variant={q1===v?"default":"outline"} size="sm" onClick={()=>setQ1(v)}>
                            {v===0?"أبداً":v===1?"عدة أيام":v===2?"أكثر من نصف الأيام":"تقريباً كل يوم"}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">خلال الأسبوعين الماضيين، كم مرة شعرت بـ: الحزن أو الاكتئاب أو اليأس؟</p>
                      <div className="flex gap-2">
                        {[0,1,2,3].map((v)=> (
                          <Button key={v} variant={q2===v?"default":"outline"} size="sm" onClick={()=>setQ2(v)}>
                            {v===0?"أبداً":v===1?"عدة أيام":v===2?"أكثر من نصف الأيام":"تقريباً كل يوم"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-secondary/20">
                    <div className={`text-lg font-bold font-arabic ${result.color}`}>النتيجة: {score} / 6 — {result.level}</div>
                    <p className="text-muted-foreground font-arabic mt-2">{result.advice}</p>
                    <p className="text-xs text-muted-foreground font-arabic mt-2">هذا التقييم أولي فقط ولا يغني عن الاستشارة الطبية.</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold text-primary mb-4 font-arabic">اختبار GAD-2 (القلق)</h2>
                  <div className="space-y-4 font-arabic">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">خلال الأسبوعين الماضيين، كم مرة شعرت بـ: القلق أو التوتر أو العصبية؟</p>
                      <div className="flex gap-2">
                        {[0,1,2,3].map((v)=> (
                          <Button key={v} variant={g1===v?"default":"outline"} size="sm" onClick={()=>setG1(v)}>
                            {v===0?"أبداً":v===1?"عدة أيام":v===2?"أكثر من نصف الأيام":"تقريباً كل يوم"}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">خلال الأسبوعين الماضيين، كم مرة شعرت بـ: صعوبة في التحكم بالقلق؟</p>
                      <div className="flex gap-2">
                        {[0,1,2,3].map((v)=> (
                          <Button key={v} variant={g2===v?"default":"outline"} size="sm" onClick={()=>setG2(v)}>
                            {v===0?"أبداً":v===1?"عدة أيام":v===2?"أكثر من نصف الأيام":"تقريباً كل يوم"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-secondary/20">
                    <div className={`text-lg font-bold font-arabic ${gResult.color}`}>النتيجة: {gScore} / 6 — {gResult.level}</div>
                    <p className="text-muted-foreground font-arabic mt-2">{gResult.advice}</p>
                    <p className="text-xs text-muted-foreground font-arabic mt-2">هذه الأداة فرز أولي ولا تغني عن التشخيص الطبي.</p>
                  </div>
                </Card>
              </div>

              <div className="max-w-2xl mx-auto mt-6 text-center">
                <Button className="font-arabic" onClick={() => window.open("/doctors","_self")}>ابحث عن مختص</Button>
                <Button variant="outline" className="ml-2 font-arabic" onClick={() => window.open("tel:911")}>حالة طارئة؟ اتصل 911</Button>
                <Button variant="outline" className="ml-2 font-arabic" onClick={() => window.open("https://www.moh.gov.jo/Default/En","_blank")}>وزارة الصحة الأردنية</Button>
              </div>
            </TabsContent>

            {/* تبويب حجز جلسة */}
            <TabsContent value="booking">
              <div className="max-w-5xl mx-auto animate-slide-up">
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><Calendar className="w-6 h-6" />حجز جلسة مع مختص نفسي (المفرق)</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="ابحث بالاسم أو العيادة أو العنوان"
                        value={docQuery}
                        onChange={(e) => setDocQuery(e.target.value)}
                        className="font-arabic pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    </div>
                    <div className="w-full md:w-[220px]">
                      <Select value={bookingMethod} onValueChange={(v) => setBookingMethod(v as any)}>
                        <SelectTrigger className="font-arabic"><SelectValue placeholder="طريقة الجلسة" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clinic">حضور في العيادة</SelectItem>
                          <SelectItem value="video">مكالمة فيديو</SelectItem>
                          <SelectItem value="phone">اتصال هاتفي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {filteredDoctors.map((d) => (
                    <Card key={d.id} className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-primary font-arabic">{d.name}</h3>
                        {d.rating && (
                          <div className="text-sm text-muted-foreground">⭐ {d.rating.toFixed(1)}</div>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground font-arabic">
                        <div className="flex items-center gap-2"><Stethoscope className="w-4 h-4" /><span>{d.title || "أخصائي نفسي"}</span></div>
                        <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /><span>{d.clinic}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{d.address}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{d.phone}</span></div>
                        {d.workingHours && (<div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{d.workingHours}</span></div>)}
                        {d.languages && (<div className="flex items-center gap-2"><Languages className="w-4 h-4" /><span>{d.languages.join("، ")}</span></div>)}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button className="font-arabic" onClick={() => setSelectedDoctor(d)}>احجز الآن</Button>
                        <Button variant="outline" className="font-arabic" onClick={() => openMap(d)}><MapPin className="w-4 h-4 ml-2" />على الخريطة</Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {selectedDoctor && (
                  <div ref={confirmRef} className="scroll-mt-24">
                    <Card className="p-6">
                      <h3 className="text-lg font-bold text-primary mb-4 font-arabic">تأكيد الحجز — {selectedDoctor.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 font-arabic">الاسم الكامل</label>
                          <Input value={userName} onChange={(e)=>setUserName(e.target.value)} className="font-arabic" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 font-arabic">رقم الهاتف</label>
                          <Input value={userPhone} onChange={(e)=>setUserPhone(e.target.value)} className="font-arabic" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 font-arabic">تاريخ الموعد</label>
                          <Input type="date" value={bookingDate} onChange={(e)=>setBookingDate(e.target.value)} min={todayString} max={maxDateString} className="font-arabic" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 font-arabic">وقت الموعد</label>
                          <Input type="time" value={bookingTime} onChange={(e)=>setBookingTime(e.target.value)} min={MIN_TIME} max={MAX_TIME} step={900} className="font-arabic" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button className="font-arabic" onClick={confirmBooking}><Calendar className="w-4 h-4 ml-2" /> تأكيد الحجز</Button>
                        {bookingError && (<p className="mt-3 text-red-600 font-arabic">{bookingError}</p>)}
                        {bookingSuccess && (<p className="mt-3 text-emerald-600 font-arabic">{bookingSuccess}</p>)}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* تبويب حجوزاتي */}
            <TabsContent value="my-bookings">
              <div ref={myBookingsRef} className="max-w-5xl mx-auto animate-slide-up">
                <h2 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><CalendarCheck className="w-6 h-6" /> حجوزاتي</h2>
                {myBookings.length === 0 ? (
                  <EmptyBookings
                    title="لا توجد حجوزات في الصحة النفسية حتى الآن"
                    description="ابدأ بحجز جلسة دعم نفسي مع الأخصائي المناسب لك"
                    actionLabel="ابدأ الحجز الآن"
                    onAction={() => setTab("book-session")}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {myBookings.map((b) => (
                      <Card key={b.id} id={`booking-${b.id}`} className={`p-6 ${highlightBookingId === b.id ? "ring-2 ring-secondary/60" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-primary font-arabic">{b.doctorName}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground font-arabic">
                          <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /><span>{b.clinic}</span></div>
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className="font-arabic">{b.date} — {formatTime12h(b.time)}</span></div>
                          <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{b.userName} — {b.userPhone}</span></div>
                          <div className="flex items-center gap-2"><Video className="w-4 h-4" /><span>{b.method === "clinic" ? "حضور في العيادة" : b.method === "video" ? "مكالمة فيديو" : "اتصال هاتفي"}</span></div>
                        </div>
                        <div className="mt-4">
                          <Button variant="destructive" className="font-arabic" onClick={() => {
                            const list = JSON.parse(localStorage.getItem("mentalBookings") || "[]");
                            const newList = list.filter((x:any) => x.id !== b.id);
                            localStorage.setItem("mentalBookings", JSON.stringify(newList));
                            setMyBookings(newList);
                          }}>
                            إلغاء الحجز
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealth;
