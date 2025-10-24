import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Activity } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Desert landscape with medical cross"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-accent shadow-custom-md mb-6">
            <Heart className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground font-arabic">
              نبرمج لنرعى الإنسان - We Code to Care
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 animate-slide-up font-arabic leading-tight">
            Code4Care
            <span className="block text-secondary mt-2">المفرق</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/90 mb-4 font-arabic leading-relaxed">
            منصة الصحة الرقمية لخدمة مجتمع المفرق
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-arabic leading-relaxed">
            تجمع بين التقنية والذكاء الاصطناعي والخدمات الطبية المحلية لتسهيل
            الوصول إلى المعلومات والخدمات الصحية
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-custom-lg px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
            >
              <Link to="/#services" aria-label="استكشف الخدمات">
                <ArrowLeft className="ml-2 h-5 w-5" />
                <span className="font-arabic">استكشف الخدمات</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-custom-md px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
            >
              <Link to="/health-ai" aria-label="الفحوصات الذكية">
                <Activity className="ml-2 h-5 w-5" />
                <span className="font-arabic">فحوصات ذكية</span>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            {[
              { number: "12+", label: "خدمة صحية" },
              { number: "50+", label: "مركز طبي" },
              { number: "24/7", label: "دعم متواصل" },
              { number: "100%", label: "مجاني" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-custom-md border border-border animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-arabic">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
