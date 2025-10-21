import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Star, Search, Filter, Building2, Stethoscope } from "lucide-react";
import Header from "@/components/Header";
import { useSearchParams } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Hospitals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const qParam = searchParams.get("q");
    if (typeParam) setFilterType(typeParam);
    if (qParam) setSearchQuery(qParam);
  }, [searchParams]);

  // مستشفيات المفرق - Mafraq Hospitals
  const hospitals = [
    {
      id: 1,
      name: "مستشفى المفرق الحكومي",
      nameEn: "Mafraq Government Hospital",
      type: "حكومي",
      specialty: "جميع التخصصات",
      address: "شارع الملك حسين، المفرق",
      phone: "+962 2 623 1111",
      hours: "24/7",
      rating: 4.2,
      status: "مفتوح",
      location: { lat: 32.343611, lng: 36.1975 },
      description: "أكبر مستشفى حكومي في المنطقة، يقدم رعاية شاملة وخدمات طوارئ"
    },
    {
      id: 2,
      name: "مستشفى محافظة المفرق التخصصي",
      nameEn: "Mafraq Specialized Hospital",
      type: "حكومي",
      specialty: "تخصصي - قلب وأعصاب",
      address: "حي الشرقة، المفرق",
      phone: "+962 2 623 5000",
      hours: "24/7",
      rating: 4.4,
      status: "مفتوح",
      location: { lat: 32.3500, lng: 36.2100 },
      description: "مستشفى تخصصي يقدم خدمات متقدمة في أمراض القلب والأعصاب"
    },
    {
      id: 3,
      name: "مستشفى مصح النور",
      nameEn: "Al-Nour Sanatorium Hospital",
      type: "حكومي",
      specialty: "صدرية وتنفسية",
      address: "طريق المفرق-عمان، المفرق",
      phone: "+962 2 629 9999",
      hours: "24/7",
      rating: 4.3,
      status: "مفتوح",
      location: { lat: 32.3400, lng: 36.5200 },
      description: "متخصص في أمراض الصدر والجهاز التنفسي"
    },
    {
      id: 4,
      name: "مستشفى الملك طلال العسكري",
      nameEn: "King Talal Military Hospital",
      type: "عسكري",
      specialty: "عسكرية - طوارئ",
      address: "القاعدة الجوية، المفرق",
      phone: "+962 2 623 7000",
      hours: "24/7",
      rating: 4.5,
      status: "مفتوح",
      location: { lat: 32.3560, lng: 36.2150 },
      description: "مستشفى عسكري يخدم أفراد القوات المسلحة والمجتمع المحلي"
    },
    {
      id: 5,
      name: "مستشفى الأميرة بسمة الحكومي",
      nameEn: "Princess Basma Government Hospital",
      type: "حكومي",
      specialty: "جميع التخصصات",
      address: "المفرق، الأردن",
      phone: "+962 2 623 3333",
      hours: "24/7",
      rating: 4.1,
      status: "مفتوح",
      location: { lat: 32.3396, lng: 36.2080 },
      description: "مستشفى حكومي شامل يقدم خدمات صحية متكاملة"
    },
    {
      id: 6,
      name: "مستشفى المفرق التخصصي الخاص",
      nameEn: "Mafraq Specialized Private Hospital",
      type: "خاص",
      specialty: "جراحة وعظام",
      address: "شارع الملك عبدالله الثاني، المفرق",
      phone: "+962 2 623 5555",
      hours: "24/7",
      rating: 4.6,
      status: "مفتوح",
      location: { lat: 32.3410, lng: 36.2065 },
      description: "مستشفى خاص متخصص في الجراحة وجراحة العظام"
    },
    {
      id: 7,
      name: "مستشفى المفرق الحكومي الجديد",
      nameEn: "Mafraq New Government Hospital",
      type: "حكومي",
      specialty: "طوارئ وجراحة",
      address: "طريق الزرقاء، المفرق",
      phone: "+962 2 623 4444",
      hours: "24/7",
      rating: 4.2,
      status: "مفتوح",
      location: { lat: 32.3425, lng: 36.2100 },
      description: "مستشفى حديث مجهز بأحدث المعدات الطبية"
    },
    {
      id: 8,
      name: "مستشفى الملك المؤسس عبدالله الجامعي",
      nameEn: "King Abdullah Founder Hospital",
      type: "جامعي",
      specialty: "تعليمي - جميع التخصصات",
      address: "جامعة آل البيت، المفرق",
      phone: "+962 2 629 7000",
      hours: "24/7",
      rating: 4.5,
      status: "مفتوح",
      location: { lat: 32.3543, lng: 36.0829 },
      description: "مستشفى جامعي تعليمي يقدم خدمات طبية متقدمة"
    },
  ];

  // عيادات المفرق - Mafraq Clinics
  const clinics = [
    {
      id: 101,
      name: "عيادة الدكتور أحمد الزعبي",
      nameEn: "Dr. Ahmad Al-Zoubi Clinic",
      type: "خاص",
      specialty: "باطنية عامة",
      address: "وسط المفرق، قرب السوق",
      phone: "+962 79 555 1234",
      hours: "9:00 - 21:00",
      rating: 4.7,
      status: "مفتوح",
      location: { lat: 32.3392, lng: 36.2077 },
      description: "عيادة متخصصة في الأمراض الباطنية والطب العام"
    },
    {
      id: 102,
      name: "عيادة الدكتورة فاطمة الخالدي",
      nameEn: "Dr. Fatima Al-Khaldi Clinic",
      type: "خاص",
      specialty: "طب عام وأطفال",
      address: "حي الغربة، المفرق",
      phone: "+962 79 666 2345",
      hours: "10:00 - 20:00",
      rating: 4.8,
      status: "مفتوح",
      location: { lat: 32.3380, lng: 36.2050 },
      description: "طب عام مع تخصص في طب الأطفال"
    },
    {
      id: 103,
      name: "عيادة الدكتورة لين الحسن",
      nameEn: "Dr. Leen Al-Hassan Clinic",
      type: "خاص",
      specialty: "نسائية وتوليد",
      address: "حي الصناعة، المفرق",
      phone: "+962 79 777 3456",
      hours: "10:00 - 20:00",
      rating: 4.9,
      status: "مفتوح",
      location: { lat: 32.3450, lng: 36.2090 },
      description: "عيادة متخصصة في أمراض النساء والتوليد"
    },
    {
      id: 104,
      name: "عيادة الدكتور محمد الشلبي",
      nameEn: "Dr. Mohammad Al-Shalabi Clinic",
      type: "خاص",
      specialty: "جراحة عامة",
      address: "وسط المدينة، المفرق",
      phone: "+962 79 888 4567",
      hours: "9:00 - 19:00",
      rating: 4.6,
      status: "مفتوح",
      location: { lat: 32.3405, lng: 36.2082 },
      description: "جراحة عامة ومناظير"
    },
    {
      id: 105,
      name: "عيادة الدكتور خالد الزعبي",
      nameEn: "Dr. Khaled Al-Zoubi Clinic",
      type: "خاص",
      specialty: "عظام ومفاصل",
      address: "قرب المستشفى الحكومي، المفرق",
      phone: "+962 79 999 5678",
      hours: "10:00 - 20:00",
      rating: 4.7,
      status: "مفتوح",
      location: { lat: 32.3415, lng: 36.2078 },
      description: "تخصص في جراحة العظام والمفاصل"
    },
    {
      id: 106,
      name: "عيادة الدكتور يوسف الحموري",
      nameEn: "Dr. Yousef Al-Hammouri Clinic",
      type: "خاص",
      specialty: "قلبية وأوعية دموية",
      address: "المفرق الجديدة",
      phone: "+962 79 666 6789",
      hours: "9:00 - 19:00",
      rating: 4.9,
      status: "مفتوح",
      location: { lat: 32.3435, lng: 36.2095 },
      description: "تخصص في أمراض القلب والأوعية الدموية"
    },
    {
      id: 107,
      name: "عيادة الدكتورة ليلى أبو شنب",
      nameEn: "Dr. Layla Abu Shanab Clinic",
      type: "خاص",
      specialty: "جلدية وتجميل",
      address: "شارع الجيش، المفرق",
      phone: "+962 79 555 7890",
      hours: "10:00 - 20:00",
      rating: 4.8,
      status: "مفتوح",
      location: { lat: 32.3398, lng: 36.2073 },
      description: "أمراض الجلدية والعلاجات التجميلية"
    },
    {
      id: 108,
      name: "عيادة الدكتور عمر القاسم",
      nameEn: "Dr. Omar Al-Qassem Clinic",
      type: "خاص",
      specialty: "باطنية وسكري",
      address: "المفرق الشمالية",
      phone: "+962 79 444 8901",
      hours: "10:00 - 20:00",
      rating: 4.7,
      status: "مفتوح",
      location: { lat: 32.3445, lng: 36.2105 },
      description: "تخصص في الأمراض الباطنية والسكري"
    },
    {
      id: 109,
      name: "عيادة الدكتور محمد السعيد",
      nameEn: "Dr. Mohammad Al-Saeed Clinic",
      type: "خاص",
      specialty: "أطفال وحديثي الولادة",
      address: "شارع البلدية، المفرق",
      phone: "+962 79 777 9012",
      hours: "9:00 - 21:00",
      rating: 4.8,
      status: "مفتوح",
      location: { lat: 32.3390, lng: 36.2075 },
      description: "طب الأطفال ورعاية حديثي الولادة"
    },
    {
      id: 110,
      name: "مركز طب الأسنان المفرق",
      nameEn: "Mafraq Dental Center",
      type: "خاص",
      specialty: "أسنان وتجميل",
      address: "شارع الاستقلال، المفرق",
      phone: "+962 2 623 7777",
      hours: "9:00 - 22:00",
      rating: 4.7,
      status: "مفتوح",
      location: { lat: 32.3385, lng: 36.2068 },
      description: "مركز شامل لطب وجراحة الأسنان"
    },
    {
      id: 111,
      name: "مركز النظر للعيون",
      nameEn: "Al-Nathar Eye Center",
      type: "خاص",
      specialty: "عيون وليزك",
      address: "شارع الأمير حسن، المفرق",
      phone: "+962 2 623 5432",
      hours: "9:00 - 21:00",
      rating: 4.6,
      status: "مفتوح",
      location: { lat: 32.3420, lng: 36.2088 },
      description: "مركز متخصص في أمراض العيون وجراحة الليزك"
    },
    {
      id: 112,
      name: "مركز الأذن والأنف والحنجرة",
      nameEn: "ENT Specialized Center",
      type: "خاص",
      specialty: "أنف وأذن وحنجرة",
      address: "شارع الملك عبدالله، المفرق",
      phone: "+962 2 623 4321",
      hours: "9:00 - 20:00",
      rating: 4.5,
      status: "مفتوح",
      location: { lat: 32.3428, lng: 36.2088 },
      description: "تخصص في أمراض الأنف والأذن والحنجرة"
    },
    {
      id: 113,
      name: "مركز صحة المرأة والطفل",
      nameEn: "Women & Child Health Center",
      type: "حكومي",
      specialty: "صحة الأم والطفل",
      address: "حي الجامعة، المفرق",
      phone: "+962 2 623 8888",
      hours: "8:00 - 16:00",
      rating: 4.2,
      status: "مفتوح",
      location: { lat: 32.3365, lng: 36.2055 },
      description: "مركز حكومي لرعاية صحة الأم والطفل"
    },
    {
      id: 114,
      name: "مجمع العيادات الطبية الحديثة",
      nameEn: "Modern Medical Clinics Complex",
      type: "خاص",
      specialty: "متعدد التخصصات",
      address: "دوار الساعة، المفرق",
      phone: "+962 2 623 9999",
      hours: "8:00 - 23:00",
      rating: 4.6,
      status: "مفتوح",
      location: { lat: 32.3402, lng: 36.2072 },
      description: "مجمع يضم عيادات متعددة التخصصات"
    },
    {
      id: 115,
      name: "مركز المفرق الطبي الشامل",
      nameEn: "Mafraq Comprehensive Medical Center",
      type: "خاص",
      specialty: "متعدد التخصصات",
      address: "قرب البلدية، المفرق",
      phone: "+962 2 623 4567",
      hours: "8:00 - 22:00",
      rating: 4.5,
      status: "مفتوح",
      location: { lat: 32.3400, lng: 36.2070 },
      description: "مركز طبي شامل يضم تخصصات متعددة"
    },
    {
      id: 116,
      name: "مركز الشفاء للعلاج الطبيعي",
      nameEn: "Al-Shifa Physical Therapy Center",
      type: "خاص",
      specialty: "علاج طبيعي",
      address: "حي الضليل، المفرق",
      phone: "+962 2 623 6666",
      hours: "8:00 - 20:00",
      rating: 4.4,
      status: "مفتوح",
      location: { lat: 32.3370, lng: 36.2060 },
      description: "مركز متخصص في العلاج الطبيعي وإعادة التأهيل"
    },
    {
      id: 117,
      name: "مختبر المفرق الطبي",
      nameEn: "Mafraq Medical Laboratory",
      type: "خاص",
      specialty: "تحاليل طبية",
      address: "وسط المفرق",
      phone: "+962 2 623 2222",
      hours: "7:00 - 22:00",
      rating: 4.6,
      status: "مفتوح",
      location: { lat: 32.3410, lng: 36.2065 },
      description: "مختبر شامل لجميع أنواع التحاليل الطبية"
    },
    {
      id: 118,
      name: "مركز الأشعة التشخيصية",
      nameEn: "Diagnostic Radiology Center",
      type: "خاص",
      specialty: "أشعة ورنين",
      address: "قرب دوار البلدية، المفرق",
      phone: "+962 2 623 1111",
      hours: "8:00 - 21:00",
      rating: 4.5,
      status: "مفتوح",
      location: { lat: 32.3395, lng: 36.2080 },
      description: "مركز متطور للأشعة والرنين المغناطيسي"
    },
    {
      id: 119,
      name: "عيادة الدكتورة سارة العمري",
      nameEn: "Dr. Sara Al-Omari Clinic",
      type: "خاص",
      specialty: "نسائية وتوليد",
      address: "شارع عمان، المفرق",
      phone: "+962 79 888 1234",
      hours: "10:00 - 20:00",
      rating: 4.7,
      status: "مفتوح",
      location: { lat: 32.3375, lng: 36.2058 },
      description: "عيادة نسائية متخصصة في الحمل والولادة"
    },
    {
      id: 120,
      name: "مركز السمع والتوازن",
      nameEn: "Hearing & Balance Center",
      type: "خاص",
      specialty: "سمع وتوازن",
      address: "شارع الجامعة، المفرق",
      phone: "+962 2 623 3210",
      hours: "9:00 - 19:00",
      rating: 4.4,
      status: "مفتوح",
      location: { lat: 32.3388, lng: 36.2062 },
      description: "مركز متخصص في علاج مشاكل السمع والتوازن"
    },
  ];

  const filterData = (data: typeof hospitals | typeof clinics) => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.includes(searchQuery);

      const matchesFilter =
        filterType === "all" ||
        item.type === filterType ||
        item.specialty.includes(filterType);

      return matchesSearch && matchesFilter;
    });
  };

  const filteredHospitals = filterData(hospitals);
  const filteredClinics = filterData(clinics);

  // Open Google Maps using a refined search query based on name and type
  interface HospitalSite {
    name: string;
    address: string;
    type: string;
    location: { lat: number; lng: number };
  }

  const openMap = (s: HospitalSite) => {
    // Construct a precise search query based on name, type, and address
    const query = `${s.name} ${s.type === "حكومي" || s.type === "خاص" || s.type === "جامعي" ? "مستشفى" : "عيادة"} ${s.address}, المفرق, الأردن`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderCard = (item: typeof hospitals[0] | typeof clinics[0], index: number) => (
    <Card
      key={item.id}
      className="p-6 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-primary mb-1 font-arabic">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {item.nameEn}
          </p>
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-gradient-accent text-xs font-semibold text-primary-foreground">
              {item.type}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary/20 text-xs font-semibold text-secondary font-arabic">
              {item.specialty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-foreground">
            {item.rating}
          </span>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-muted-foreground mb-4 font-arabic leading-relaxed">
          {item.description}
        </p>
      )}

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span className="text-muted-foreground font-arabic">
            {item.address}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground" dir="ltr">
            {item.phone}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-arabic">
              {item.hours}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold font-arabic">
              {item.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 font-arabic"
          onClick={() => openMap(item)}
        >
          <MapPin className="w-4 h-4 ml-2" />
          عرض على الخريطة
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(`tel:${item.phone}`)}
        >
          <Phone className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
    
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              دليل المستشفيات والعيادات في المفرق
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              ابحث عن أقرب مستشفى أو عيادة حسب التخصص والموقع
            </p>
            <div className="mt-4 flex justify-end">
              <Badge className="font-arabic bg-amber-500/20 text-amber-700 dark:text-amber-400 shadow-sm">قسم مُبرز</Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 animate-slide-up">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ابحث عن مستشفى أو عيادة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 font-arabic"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px] font-arabic">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="حكومي">حكومي</SelectItem>
                <SelectItem value="خاص">خاص</SelectItem>
                <SelectItem value="جامعي">جامعي</SelectItem>
                <SelectItem value="أسنان">أسنان</SelectItem>
                <SelectItem value="عيون">عيون</SelectItem>
                <SelectItem value="أطفال">أطفال</SelectItem>
                <SelectItem value="نسائية وتوليد">نسائية وتوليد</SelectItem>
                <SelectItem value="عظام">عظام</SelectItem>
                <SelectItem value="جلدية">جلدية</SelectItem>
                <SelectItem value="قلبية">قلبية</SelectItem>
                <SelectItem value="مختبر">مختبر</SelectItem>
                <SelectItem value="أشعة">أشعة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for Hospitals and Clinics */}
          <Tabs defaultValue="hospitals" className="w-full">
            <TabsList className="flex w-full overflow-x-auto snap-x snap-mandatory flex-row-reverse gap-2 pb-2 md:max-w-lg md:mx-auto md:pb-0 mb-8">
              <TabsTrigger value="hospitals" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <Building2 className="w-4 h-4 ml-2" />
                المستشفيات ({filteredHospitals.length})
              </TabsTrigger>
              <TabsTrigger value="clinics" className="font-arabic flex items-center justify-center gap-2 px-3 py-2 shrink-0 snap-start min-w-[160px] flex-row-reverse">
                <Stethoscope className="w-4 h-4 ml-2" />
                العيادات ({filteredClinics.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hospitals">
              {filteredHospitals.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground font-arabic text-lg">
                    لم يتم العثور على مستشفيات. جرب البحث بكلمات مختلفة.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredHospitals.map((hospital, index) => renderCard(hospital, index))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="clinics">
              {filteredClinics.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground font-arabic text-lg">
                    لم يتم العثور على عيادات. جرب البحث بكلمات مختلفة.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClinics.map((clinic, index) => renderCard(clinic, index))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Hospitals;
