import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Droplet, MapPin, Users, Search, Phone, Award, ShieldCheck, Calendar, ClipboardCopy, AlertTriangle, HeartHandshake, Target, Clock, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { showErrorToast } from "@/hooks/use-toast";

// Types
type BloodSite = { id: number | string; name: string; address: string; phone?: string; hours?: string; location?: { lat: number; lng: number } };
type Donor = { id: string; name: string; phone: string; bloodType: "A"|"B"|"AB"|"O"; rh: "+"|"-"; age?: number; city?: string; lastDonation?: string; notes?: string; available?: boolean; createdAt: string };

type Pledge = { id: string; date: string; createdAt: string };

const BloodDonation = () => {

  const [sites, setSites] = useState<BloodSite[]>([]);
  const [query, setQuery] = useState("");
  const center = useMemo(() => ({ lat: 32.342, lng: 36.209 }), []);

  // قائمة ثابتة لمراكز التبرع بالدم في المفرق (نسخة احتياطية)
  const staticBloodSites: BloodSite[] = [
    { id: "b1", name: "بنك الدم - مستشفى المفرق الحكومي", address: "داخل مستشفى المفرق الحكومي – قسم بنك الدم", phone: "026230000", hours: "08:00–20:00 (قد تختلف)", location: { lat: 32.3389, lng: 36.2114 } },
  ];

  // Donors state
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donorForm, setDonorForm] = useState({ name: "", phone: "", bloodType: "O" as const, rh: "+" as const, age: "", city: "", lastDonation: "", notes: "" });

  useEffect(() => {
    const saved = localStorage.getItem("mafraq_blood_donors");
    if (saved) { try { setDonors(JSON.parse(saved)); } catch {} }
  }, []);
  useEffect(() => { localStorage.setItem("mafraq_blood_donors", JSON.stringify(donors)); }, [donors]);

  const inventory = useMemo(() => {
    const m = new Map<string, number>();
    donors.filter(d => d.available !== false).forEach(d => { const k = `${d.bloodType}${d.rh}`; m.set(k, (m.get(k)||0)+1); });
    return Array.from(m.entries()).sort();
  }, [donors]);

  const addDonor = () => {
    const name = donorForm.name.trim();
    const phone = donorForm.phone.trim();
    if (!name || !phone) return;
    const id = Date.now().toString();
    const ageNum = donorForm.age? Number(donorForm.age): undefined;
    const d: Donor = { id, name, phone, bloodType: donorForm.bloodType, rh: donorForm.rh, age: ageNum, city: donorForm.city||undefined, lastDonation: donorForm.lastDonation||undefined, notes: donorForm.notes||undefined, available: true, createdAt: new Date().toISOString() };
    setDonors(prev => [d, ...prev]);
    setDonorForm({ name: "", phone: "", bloodType: "O", rh: "+", age: "", city: "", lastDonation: "", notes: "" });
  };

  const cancelDonation = (id: string) => {
    setDonors(prev => prev.map(d => d.id === id ? { ...d, available: false } : d));
  };

  // Eligibility checker state
  const [eligibleForm, setEligibleForm] = useState({ age: "", weight: "", hb: "", gender: "ذكر", lastDonation: "" });
  const eligibility = useMemo(() => {
    const reasons: string[] = [];
    const age = Number(eligibleForm.age||0);
    const weight = Number(eligibleForm.weight||0);
    const hb = Number(eligibleForm.hb||0);
    const gender = eligibleForm.gender;
    if (age < 18 || age > 65) reasons.push("العمر يجب أن يكون بين 18 و65 سنة");
    if (weight < 50) reasons.push("الوزن يجب أن يكون على الأقل 50 كغم");
    const hbMin = gender === "أنثى" ? 12.5 : 13;
    if (hb && hb < hbMin) reasons.push(`مستوى الهيموغلوبين يحتاج أن يكون ≥ ${hbMin}`);
    let daysRemain = 0;
    if (eligibleForm.lastDonation) {
      const last = new Date(eligibleForm.lastDonation);
      const today = new Date();
      const diff = Math.floor((today.getTime() - last.getTime()) / (1000*60*60*24));
      const required = 56; // فترة تبرع الدم الكامل تقريبية
      if (diff < required) {
        daysRemain = required - diff;
        reasons.push(`يجب الانتظار ${daysRemain} يومًا قبل التبرع مرة أخرى`);
      }
    }
    const eligible = reasons.length === 0;
    const nextDate = eligibleForm.lastDonation ? new Date(new Date(eligibleForm.lastDonation).getTime() + 56*24*60*60*1000) : undefined;
    return { eligible, reasons, nextDate };
  }, [eligibleForm]);

  // ABO compatibility
  const [selectedBloodType, setSelectedBloodType] = useState<"O"|"A"|"B"|"AB">("O");
  const [selectedRh, setSelectedRh] = useState<"+"|"-">("+");

  const compatibility = useMemo(() => {
    const ABO: Record<string, { donateTo: string[]; receiveFrom: string[] }> = {
      O: { donateTo: ["O","A","B","AB"], receiveFrom: ["O"] },
      A: { donateTo: ["A","AB"], receiveFrom: ["A","O"] },
      B: { donateTo: ["B","AB"], receiveFrom: ["B","O"] },
      AB:{ donateTo: ["AB"], receiveFrom: ["A","B","O","AB"] },
    };
    const base = ABO[selectedBloodType];
    const donateTo = base.donateTo.flatMap(t => selectedRh === "-" ? [`${t}-`, `${t}+`] : [`${t}+`]);
    const receiveFrom = base.receiveFrom.flatMap(t => selectedRh === "+" ? [`${t}+`, `${t}-`] : [`${t}-`] );
    return { donateTo, receiveFrom };
  }, [selectedBloodType, selectedRh]);

  // Pledges (تعهد بالتبرع)
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [pledgeDate, setPledgeDate] = useState("");
  const [pledgeMessage, setPledgeMessage] = useState("");
  const [showPledgeMessage, setShowPledgeMessage] = useState(false);

  // Date validation helpers
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxPledgeDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // Allow pledges up to 1 year in the future
    return maxDate.toISOString().split('T')[0];
  };

  const getMaxLastDonationDate = () => {
    return getTodayDate(); // Last donation cannot be in the future
  };

  useEffect(() => {
    const saved = localStorage.getItem("mafraq_blood_pledges");
    if (saved) { try { setPledges(JSON.parse(saved)); } catch {} }
  }, []);
  useEffect(() => { localStorage.setItem("mafraq_blood_pledges", JSON.stringify(pledges)); }, [pledges]);

  const addPledge = () => {
    if (!pledgeDate) return;
    const id = Date.now().toString();
    setPledges(prev => [{ id, date: pledgeDate, createdAt: new Date().toISOString() }, ...prev]);
    setPledgeDate("");
  };

  // استخدم القائمة الاحتياطية إذا لم تتوفر نتائج الشبكة
  const list = sites.length > 0 ? sites : staticBloodSites;
  const filteredSites = list.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.address.toLowerCase().includes(query.toLowerCase()));

  const openMap = (s: BloodSite) => {
    const nameQuery = encodeURIComponent(`${s.name} المفرق الأردن`);
    const lat = s.location?.lat; const lng = s.location?.lng;
    let url = `https://www.google.com/maps/search/?api=1&query=${nameQuery}`;
    if (lat && lng) { url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}`)}&query_place_id=&center=${lat},${lng}`; }
    window.open(url, "_blank", "noopener,noreferrer");
  };



  useEffect(() => { const cached = localStorage.getItem("mafraq_blood_sites"); if (cached) { try { setSites(JSON.parse(cached)); } catch {} } }, []);

  const [copied, setCopied] = useState(false);
  const copyRequestMessage = () => {
    const msg = `نحتاج متبرع دم لفصيلة ${selectedBloodType}${selectedRh} بشكل عاجل في المفرق. من يستطيع المساعدة؟ الاتصال رقم: ______`;
    navigator.clipboard.writeText(msg).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false), 2000); });
  };

  // Donor filters
  const [filterType, setFilterType] = useState<"O"|"A"|"B"|"AB"|"all">("all");
  const [filterRh, setFilterRh] = useState<"+"|"-"|"all">("all");
  const filteredDonors = donors.filter(d => (filterType === "all" || d.bloodType === filterType) && (filterRh === "all" || d.rh === filterRh) && d.available !== false);

  const donorBadges = useMemo(() => {
    const badges: { label: string; icon: any }[] = [];
    const hasOminus = donors.some(d => d.bloodType === "O" && d.rh === "-");
    if (hasOminus) badges.push({ label: "O- بطل إنقاذ", icon: ShieldCheck });
    if (donors.length >= 5) badges.push({ label: "مجتمع داعم (5+)", icon: Users });
    if (donors.length >= 10) badges.push({ label: "حملة نشطة (10+)", icon: Award });
    return badges;
  }, [donors]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              التبرع بالدم في المفرق
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              ساهم بإنقاذ الأرواح عبر مواقع بنوك الدم ومراكز التبرع
            </p>
            <div className="mt-4 flex justify-end">
              <Badge className="font-arabic bg-amber-500/20 text-amber-700 dark:text-amber-400 shadow-sm">قسم مُبرز</Badge>
            </div>
          </div>

          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 mb-6 shadow-custom-lg">
              <Droplet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 font-arabic">التبرع بالدم</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              واجهة ابتكارية تجمع الأهلية، توافق الفصائل، التعهد، وبنوك الدم في المفرق
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Badge className="font-arabic">عدد المتبرعين: {donors.length}</Badge>
              {donorBadges.map((b, i) => (
                <Badge key={i} className="font-arabic flex items-center gap-1"><b.icon className="w-3 h-3"/> {b.label}</Badge>
              ))}
            </div>
          </div>

          {/* Blood sites + Approved donors summary side by side (moved to top) */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <h2 className="text-3xl font-bold text-primary font-arabic text-center md:text-right">بنوك الدم المتوفرة</h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                <Button variant="outline" className="font-arabic" onClick={()=>window.open("https://wa.me/962790000000?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%84%D9%82%D8%A7%D8%A6%D9%85%D8%A9%20%D8%A7%D9%84%D9%85%D8%AA%D8%A8%D8%B1%D8%B9%D9%8A%D9%86%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%85%D9%81%D8%B1%D9%82%20%D9%88%D9%81%D8%B5%D9%8A%D9%84%D8%AA%D9%8A%20____","_blank")}>الانضمام لحملة واتساب</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: search + blood sites list */}
              <div>
                {/* Search */}
                <div className="mb-6 max-w-2xl mx-auto animate-slide-up">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input placeholder="ابحث عن بنك دم أو مركز تبرع..." value={query} onChange={(e)=>setQuery(e.target.value)} className="pr-10 font-arabic" />
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSites.map((s,i) => (
                    <Card key={s.id} className="p-6 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{animationDelay:`${i*0.1}s`}}>
                      <h3 className="text-xl font-bold text-primary mb-2 font-arabic flex items-center gap-2"><Droplet className="w-5 h-5"/> {s.name}</h3>
                      <p className="text-muted-foreground font-arabic mb-3">{s.address}</p>
                      <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span dir="ltr">{s.phone||""}</span></div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button className="font-arabic" onClick={()=>openMap(s)}><MapPin className="w-4 h-4 ml-2"/>عرض على الخريطة</Button>
                        {s.phone && (<Button variant="outline" onClick={()=>window.open(`tel:${s.phone}`)}><Phone className="w-4 h-4"/></Button>)}
                      </div>
                    </Card>
                  ))}
                </div>

                {filteredSites.length===0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground font-arabic text-lg">لا توجد نتائج حالياً. جرّب تحديث المواقع.</p>
                  </div>
                )}
              </div>

              {/* Right: Approved Donors Summary (Table) */}
              <div>
                <Card className="p-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-primary font-arabic flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" /> قائمة المتبرعين المعتمدين (ملخص)
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className="font-arabic">المعروض: {Math.min(filteredDonors.length, 10)} من {filteredDonors.length}</Badge>
                      <Button variant="outline" size="sm" className="font-arabic" onClick={()=>document.getElementById('approved-donors-list')?.scrollIntoView({behavior:'smooth'})}>
                        عرض القائمة الكاملة
                      </Button>
                    </div>
                  </div>
                  {filteredDonors.length === 0 ? (
                    <p className="text-muted-foreground font-arabic">لا يوجد متبرعون معتمدون وفق عوامل التصفية الحالية.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-arabic text-right">الاسم</TableHead>
                            <TableHead className="font-arabic text-right">الفصيلة</TableHead>
                            <TableHead className="font-arabic text-right">الموقع</TableHead>
                            <TableHead className="font-arabic text-right">الهاتف</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDonors.slice(0, 10).map((d) => (
                            <TableRow key={d.id}>
                              <TableCell className="font-arabic">{d.name}</TableCell>
                              <TableCell className="font-mono" dir="ltr">{d.bloodType}{d.rh}</TableCell>
                              <TableCell className="font-arabic">{d.city || "—"}</TableCell>
                              <TableCell className="font-arabic" dir="ltr">
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={()=>window.open(`tel:${d.phone}`)}>
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                  <span className="text-xs text-muted-foreground">{d.phone}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground font-arabic">هذه القائمة تعرض عينة مختصرة. القائمة الكاملة بالأسفل مع بطاقات تفصيلية.</p>
                </Card>
              </div>
            </div>
          </div>

          {/* Innovative tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 animate-slide-up">
              <h3 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> فحص أهلية التبرع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-arabic">العمر</label><Input type="number" value={eligibleForm.age} onChange={(e)=>setEligibleForm({...eligibleForm, age:e.target.value})} className="font-arabic"/></div>
                <div><label className="text-sm font-arabic">الوزن (كغم)</label><Input type="number" value={eligibleForm.weight} onChange={(e)=>setEligibleForm({...eligibleForm, weight:e.target.value})} className="font-arabic"/></div>
                <div><label className="text-sm font-arabic">الهيموغلوبين (Hb)</label><Input type="number" value={eligibleForm.hb} onChange={(e)=>setEligibleForm({...eligibleForm, hb:e.target.value})} className="font-arabic"/></div>
                <div>
                  <label className="text-sm font-arabic">الجنس</label>
                  <select className="w-full border rounded-md p-2" value={eligibleForm.gender} onChange={(e)=>setEligibleForm({...eligibleForm, gender:e.target.value})}>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div><label className="text-sm font-arabic">آخر تاريخ تبرع</label><Input type="date" value={eligibleForm.lastDonation} onChange={(e)=>setEligibleForm({...eligibleForm, lastDonation:e.target.value})} max={getMaxLastDonationDate()} className="font-arabic"/></div>
              </div>
              <div className="mt-4">
                {eligibility.eligible ? (
                  <div className="p-3 rounded-lg bg-green-100 text-green-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4"/>
                    <span className="text-sm font-arabic">أنت مؤهل للتبرع بالدم الكامل.</span>
                    {eligibility.nextDate && (
                      <span className="text-xs font-arabic ml-2"><Calendar className="inline w-3 h-3 mr-1"/> مقترح التبرع القادم: {eligibility.nextDate.toLocaleDateString()}</span>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800">
                    <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4"/><span className="text-sm font-arabic">غير مؤهل حالياً</span></div>
                    <ul className="list-disc mr-5 text-xs space-y-1">
                      {eligibility.reasons.map((r,i)=>(<li key={i} className="font-arabic">{r}</li>))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2 font-arabic">هذه نتائج إرشادية وليست بديلاً عن تقييم طبي رسمي.</p>
              </div>
            </Card>

            <Card className="p-6 animate-slide-up">
              <h3 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center gap-2"><Target className="w-5 h-5"/> توافق فصائل الدم</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-arabic">فصيلة الدم</label>
                  <select className="w-full border rounded-md p-2" value={selectedBloodType} onChange={(e)=>setSelectedBloodType(e.target.value as any)}>
                    <option value="O">O</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-arabic">عامل الريسوس (Rh)</label>
                  <select className="w-full border rounded-md p-2" value={selectedRh} onChange={(e)=>setSelectedRh(e.target.value as any)}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                  <Button className="font-arabic" onClick={copyRequestMessage}><ClipboardCopy className="w-4 h-4 ml-2"/>نسخ رسالة طلب تبرع</Button>
                  {copied && <span className="text-xs text-green-600 font-arabic">تم النسخ</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="font-bold mb-2 font-arabic">يمكنك التبرع لـ</h4>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.donateTo.map((k)=>(<Badge key={k} className="font-arabic">{k}</Badge>))}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="font-bold mb-2 font-arabic">يمكنك الاستلام من</h4>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.receiveFrom.map((k)=>(<Badge key={k} className="font-arabic">{k}</Badge>))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-arabic">التوافق مبسّط (ABO/Rh). دائماً اتبع تعليمات بنك الدم.</p>
            </Card>
          </div>

          {/* Join form + Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 animate-slide-up">
              <h3 className="text-xl font-bold text-primary mb-4 font-arabic">نموذج الانضمام كمتبرع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-arabic">الاسم الكامل</label><Input value={donorForm.name} onChange={(e)=>setDonorForm({...donorForm,name:e.target.value})} className="font-arabic"/></div>
                <div><label className="text-sm font-arabic">رقم الهاتف</label><Input value={donorForm.phone} onChange={(e)=>setDonorForm({...donorForm,phone:e.target.value})} className="font-arabic" dir="ltr"/></div>
                <div>
                  <label className="text-sm font-arabic">فصيلة الدم</label>
                  <select className="w-full border rounded-md p-2" value={donorForm.bloodType} onChange={(e)=>setDonorForm({...donorForm,bloodType:e.target.value as Donor["bloodType"]})}>
                    <option value="O">O</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-arabic">عامل الريسوس (Rh)</label>
                  <select className="w-full border rounded-md p-2" value={donorForm.rh} onChange={(e)=>setDonorForm({...donorForm,rh:e.target.value as Donor["rh"]})}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                </div>
                <div><label className="text-sm font-arabic">العمر</label><Input type="number" value={donorForm.age} onChange={(e)=>setDonorForm({...donorForm,age:e.target.value})} className="font-arabic"/></div>
                <div><label className="text-sm font-arabic">المدينة/اللواء</label><Input value={donorForm.city} onChange={(e)=>setDonorForm({...donorForm,city:e.target.value})} className="font-arabic"/></div>
                <div><label className="text-sm font-arabic">آخر تاريخ تبرع</label><Input type="date" value={donorForm.lastDonation} onChange={(e)=>setDonorForm({...donorForm,lastDonation:e.target.value})} max={getMaxLastDonationDate()} className="font-arabic"/></div>
                <div><label className="text-sm font-arabic">ملاحظات</label><Input value={donorForm.notes} onChange={(e)=>setDonorForm({...donorForm,notes:e.target.value})} className="font-arabic"/></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="font-arabic" onClick={addDonor}>اعتماد الانضمام</Button>
                <Button variant="outline" className="font-arabic" onClick={()=>window.open("https://wa.me/962790000000?text=%D8%A3%D9%86%D8%A7%20%D9%85%D8%AA%D8%A8%D8%B1%D8%B9%20%D8%AF%D9%85%20%D9%85%D8%AA%D8%A7%D8%AD%20%D9%81%D9%8A%20%D8%A7%D9%84%D9%85%D9%81%D8%B1%D9%82%20%D9%88%D9%81%D8%B5%D9%8A%D9%84%D8%AA%D9%8A%20____","_blank")}>الانضمام لحملة واتساب</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-arabic">بالضغط على اعتماد، سيتم حفظ معلوماتك محلياً على جهازك.</p>
            </Card>

            <Card className="p-6 animate-slide-up">
              <h3 className="text-xl font-bold text-primary mb-4 font-arabic">مُلخّص الفصائل المتاحة</h3>
              {inventory.length===0? (
                <p className="text-muted-foreground font-arabic">لا توجد بيانات متبرعين بعد.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">{inventory.map(([k,c])=> (
                  <div key={k} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"><span className="font-semibold">{k}</span><span className="text-sm text-muted-foreground">{c} متبرع</span></div>
                ))}</div>
              )}
              <div className="mt-6">
                <h4 className="text-sm font-bold mb-2 font-arabic flex items-center gap-1"><Calendar className="w-4 h-4"/> التعهد بالتبرع</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                      type="date"
                      value={pledgeDate}
                      onChange={(e) => setPledgeDate(e.target.value)}
                      min={getTodayDate()}
                      max={getMaxPledgeDate()}
                      className="font-arabic"
                      required
                    />
                  <Button className="font-arabic" onClick={addPledge}><HeartHandshake className="w-4 h-4 ml-2"/>أتعهد بالتبرع</Button>
                </div>
                {pledges.length>0 && (
                  <div className="mt-3 space-y-2">
                    {pledges.slice(0,5).map(p=> (
                      <div key={p.id} className="text-xs text-muted-foreground font-arabic flex items-center gap-2"><Clock className="w-3 h-3"/> موعد التعهد: {new Date(p.date).toLocaleDateString()}</div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Approved Donors – Full List */}
          <div id="approved-donors-list" className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h3 className="text-2xl font-bold text-primary font-arabic text-center md:text-right">القائمة الكاملة للمتبرعين المعتمدين</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                <select className="border rounded-md p-2 text-sm w-full md:w-auto" value={filterType} onChange={(e)=>setFilterType(e.target.value as any)}>
                  <option value="all">كل الفصائل</option>
                  <option value="O">O</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                </select>
                <select className="border rounded-md p-2 text-sm w-full md:w-auto" value={filterRh} onChange={(e)=>setFilterRh(e.target.value as any)}>
                  <option value="all">كل Rh</option>
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDonors.map(d => (
                <Card key={d.id} className="p-6 hover:shadow-custom-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <h4 className="text-lg font-bold font-arabic">{d.name}</h4>
                      <p className="text-sm text-muted-foreground font-arabic">فصيلة: {d.bloodType}{d.rh}</p>
                      {d.city && <p className="text-sm text-muted-foreground font-arabic">الموقع: {d.city}</p>}
                      {d.lastDonation && <p className="text-xs text-muted-foreground font-arabic">آخر تبرع: {d.lastDonation}</p>}
                      {d.notes && <p className="text-xs text-muted-foreground font-arabic">ملاحظات: {d.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={()=>window.open(`tel:${d.phone}`)}><Phone className="w-4 h-4"/></Button>
                      <span className="text-xs text-muted-foreground" dir="ltr">{d.phone}</span>
                      <Button variant="destructive" size="sm" className="font-arabic" onClick={()=>cancelDonation(d.id)}>
                        <XCircle className="w-4 h-4 ml-2"/> إلغاء التبرع
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {filteredDonors.length===0 && (<p className="text-muted-foreground font-arabic">لا توجد نتائج وفق عوامل التصفية.</p>)}
            <div className="mt-4 flex justify-center md:justify-start">
              <Button variant="outline" className="font-arabic" onClick={copyRequestMessage}><ClipboardCopy className="w-4 h-4 ml-2"/>نسخ رسالة طلب تبرع بحسب التصفية</Button>
            </div>
          </div>



        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BloodDonation;
