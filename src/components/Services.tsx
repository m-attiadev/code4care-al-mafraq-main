import { Card } from "@/components/ui/card";
import {
  Hospital,
  Brain,
  Salad,
  FileText,
  Droplet,
  MessageCircle,
  HeartPulse,
  Activity,
  AlertCircle,
  Users,
  Building2,
  BookOpen,
  Star,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const Services = () => {
  const services = [
    {
      icon: Hospital,
      title: "دليل المستشفيات والعيادات",
      description: "دليل شامل للمرافق الصحية في المفرق مع التقييمات والمواقع",
      color: "from-blue-500 to-cyan-500",
      link: "/hospitals",
      featured: true,
    },
    {
      icon: Brain,
      title: "فحوصات صحية بالذكاء الاصطناعي",
      description: "فحوصات أولية بالذكاء الاصطناعي للصوت والوجه والجلد",
      color: "from-purple-500 to-pink-500",
      link: "/health-ai",
    },
    {
      icon: Salad,
      title: "تحليل التغذية والسعرات",
      description: "تحليل القيم الغذائية والسعرات من صور الطعام",
      color: "from-green-500 to-emerald-500",
      link: "/nutrition",
    },
    {
      icon: FileText,
      title: "تفسير التحاليل المخبرية",
      description: "تفسير مبسط لنتائج التحاليل المخبرية",
      color: "from-orange-500 to-red-500",
      link: "/lab-analysis",
    },
    {
      icon: Droplet,
      title: "بوابة التبرع بالدم",
      description: "مواقع بنوك الدم والتسجيل للتبرع",
      color: "from-red-500 to-rose-500",
      link: "/blood-donation",
      featured: true,
    },
    {
      icon: Stethoscope,
      title: "وظائف القطاع الصحي",
      description: "استعرض الوظائف الطبية وفلترها حسب التخصص والمنطقة",
      color: "from-teal-500 to-cyan-600",
      link: "/jobs",
      featured: true,
    },
    {
      icon: Star,
      title: "مراجعات وتجارب المرضى",
      description: "قدّم تقييمك لخدمات المستشفيات والعيادات والأطباء",
      color: "from-violet-500 to-purple-600",
      link: "/reviews",
      featured: true,
    },
    {
      icon: MessageCircle,
      title: "الاستشارات الطبية عن بُعد",
      description: "استشارات عن بُعد بمساعدة الذكاء الاصطناعي",
      color: "from-indigo-500 to-blue-500",
      link: "/telehealth",
    },
    {
      icon: HeartPulse,
      title: "دعم الصحة النفسية",
      description: "اختبارات ونصائح للصحة النفسية والاسترخاء",
      color: "from-pink-500 to-purple-500",
      link: "/mental-health",
    },
    {
      icon: Activity,
      title: "النشاط واللياقة البدنية",
      description: "متابعة النشاط اليومي والتمارين الرياضية",
      color: "from-cyan-500 to-teal-500",
      link: "/fitness",
    },
    {
      icon: AlertCircle,
      title: "التثقيف الصحي والأمراض",
      description: "معلومات عن الأمراض المنتشرة وطرق الوقاية",
      color: "from-yellow-500 to-orange-500",
      link: "/diseases",
    },
    {
      icon: Users,
      title: "دليل الأطباء",
      description: "قائمة الأطباء حسب التخصص في المفرق",
      color: "from-teal-500 to-green-500",
      link: "/doctors",
    },
    {
      icon: Building2,
      title: "الخدمات الصحية الحكومية",
      description: "روابط وزارة الصحة ومديرية صحة المفرق",
      color: "from-slate-500 to-gray-500",
      link: "/government",
    },
    {
      icon: BookOpen,
      title: "مقالات ونصائح صحية",
      description: "نصائح ومقالات طبية مفيدة",
      color: "from-amber-500 to-yellow-500",
      link: "/blog",
    },
  ];

  const featuredServices = useMemo(() => [...services].sort((a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)), [services]);

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
            الخدمات المتاحة
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
            خدمات رقمية تمثل ما نقدمه فعليًا للمجتمع الصحي
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredServices.map((service, index) => {
            const Icon = service.icon as any;
            const isFeatured = (service as any).featured;
            return (
              <Link
                key={index}
                to={service.link}
                className="group animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Card className={`relative overflow-hidden h-full p-6 border-2 ${isFeatured ? "border-primary shadow-custom-lg" : "border-border"} hover:border-primary transition-all duration-300 hover:-translate-y-1 bg-gradient-card cursor-pointer`}>
                  {/* Gradient Background */}
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`}
                  ></div>

                  {/* Featured badge */}
                  {isFeatured && (
                    <div className="mb-2 flex justify-center">
                      <Badge className="font-arabic bg-amber-500/20 text-amber-700 dark:text-amber-400 shadow-sm">
                        مُبرز
                      </Badge>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-custom-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-primary mb-2 font-arabic leading-tight group-hover:text-secondary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-arabic leading-relaxed">
                    {service.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <ArrowLeft className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export default Services;
