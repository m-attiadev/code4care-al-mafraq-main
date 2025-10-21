import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ReviewItem {
  id: string;
  hospital?: string;
  clinic: string;
  doctor: string;
  description: string;
  rating: number; // 1..5
  date: string; // ISO string
}

const StarIcon = ({ filled = false, className = "w-5 h-5" }: { filled?: boolean; className?: string }) => (
  <Star className={className + (filled ? " text-yellow-500" : " text-muted-foreground")} fill={filled ? "currentColor" : "none"} />
);

export default function Reviews() {
  const [hospital, setHospital] = useState("");
  const [clinic, setClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("mafraq_reviews");
      if (cached) setReviews(JSON.parse(cached));
    } catch (e) {}
  }, []);

  const saveReviews = (list: ReviewItem[]) => {
    setReviews(list);
    try {
      localStorage.setItem("mafraq_reviews", JSON.stringify(list));
    } catch {}
  };

  const deleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    saveReviews(updatedReviews);
    setSuccess("تم حذف التقييم بنجاح");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    if (!clinic.trim()) {
      setError("يرجى إدخال اسم العيادة");
      return;
    }
    if (!doctor.trim()) {
      setError("يرجى إدخال اسم الدكتور");
      return;
    }
    if (!description.trim()) {
      setError("يرجى إدخال وصف قصير للتجربة");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("يرجى اختيار تقييم بين 1 إلى 5 نجوم");
      return;
    }

    const item: ReviewItem = {
      id: `${Date.now()}`,
      hospital: hospital.trim() || undefined,
      clinic: clinic.trim(),
      doctor: doctor.trim(),
      description: description.trim(),
      rating,
      date: new Date().toISOString(),
    };
    const next = [item, ...reviews].slice(0, 200); // حد أقصى 200 مراجعة محليًا
    saveReviews(next);
    setSuccess("تم حفظ مراجعتك بنجاح");
    setHospital("");
    setClinic("");
    setDoctor("");
    setDescription("");
    setRating(0);
  };

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-JO", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-custom-lg">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 font-arabic">التقييمات والمراجعات</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic">شارك تجربتك مع الخدمات الطبية في المفرق: اسم المستشفى (إن وجد)، العيادة، الطبيب، وصف مختصر، وتقييم النجوم.</p>
            <div className="mt-3">
              <Badge className="font-arabic bg-amber-500/20 text-amber-700 dark:text-amber-400">خدمة مُبرزة</Badge>
            </div>
          </div>

          {/* Form */}
          <Card className="p-6 mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-primary mb-4 font-arabic">أضف مراجعتك</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-arabic mb-2 block">اسم المستشفى (اختياري)</label>
                <Input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="مثال: مستشفى المفرق الحكومي" className="font-arabic" />
              </div>
              <div>
                <label className="text-sm font-arabic mb-2 block">اسم العيادة</label>
                <Input value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="مثال: عيادة الشفاء" className="font-arabic" />
              </div>
              <div>
                <label className="text-sm font-arabic mb-2 block">اسم الدكتور</label>
                <Input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="مثال: د. محمد أحمد" className="font-arabic" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-arabic mb-2 block">وصف التجربة</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً عن الخدمة التي حصلت عليها"
                  className="w-full h-28 rounded-md border bg-background px-3 py-2 text-sm font-arabic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-arabic mb-2 block">تقييم الخدمة (نجوم)</label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-1 rounded hover:bg-muted"
                    onClick={() => setRating(i)}
                    aria-label={`تقييم ${i} نجوم`}
                  >
                    <StarIcon filled={i <= rating} className="w-7 h-7" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground font-arabic">{rating ? `${rating} / 5` : "اختر"}</span>
              </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600 font-arabic">{error}</div>}
            {success && <div className="mt-4 text-sm text-green-600 font-arabic">{success}</div>}

            <div className="mt-6">
              <Button className="font-arabic" onClick={handleSubmit}>إرسال المراجعة</Button>
            </div>
          </Card>

          {/* Stats */}
          <div className="mb-6 text-muted-foreground font-arabic">
            {reviews.length > 0 ? (
              <span>عدد المراجعات: {reviews.length} — المتوسط: {avgRating} نجوم</span>
            ) : (
              <span>لا توجد مراجعات بعد. كن أول من يقيّم.</span>
            )}
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, index) => (
              <Card key={r.id} className="p-6 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <StarIcon key={i} filled={i <= r.rating} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground font-arabic">{formatDate(r.date)}</div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="font-arabic">
                        <AlertDialogHeader>
                          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من أنك تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteReview(r.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="space-y-1 mb-3 font-arabic">
                  {r.hospital && (<div className="text-sm text-muted-foreground">المستشفى: <span className="text-foreground">{r.hospital}</span></div>)}
                  <div className="text-sm text-muted-foreground">العيادة: <span className="text-foreground">{r.clinic}</span></div>
                  <div className="text-sm text-muted-foreground">الدكتور: <span className="text-foreground">{r.doctor}</span></div>
                </div>
                <p className="text-sm text-muted-foreground font-arabic leading-relaxed">{r.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}