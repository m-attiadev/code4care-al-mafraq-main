import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 mb-6 shadow-custom-lg">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              الصفحة غير موجودة
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              عذراً، لم نتمكن من العثور على الصفحة المطلوبة.
            </p>
          </div>

          <Card className="p-8 max-w-xl mx-auto text-center animate-slide-up">
            <p className="text-muted-foreground font-arabic mb-6">
              تحقق من الرابط أو عد إلى الصفحة الرئيسية.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-arabic hover:opacity-90 transition"
            >
              العودة للرئيسية
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
