import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Salad,
  Camera,
  TrendingUp,
  Apple,
  Calendar,
  CalendarCheck,
  User,
  Clock,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyBookings from "@/components/EmptyBookings";
import { formatTime12h } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";

const Nutrition = () => {
  const [foodName, setFoodName] = useState("");
  const [grams, setGrams] = useState<string>("");
  const [result, setResult] = useState<{
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  } | null>(null);

  // Booking system states
  const [tab, setTab] = useState("nutrition-analysis");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [pendingScrollBookingId, setPendingScrollBookingId] = useState<
    string | null
  >(null);
  const [highlightBookingId, setHighlightBookingId] = useState<string | null>(
    null
  );
  const myBookingsRef = useRef<HTMLDivElement>(null);
  const isFormFilled = Boolean(
    selectedDoctor && bookingDate && bookingTime && patientName && patientPhone
  );

  // Date and time validation constants
  const MIN_TIME = "09:00";
  const MAX_TIME = "17:00";
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);
  const maxDateString = maxDate.toISOString().split("T")[0];

  // Nutrition doctors in Al-Mafraq
  const nutritionDoctors = [
    {
      id: "dr-sarah",
      name: "د. سارة أحمد",
      specialty: "أخصائية تغذية علاجية",
      experience: "8 سنوات خبرة",
      location: "مستشفى المفرق الحكومي",
    },
    {
      id: "dr-omar",
      name: "د. عمر محمد",
      specialty: "أخصائي تغذية رياضية",
      experience: "6 سنوات خبرة",
      location: "عيادة التغذية المتقدمة",
    },
    {
      id: "dr-layla",
      name: "د. ليلى حسن",
      specialty: "أخصائية تغذية الأطفال",
      experience: "10 سنوات خبرة",
      location: "مركز الأمومة والطفولة",
    },
    {
      id: "dr-khalid",
      name: "د. خالد العلي",
      specialty: "أخصائي السمنة والنحافة",
      experience: "12 سنوات خبرة",
      location: "مجمع المفرق الطبي",
    },
  ];

  const db = useMemo(
    () => ({
      // per 100g values
      أرز: { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      رز: { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      خبز: { calories: 265, protein: 9, fat: 3.2, carbs: 49 },
      دجاج: { calories: 239, protein: 27, fat: 14, carbs: 0 },
      لحم: { calories: 250, protein: 26, fat: 15, carbs: 0 },
      سمك: { calories: 206, protein: 22, fat: 12, carbs: 0 },
      تفاح: { calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
      موز: { calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
      سلطة: { calories: 35, protein: 1.5, fat: 0.2, carbs: 7 },
      // English synonyms
      rice: { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      bread: { calories: 265, protein: 9, fat: 3.2, carbs: 49 },
      chicken: { calories: 239, protein: 27, fat: 14, carbs: 0 },
      beef: { calories: 250, protein: 26, fat: 15, carbs: 0 },
      fish: { calories: 206, protein: 22, fat: 12, carbs: 0 },
      apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
      banana: { calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
      salad: { calories: 35, protein: 1.5, fat: 0.2, carbs: 7 },
    }),
    []
  );

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("nutritionBookings");
    if (savedBookings) {
      setMyBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Handle scroll and highlight for new bookings
  useEffect(() => {
    if (tab === "my-bookings") {
      // Scroll to top of page smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });

      // If there's a pending booking to highlight
      if (pendingScrollBookingId) {
        setTimeout(() => {
          setHighlightBookingId(pendingScrollBookingId);
          setPendingScrollBookingId(null);

          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightBookingId(null);
          }, 3000);
        }, 500);
      }
    }
  }, [tab, pendingScrollBookingId]);

  const estimate = () => {
    const name = foodName.trim().toLowerCase();
    const gramsNum = parseFloat(grams);
    if (!name || isNaN(gramsNum) || gramsNum <= 0) {
      setResult(null);
      return;
    }
    // try exact, then simple contains match
    const entry =
      db[name] || Object.entries(db).find(([key]) => name.includes(key))?.[1];
    if (!entry) {
      setResult(null);
      return;
    }
    const factor = gramsNum / 100;
    setResult({
      calories: Math.round(entry.calories * factor),
      protein: parseFloat((entry.protein * factor).toFixed(1)),
      fat: parseFloat((entry.fat * factor).toFixed(1)),
      carbs: parseFloat((entry.carbs * factor).toFixed(1)),
    });
  };

  const confirmBooking = () => {
    setBookingError("");
    setBookingSuccess("");

    // Validation
    if (
      !selectedDoctor ||
      !bookingDate ||
      !bookingTime ||
      !patientName ||
      !patientPhone
    ) {
      setBookingError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Date validation
    const selectedDate = new Date(bookingDate);
    const todayDate = new Date(todayString);
    const maxDateObj = new Date(maxDateString);

    if (selectedDate < todayDate || selectedDate > maxDateObj) {
      setBookingError("يرجى اختيار تاريخ من اليوم حتى 60 يوماً قادماً");
      return;
    }

    // Time validation
    if (bookingTime < MIN_TIME || bookingTime > MAX_TIME) {
      setBookingError(
        `يرجى اختيار وقت بين ${formatTime12h(MIN_TIME)} و ${formatTime12h(
          MAX_TIME
        )}`
      );
      return;
    }

    // Create booking object
    const newBooking = {
      id: Date.now().toString(),
      doctor: nutritionDoctors.find((d) => d.id === selectedDoctor),
      date: bookingDate,
      time: bookingTime,
      patientName,
      patientPhone,
      createdAt: new Date().toISOString(),
      type: "nutrition",
    };

    // Save to localStorage and state (newest first)
    const existingBookings = JSON.parse(
      localStorage.getItem("nutritionBookings") || "[]"
    );
    const updatedBookings = [newBooking, ...existingBookings];
    localStorage.setItem("nutritionBookings", JSON.stringify(updatedBookings));
    setMyBookings(updatedBookings);

    // Clear form
    setSelectedDoctor("");
    setBookingDate("");
    setBookingTime("");
    setPatientName("");
    setPatientPhone("");

    setBookingSuccess("تم تأكيد حجز الجلسة بنجاح!");

    // Prepare for scroll and highlight
    setPendingScrollBookingId(newBooking.id);

    // Switch to my bookings tab
    setTimeout(() => {
      setTab("my-bookings");
    }, 1000);
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = myBookings.filter(
      (booking) => booking.id !== bookingId
    );
    localStorage.setItem("nutritionBookings", JSON.stringify(updatedBookings));
    setMyBookings(updatedBookings);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-custom-lg">
              <Salad className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              خدمات التغذية والدايت
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              تحليل القيم الغذائية وحجز جلسات مع أطباء التغذية في منطقة المفرق
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="flex w-full overflow-x-auto snap-x snap-mandatory flex-row-reverse gap-2 pb-2 md:max-w-xl md:mx-auto md:pb-0 mb-8">
              <TabsTrigger
                value="nutrition-analysis"
                className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse"
              >
                <Salad className="w-4 h-4 ml-2" />
                تحليل التغذية
              </TabsTrigger>
              <TabsTrigger
                value="book-session"
                className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[180px] flex-row-reverse"
              >
                <Calendar className="w-4 h-4 ml-2" />
                حجز جلسة
              </TabsTrigger>
              <TabsTrigger
                value="my-bookings"
                className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse"
              >
                <CalendarCheck className="w-4 h-4 ml-2" />
                حجوزاتي
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nutrition-analysis">
              <div className="text-center animate-slide-up">
                <Card className="p-8 max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-primary mb-4 font-arabic">
                    تقدير السعرات والمغذيات
                  </h2>
                  <p className="text-muted-foreground font-arabic mb-6">
                    اكتب اسم الطعام والكمية بالغرام للحصول على تقدير سريع
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <Input
                      placeholder="اسم الطعام (مثال: رز، دجاج، تفاح)"
                      className="font-arabic"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                    />
                    <Input
                      placeholder="الكمية بالغرام (مثال: 150)"
                      className="font-arabic"
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      dir="ltr"
                    />
                    <Button
                      size="lg"
                      className="font-arabic"
                      onClick={estimate}
                    >
                      <Salad className="mr-2 w-5 h-5" />
                      احسب الآن
                    </Button>
                  </div>
                  {result ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 rounded-xl border">
                        <div className="text-xs text-muted-foreground font-arabic">
                          السعرات
                        </div>
                        <div className="text-xl font-bold">
                          {result.calories}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border">
                        <div className="text-xs text-muted-foreground font-arabic">
                          البروتين غ
                        </div>
                        <div className="text-xl font-bold">
                          {result.protein}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border">
                        <div className="text-xs text-muted-foreground font-arabic">
                          الدهون غ
                        </div>
                        <div className="text-xl font-bold">{result.fat}</div>
                      </div>
                      <div className="p-4 rounded-xl border">
                        <div className="text-xs text-muted-foreground font-arabic">
                          الكربوهيدرات غ
                        </div>
                        <div className="text-xl font-bold">{result.carbs}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-arabic">
                      أدخل بيانات صحيحة لعرض النتائج.
                    </p>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="book-session">
              <div className="max-w-5xl mx-auto animate-slide-up">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6 font-arabic text-center">
                    حجز جلسة مع أخصائي التغذية
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {nutritionDoctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedDoctor === doctor.id
                            ? "ring-2 ring-green-500 bg-green-50"
                            : ""
                        }`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <div className="flex items-start space-x-6">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-primary font-arabic">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground font-arabic">
                              {doctor.specialty}
                            </p>
                            <p className="text-xs text-muted-foreground font-arabic">
                              {doctor.experience}
                            </p>
                            <div className="flex items-center mt-2">
                              <MapPin className="w-3 h-3 text-muted-foreground mr-1" />
                              <p className="text-xs text-muted-foreground font-arabic">
                                {doctor.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2 font-arabic">
                        التاريخ
                      </label>
                      <Input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={todayString}
                        max={maxDateString}
                        className="font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2 font-arabic">
                        الوقت
                      </label>
                      <Input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        min={MIN_TIME}
                        max={MAX_TIME}
                        step="900"
                        className="font-arabic"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2 font-arabic">
                        اسم المريض
                      </label>
                      <Input
                        placeholder="أدخل اسم المريض"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="font-arabic"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2 font-arabic">
                        رقم الهاتف
                      </label>
                      <Input
                        placeholder="أدخل رقم الهاتف"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="font-arabic"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      className="font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={confirmBooking}
                      disabled={!isFormFilled}
                      title={
                        !isFormFilled ? "أكمل جميع الحقول المطلوبة" : undefined
                      }
                    >
                      <Calendar className="w-4 h-4 ml-2" /> تأكيد الحجز
                    </Button>
                    {bookingError && (
                      <p className="mt-3 text-red-600 font-arabic">
                        {bookingError}
                      </p>
                    )}
                    {bookingSuccess && (
                      <p className="mt-3 text-emerald-600 font-arabic">
                        {bookingSuccess}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="my-bookings">
              <div
                ref={myBookingsRef}
                className="max-w-5xl mx-auto animate-slide-up"
              >
                <h2 className="text-xl font-bold text-primary mb-4 font-arabic flex items-center gap-2">
                  <CalendarCheck className="w-6 h-6" /> حجوزاتي
                </h2>
                {myBookings.length === 0 ? (
                  <EmptyBookings
                    title="لا توجد حجوزات في التغذية حتى الآن"
                    description="ابدأ بحجز جلسة مع أخصائي التغذية وحقق أهدافك الصحية"
                    actionLabel="ابدأ الحجز الآن"
                    onAction={() => setTab("book-session")}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {myBookings
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((booking) => (
                        <Card
                          key={booking.id}
                          id={`booking-${booking.id}`}
                          className={`p-6 transition-all duration-300 ${
                            highlightBookingId === booking.id
                              ? "ring-2 ring-green-500 bg-green-50"
                              : ""
                          }`}
                        >
                          <div className="space-y-2 text-sm text-muted-foreground font-arabic">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-green-600" />
                              <span className="text-primary font-bold">
                                {booking.doctor?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.doctor?.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-arabic">
                                {formatTime12h(booking.time)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>المريض: {booking.patientName}</span>
                            </div>
                            <div>
                              <span className="font-arabic">
                                الهاتف: {booking.patientPhone}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => cancelBooking(booking.id)}
                              className="font-arabic"
                            >
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

export default Nutrition;
