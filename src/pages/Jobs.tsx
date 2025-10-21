import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, MapPin, Search, Stethoscope, Clock, ExternalLink } from "lucide-react";
import { formatTime12hFromDate } from "@/lib/utils";

interface JobItem {
  id: string;
  title: string;
  company?: { display_name: string };
  location?: { display_name: string };
  description?: string;
  created?: string;
  redirect_url?: string;
}

const APP_ID = import.meta.env.VITE_ADZUNA_APP_ID || "84b58859";
const API_KEY = import.meta.env.VITE_ADZUNA_API_KEY || "f48445f07eaa3057a6f397c890a22730";

const countries = [
  { code: "us", label: "الولايات المتحدة" },
  { code: "gb", label: "المملكة المتحدة" },
  { code: "ca", label: "كندا" },
  { code: "au", label: "أستراليا" },
  { code: "sg", label: "سنغافورة" },
  { code: "za", label: "جنوب أفريقيا" },
  { code: "de", label: "ألمانيا" },
  { code: "fr", label: "فرنسا" },
  { code: "nl", label: "هولندا" },
];

const specialties = [
  // أزلنا خيار "كل التخصصات" بقيمة فارغة لتوافق مكوّن Select
  { key: "nurse", label: "التمريض" },
  { key: "pediatrics", label: "طب الأطفال" },
  { key: "surgeon", label: "الجراحة" },
  { key: "radiology", label: "الأشعة" },
  { key: "lab technician", label: "المختبرات" },
  { key: "pharmacist", label: "الصيدلة" },
  { key: "doctor", label: "الطب العام" },
];

