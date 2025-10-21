import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Users,
  MapPin,
  Phone,
  Search,
  Clock,
  Stethoscope,
  Languages,
  Building2,
  Star,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "@/hooks/use-toast";

type DoctorItem = {
  id: string | number;
  name: string;
  specialty?: string;
  clinic?: string;
  address?: string;
  phone?: string;
  experienceYears?: number;
  languages?: string[];
  workingHours?: string;
  rating?: number;
  notes?: string;
  location?: { lat: number; lng: number };
};

const LOCAL_MAFRAQ_DOCTORS: DoctorItem[] = [
  {
    id: "loc-1",
    name: "د. أحمد الخالدي",
    specialty: "طب عام",
    clinic: "عيادة الخالدي",
    address: "وسط البلد، المفرق",
    phone: "+962 7 9000 1111",
    experienceYears: 12,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "السبت–الخميس: 9ص–6م",
    rating: 4.6,
    location: { lat: 32.347, lng: 36.205 },
  },
  {
    id: "loc-2",
    name: "د. سارة العزام",
    specialty: "أطفال",
    clinic: "عيادة صحة الطفل",
    address: "شارع الجامعة، المفرق",
    phone: "+962 7 9000 2222",
    experienceYears: 9,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "السبت–الخميس: 10ص–7م",
    rating: 4.8,
    location: { lat: 32.35, lng: 36.21 },
  },
  {
    id: "loc-3",
    name: "د. عمر بني حسن",
    specialty: "باطنية",
    clinic: "مركز الباطنية التخصصي",
    address: "الحسين، المفرق",
    phone: "+962 7 9000 3333",
    experienceYears: 15,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "الأحد–الخميس: 9ص–5م",
    rating: 4.7,
    location: { lat: 32.34, lng: 36.22 },
  },
  {
    id: "loc-4",
    name: "د. ليلى الحراحشة",
    specialty: "نسائية وتوليد",
    clinic: "العيادة النسائية",
    address: "دوار البريد، المفرق",
    phone: "+962 7 9000 4444",
    experienceYears: 11,
    languages: ["العربية"],
    workingHours: "السبت–الأربعاء: 12م–7م",
    rating: 4.5,
    location: { lat: 32.345, lng: 36.214 },
  },
  {
    id: "loc-5",
    name: "د. محمد العمري",
    specialty: "أسنان",
    clinic: "عيادة العمري لطب الأسنان",
    address: "الحي الجنوبي، المفرق",
    phone: "+962 7 9000 5555",
    experienceYears: 8,
    languages: ["العربية"],
    workingHours: "السبت–الخميس: 10ص–8م",
    rating: 4.4,
    location: { lat: 32.338, lng: 36.199 },
  },
  {
    id: "loc-6",
    name: "د. هبة الزعبي",
    specialty: "جلدية",
    clinic: "عيادة البشرة والجلد",
    address: "شارع الملك عبدالله، المفرق",
    phone: "+962 7 9000 6666",
    experienceYears: 10,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "الأحد–الخميس: 11ص–6م",
    rating: 4.6,
    location: { lat: 32.343, lng: 36.212 },
  },
  {
    id: "loc-7",
    name: "د. فادي المشاقبة",
    specialty: "عظام",
    clinic: "عيادة العظام والمفاصل",
    address: "شارع المستشفى، المفرق",
    phone: "+962 7 9000 7777",
    experienceYears: 13,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "السبت–الخميس: 9ص–5م",
    rating: 4.7,
    location: { lat: 32.351, lng: 36.208 },
  },
  {
    id: "loc-8",
    name: "د. رنا الغزاوي",
    specialty: "عيون",
    clinic: "مركز العيون الحديث",
    address: "قرب دوار الثقافة، المفرق",
    phone: "+962 7 9000 8888",
    experienceYears: 7,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "السبت–الخميس: 12م–8م",
    rating: 4.5,
    location: { lat: 32.336, lng: 36.197 },
  },
  {
    id: "loc-9",
    name: "د. حسين الروسان",
    specialty: "أنف وأذن وحنجرة",
    clinic: "عيادة الأنف والأذن",
    address: "شارع البلدية، المفرق",
    phone: "+962 7 9000 9999",
    experienceYears: 16,
    languages: ["العربية"],
    workingHours: "الأحد–الخميس: 10ص–6م",
    rating: 4.8,
    location: { lat: 32.344, lng: 36.202 },
  },
  {
    id: "loc-10",
    name: "د. منى عبيدات",
    specialty: "قلب وأوعية",
    clinic: "مركز القلب",
    address: "دوار الجامعة، المفرق",
    phone: "+962 7 9000 1234",
    experienceYears: 14,
    languages: ["العربية", "الإنجليزية"],
    workingHours: "السبت–الخميس: 9ص–4م",
    rating: 4.6,
    location: { lat: 32.348, lng: 36.209 },
  },
];

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<DoctorItem[]>(LOCAL_MAFRAQ_DOCTORS);

  const openMap = (d: DoctorItem) => {
    const nameQuery = encodeURIComponent(`${d.name} المفرق الأردن`);
    const lat = d.location?.lat;
    const lng = d.location?.lng;
    let url = `https://www.google.com/maps/search/?api=1&query=${nameQuery}`;
    if (lat && lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    window.open(url, "_blank");
  };

  const fetchOnline = async () => {
    try {
      setLoading(true);
      const res = await fetch("/doctors.json");
      if (!res.ok) throw new Error("تعذر الوصول للمصدر المحلي");
      const data = await res.json();
      setList(data);
      showSuccessToast("تم التحديث من المصدر المحلي.");
    } catch (e) {
      showErrorToast("حدث خطأ أثناء جلب البيانات من المصدر المحلي.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFromGooglePlaces = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      showErrorToast("مفقود مفتاح Google Places. أضف VITE_GOOGLE_PLACES_API_KEY.");
      return;
    }
    try {
      setLoading(true);
      const center = { lat: 32.342, lng: 36.209 };
      const radius = 45000; // بالمتر
      const keyword = encodeURIComponent("doctor clinic hospital طبيب عيادة مستشفى");
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${center.lat},${center.lng}&radius=${radius}&keyword=${keyword}&language=ar&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results || [];
      const places: DoctorItem[] = results.map((p: any) => ({
        id: p.place_id,
        name: p.name || "منشأة صحية",
        address: p.vicinity || "المفرق، الأردن",
        location: p.geometry?.location
          ? { lat: p.geometry.location.lat, lng: p.geometry.location.lng }
          : undefined,
        phone: "",
        specialty: undefined,
        clinic: undefined,
      }));
      setList((prev) => {
        const all = [...prev, ...places];
        const seen = new Set<string>();
        return all.filter((it) => {
          const k = `${it.name}-${it.location?.lat}-${it.location?.lng}-${it.phone ?? ""}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
      });
      showSuccessToast("تم تحديث القائمة من Google Places.");
    } catch (e) {
      showErrorToast("تعذّر جلب البيانات من Google Places. حاول لاحقاً.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOnline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filtered = list.filter((d) => {
    const langStr = (d.languages || []).join(", ").toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.specialty || "").toLowerCase().includes(q) ||
      (d.clinic || "").toLowerCase().includes(q) ||
      (d.address || "").toLowerCase().includes(q) ||
      langStr.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 mb-6 shadow-custom-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              دليل الأطباء
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              قائمة الأطباء حسب التخصص في محافظة المفرق
            </p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4 animate-slide-up">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ابحث عن طبيب أو تخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 font-arabic"
              />
            </div>
            <Button
              onClick={fetchOnline}
              disabled={loading}
              className="font-arabic w-full md:w-auto"
            >
              {loading ? "جارِ التحديث..." : "تحديث من المصدر المحلي"}
            </Button>
            </div>
            <div className="mb-6 text-muted-foreground font-arabic">
              تم العثور على {filtered.length} طبيب/عيادة (مصدر: محلي)
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4 font-arabic">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارِ تحميل البيانات...</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((d, index) => (
              <Card
                key={d.id}
                className="p-6 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-bold text-primary mb-2 font-arabic">
                  {d.name}
                </h3>
                <div className="space-y-3 mb-4">
                  {d.specialty && (
                    <div className="flex items-center gap-3 text-sm">
                      <Stethoscope className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-arabic">
                        {d.specialty}
                      </span>
                    </div>
                  )}
                  {d.clinic && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-arabic">
                        {d.clinic}
                      </span>
                    </div>
                  )}
                  {typeof d.experienceYears === "number" && (
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-arabic">
                        {d.experienceYears} سنة خبرة
                      </span>
                    </div>
                  )}
                  {d.languages?.length && (
                    <div className="flex items-center gap-3 text-sm">
                      <Languages className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-arabic">
                        {d.languages.join("، ")}
                      </span>
                    </div>
                  )}
                  {d.workingHours && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-arabic">
                        {d.workingHours}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-arabic">
                      {d.address}
                    </span>
                  </div>
                  {d.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground" dir="ltr">
                        {d.phone}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {d.phone && (
                    <Button
                      className="flex-1 font-arabic"
                      onClick={() => window.open(`tel:${d.phone}`)}
                    >
                      اتصال
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
