import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, ExternalLink, Calendar, User, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  // إضافة قائمة مقالات مع بيانات احترافية
  const articles = [
    {
      title: "نصائح عامة للصحة",
      desc: "نمط حياة صحي: غذاء متوازن، نشاط بدني، نوم كافٍ",
      url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
      author: "منظمة الصحة العالمية",
      date: "2024-07-01",
      readTime: "5 دقائق",
      tags: ["نصائح", "تغذية"],
      image: "/placeholder.svg",
    },
    {
      title: "الوقاية من الأمراض المزمنة",
      desc: "تقليل الملح والسكر، المتابعة الدورية مع الطبيب",
      url: "https://www.who.int/health-topics/noncommunicable-diseases",
      author: "منظمة الصحة العالمية",
      date: "2024-06-15",
      readTime: "4 دقائق",
      tags: ["وقاية", "صحة عامة"],
      image: "/placeholder.svg",
    },
    {
      title: "التوعية في الأردن",
      desc: "وزارة الصحة الأردنية: حملات وموارد صحية",
      url: "https://www.moh.gov.jo/Pages/viewpage.aspx?pageID=232",
      author: "وزارة الصحة الأردنية",
      date: "2024-05-20",
      readTime: "3 دقائق",
      tags: ["الأردن", "توعية"],
      image: "/placeholder.svg",
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-JO", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 mb-6 shadow-custom-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
              المقالات والنصائح الصحية
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-arabic leading-relaxed">
              نصائح ومقالات طبية مفيدة لصحة أفضل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="group p-6 hover:shadow-custom-lg transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >


                <div className="flex items-center gap-4 text-xs text-muted-foreground font-arabic mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-primary mb-2 font-arabic">{article.title}</h3>
                <p className="text-sm text-muted-foreground font-arabic mb-4">{article.desc}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, i) => (
                    <Badge key={i} className="font-arabic bg-primary/10 text-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="font-arabic"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 ml-2" /> قراءة المزيد
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