export default function Jobs() {
  const [country, setCountry] = useState<string>("us");
  const [query, setQuery] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");
  const [where, setWhere] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const perPage = 20;
  const refreshIntervalMs = 120_000; // تحديث كل دقيقتين
  const timerRef = useRef<number | null>(null);

  const searchTerm = useMemo(() => {
    const parts = [query.trim(), specialty.trim()].filter(Boolean);
    return parts.join(" ");
  }, [query, specialty]);

  const buildUrl = useCallback(() => {
    const base = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: API_KEY,
      results_per_page: String(perPage),
      sort_by: "date",
    });
    if (searchTerm) params.set("what", searchTerm);
    if (where.trim()) params.set("where", where.trim());
    return `${base}?${params.toString()}`;
  }, [country, page, searchTerm, where]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const directUrl = buildUrl();
      let results: JobItem[] = [];
  
      // محاولة الجلب مباشرة
      try {
        const res = await fetch(directUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        results = data?.results || [];
      } catch (directErr) {
        // فشل مباشر: جرّب عبر Proxy إن كان مفعّلًا
        if (USE_PROXY) {
          // 1) بروكسي محلي عبر Vite
          try {
            const localUrl = directUrl.replace("https://api.adzuna.com", LOCAL_PROXY_PREFIX);
            const lres = await fetch(localUrl);
            if (!lres.ok) throw new Error(`LOCAL PROXY HTTP ${lres.status}`);
            const data = await lres.json();
            results = data?.results || [];
          } catch (localErr) {
            // 2) بروكسي خارجي AllOrigins
            try {
              const proxyUrl = `${CORS_PROXY}/get?url=${encodeURIComponent(directUrl)}`;
              const pres = await fetch(proxyUrl);
              if (!pres.ok) throw new Error(`PROXY HTTP ${pres.status}`);
              const wrapper = await pres.json();
              const data = JSON.parse(wrapper?.contents || "{}");
              results = data?.results || [];
            } catch (proxyErr) {
              // استخدام بيانات تجريبية كحل أخير
              results = SAMPLE_JOBS;
              setError("تعذر الجلب من API حتى عبر البروكسي. تم عرض بيانات تجريبية.");
            }
          }
        } else {
          results = SAMPLE_JOBS;
          setError("تعذر الجلب من API. فعّل البروكسي أو زوّد مفاتيح صحيحة. تم عرض بيانات تجريبية.");
        }
      }
  
      setJobs(results);
      setLastUpdated(new Date());
    } catch (e: any) {
      setJobs(SAMPLE_JOBS);
      setError("حدث خطأ غير متوقع أثناء الجلب. تم عرض بيانات تجريبية.");
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    fetchJobs();
    // إعداد تحديث دوري
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => fetchJobs(), refreshIntervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [fetchJobs]);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("ar-JO", { day: "numeric", month: "long", year: "numeric" }) : "";

  const onNext = () => setPage((p) => p + 1);
  const onPrev = () => setPage((p) => Math.max(1, p - 1));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-custom-lg">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 font-arabic">وظائف القطاع الطبي</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic">استعرض أحدث وظائف الأطباء والممرضين والفنيين الصحيين عبر Adzuna.</p>
            <div className="mt-3">
              <Badge className="font-arabic bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">تحديث تلقائي كل دقيقتين</Badge>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4 md:p-6 mb-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-arabic mb-2 block text-right">بحث نصي</label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="مثال: cardiology, ICU, GP" className="pr-10 font-arabic text-right" />
                </div>
              </div>
              <div>
                <label className="text-sm font-arabic mb-2 block text-right">التخصص</label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="w-full font-arabic">
                    <SelectValue placeholder="اختَر تخصصًا" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-arabic mb-2 block text-right">الدولة</label>
                <Select value={country} onValueChange={(v) => { setCountry(v); setPage(1); }}>
                  <SelectTrigger className="w-full font-arabic">
                    <SelectValue placeholder="اختَر دولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-arabic mb-2 block text-right">المنطقة/المدينة</label>
                <Input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="مثال: London, New York" className="font-arabic text-right" />
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground font-arabic text-right sm:text-left">
                {lastUpdated ? (
                  <>آخر تحديث: {formatTime12hFromDate(lastUpdated)}</>
                ) : (
                  <>جارِ التحميل...</>
                )}
              </div>
              <div className="flex gap-2 justify-end sm:justify-start">
                <Button className="font-arabic" variant="outline" onClick={() => { setPage(1); fetchJobs(); }}>تحديث الآن</Button>
                <Button className="font-arabic" onClick={fetchJobs} disabled={loading}>{loading ? "جارِ الجلب..." : "بحث"}</Button>
              </div>
            </div>
          </Card>

          {/* Jobs count */}
          <div className="mb-6 text-muted-foreground font-arabic">
            {jobs.length > 0 ? (
              <span>عدد النتائج: {jobs.length} (صفحة {page})</span>
            ) : (
              <span>{loading ? "جارِ الجلب..." : "لا توجد نتائج حالياً"}</span>
            )}
          </div>

          {/* Jobs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <Card key={job.id || index} className="p-6 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <h3 className="text-xl font-bold text-primary mb-2 font-arabic text-right">{job.title}</h3>
                <div className="space-y-2 text-sm font-arabic text-muted-foreground mb-3 text-right">
                  {job.company?.display_name && (
                    <div className="flex items-center gap-2 flex-row-reverse text-right"><Building2 className="w-4 h-4 ml-2" /><span className="text-foreground">{job.company.display_name}</span></div>
                  )}
                  {job.location?.display_name && (
                    <div className="flex items-center gap-2 flex-row-reverse text-right"><MapPin className="w-4 h-4 ml-2" /><span className="text-foreground">{job.location.display_name}</span></div>
                  )}
                  {job.created && (
                    <div className="flex items-center gap-2 flex-row-reverse text-right"><Clock className="w-4 h-4 ml-2" /><span className="text-foreground">{formatDate(job.created)}</span></div>
                  )}
                </div>
                {job.description && (
                  <p className="text-sm text-muted-foreground font-arabic leading-relaxed line-clamp-5 text-right">{job.description}</p>
                )}
                <div className="mt-4">
                  {job.redirect_url && (
                    <Button asChild className="font-arabic">
                      <a href={job.redirect_url} target="_blank" rel="noreferrer" aria-label="التقديم على الوظيفة" className="flex items-center gap-2 flex-row-reverse">
                        <ExternalLink className="ml-2 w-4 h-4" />
                        التقديم على الوظيفة
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button variant="outline" className="font-arabic" onClick={onPrev} disabled={page === 1 || loading}>السابق</Button>
            <Button className="font-arabic" onClick={onNext} disabled={loading}>التالي</Button>
          </div>

          {error && (
            <div className="mt-6 text-center text-red-600 text-sm font-arabic">{error}</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}