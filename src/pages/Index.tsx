import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Set RTL direction for Arabic by default
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        {/* About Section */}
        <section id="about" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-arabic">من نحن</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto font-arabic mt-4">
                نحن فريق Code4Care في المفرق نعمل على حل مشكلة الاقتظاظ في أقسام الانتظار في المستشفيات والعيادات، وهي مشكلة تؤدي إلى خلق بيئة غير صحية وتضييع وقت المريض.
              </p>
              <p className="text-muted-foreground max-w-3xl mx-auto font-arabic mt-4">
                قمنا ببناء موقع يتألف من 12 قسمًا يعرض جميع تفاصيل المستشفيات والعيادات بمختلف قطاعاتها، بما في ذلك مراكز التبرع بالدم والمختبرات الصحية. قمنا بتسليط الضوء على ميزة الحجوزات في جميع الأقسام، مما يُتيح للمريض الاطلاع على التفاصيل المعروضة للمنشأة الصحية من اسم، مكان، رقم هاتف، مواعيد دوام، وتقييمات سابقة للمنشأة، بالإضافة إلى إمكانية حجز موعد باستخدام المعلومات الشخصية والصحية للمريض.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-arabic">اتصل بنا</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-arabic mt-4">
                نسعد بتواصلك لاقتراحاتك وإضافة عيادات جديدة أو التبليغ عن أي مشكلة.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl border bg-background">
                <h3 className="font-bold text-primary font-arabic mb-2">الهاتف</h3>
                <p dir="ltr" className="text-muted-foreground">+962 2 000 0000</p>
              </div>
              <div className="p-6 rounded-xl border bg-background">
                <h3 className="font-bold text-primary font-arabic mb-2">البريد الإلكتروني</h3>
                <p className="text-muted-foreground">support@code4care.local</p>
              </div>
              <div className="p-6 rounded-xl border bg-background">
                <h3 className="font-bold text-primary font-arabic mb-2">الموقع</h3>
                <a
                  className="text-secondary underline"
                  href="https://www.google.com/maps/search/?api=1&query=Mafraq%20Jordan"
                  target="_blank"
                  rel="noreferrer"
                >
                  فتح على خرائط جوجل
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
