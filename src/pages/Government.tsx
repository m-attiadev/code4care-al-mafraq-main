import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, MapPin, LinkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Government = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-500 mb-6 shadow-custom-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              الخدمات الصحية الحكومية
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              روابط وزارة الصحة ومديرية صحة المفرق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-custom-lg transition-all">
              <h3 className="text-xl font-bold text-primary mb-2 font-arabic flex items-center gap-2">
                <LinkIcon className="w-5 h-5" /> وزارة الصحة الأردنية
              </h3>
              <p className="text-muted-foreground font-arabic mb-4">الصفحة الرسمية للوزارة والخدمات الصحية العامة</p>
              <Button className="font-arabic w-full md:w-auto" onClick={() => window.open("https://moh.gov.jo/","_blank")}>فتح الموقع الرسمي</Button>
            </Card>

            <Card className="p-6 hover:shadow-custom-lg transition-all">
              <h3 className="text-xl font-bold text-primary mb-2 font-arabic flex items-center gap-2">
                <MapPin className="w-5 h-5" /> مديرية صحة المفرق (خريطة)
              </h3>
              <p className="text-muted-foreground font-arabic mb-4">موقع مديرية الصحة في المفرق عبر خرائط جوجل</p>
              <Button className="font-arabic w-full md:w-auto" onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=%D9%85%D8%AF%D9%8A%D8%B1%D9%8A%D8%A9%20%D8%B5%D8%AD%D8%A9%20%D8%A7%D9%84%D9%85%D9%81%D8%B1%D9%82%20%D8%A7%D9%84%D8%A3%D8%B1%D8%AF%D9%86","_blank")}>افتح الخريطة</Button>
            </Card>

            <Card className="p-6 hover:shadow-custom-lg transition-all">
              <h3 className="text-xl font-bold text-primary mb-2 font-arabic flex items-center gap-2">
                <MapPin className="w-5 h-5" /> مستشفى المفرق الحكومي (خريطة)
              </h3>
              <p className="text-muted-foreground font-arabic mb-4">الوصول للمستشفى عبر خرائط جوجل</p>
              <Button className="font-arabic w-full md:w-auto" onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=%D9%85%D8%B3%D8%AA%D8%B4%D9%81%D9%89%20%D8%A7%D9%84%D9%85%D9%81%D8%B1%D9%82%20%D8%A7%D9%84%D8%AD%D9%83%D9%88%D9%85%D9%8A","_blank")}>افتح الخريطة</Button>
            </Card>

            <Card className="p-6 hover:shadow-custom-lg transition-all">
              <h3 className="text-xl font-bold text-primary mb-2 font-arabic flex items-center gap-2">
                <LinkIcon className="w-5 h-5" /> دليل الخدمات الصحية
              </h3>
              <p className="text-muted-foreground font-arabic mb-4">روابط عامة للفحوصات والتطعيمات والتوعية الصحية</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                <Button variant="outline" className="font-arabic w-full md:w-auto" onClick={() => window.open("https://www.who.int/ar","_blank")}>منظمة الصحة العالمية</Button>
                <Button variant="outline" className="font-arabic w-full md:w-auto" onClick={() => window.open("https://corona.moh.gov.jo/","_blank")}>بوابة الصحة (وزارة الصحة)</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Government;
