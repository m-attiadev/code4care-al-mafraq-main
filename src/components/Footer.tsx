import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const teamMembers = [
    {
      name: "Mohammed Attia",
      role: "Team Leader",
      linkedin: "https://www.linkedin.com/in/mohammed-attia0/",
    },
    { name: "Rayyan Jbr", role: "Team Member", linkedin: "" },
    { name: "Mahmoud Raed", role: "Team Member", linkedin: "" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-16 mt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-5 font-arabic flex items-center gap-3 text-accent">
              <Heart className="w-6 h-6" />
              Code4Care - المفرق
            </h3>
            <p className="text-primary-foreground/80 font-arabic leading-relaxed">
              منصة رقمية ذكية تُعنى بالصحة المجتمعية في محافظة المفرق، تجمع بين
              التقنية والذكاء الاصطناعي والخدمات الطبية المحلية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-5 font-arabic">روابط سريعة</h3>
            <ul className="space-y-3 font-arabic">
              {[
                { label: "الخدمات", to: "/#services" },
                { label: "المستشفيات", to: "/hospitals" },
                { label: "من نحن", to: "/#about" },
                { label: "سياسة الخصوصية", to: "/#privacy" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-2xl font-bold mb-5 font-arabic">فريق العمل</h3>
            {/* Leader card */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-4 text-primary-foreground/80 bg-accent-light p-4 rounded-lg shadow-lg">
                <div>
                  <p className="font-arabic text-lg font-semibold text-accent">
                    {teamMembers[0].name}
                  </p>
                  <p className="text-sm text-accent-dark">{teamMembers[0].role}</p>
                </div>
                {teamMembers[0].linkedin && (
                  <a
                    href={teamMembers[0].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn - ${teamMembers[0].name}`}
                    className="inline-flex items-center gap-2 hover:text-accent transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            {/* Members side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.slice(1).map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 text-primary-foreground/80 bg-accent-light p-4 rounded-lg shadow-lg"
                >
                  <div>
                    <p className="font-arabic text-lg font-semibold text-accent">
                      {member.name}
                    </p>
                    <p className="text-sm text-accent-dark">{member.role}</p>
                  </div>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn - ${member.name}`}
                      className="inline-flex items-center gap-2 hover:text-accent transition-all duration-300"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-2xl font-bold mb-5 font-arabic">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-primary-foreground/80">
                <MapPin className="w-6 h-6" />
                <span className="font-arabic">المفرق، الأردن</span>
              </li>
              <li className="flex items-center gap-4 text-primary-foreground/80">
                <Phone className="w-6 h-6" />
                <span dir="ltr">+962 78 539 8012</span>
              </li>
              <li className="flex items-center gap-4 text-primary-foreground/80">
                <MessageCircle className="w-6 h-6" />
                <a
                  href="https://wa.me/962785398012"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="underline hover:text-accent"
                  aria-label="WhatsApp"
                >
                  +962 78 539 8012 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-4 text-primary-foreground/80">
                <Mail className="w-6 h-6" />
                <span>mohammed.a.attia06@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-10">
          <div className="text-center text-primary-foreground/80">
            <p className="font-arabic mb-2 text-lg">
              💡 نبرمج لنرعى الإنسان - We Code to Care
            </p>
            <p className="text-sm">
              © {currentYear} Code4Care - المفرق. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
