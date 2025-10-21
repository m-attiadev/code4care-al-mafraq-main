import { Link, useLocation } from "react-router-dom"
import { navigationItems } from "@/lib/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"

export default function Header() {
  const { pathname } = useLocation();

  // مجموعات القوائم المنسدلة على الديسكتوب
  const getItem = (href: string) => navigationItems.find((i) => i.href === href)!;
  const coreItems = [
    getItem("/hospitals"),
    getItem("/blood-donation"),
    getItem("/jobs"),
    getItem("/reviews"),
  ];
  const assistItems = [
    getItem("/health-ai"),
    getItem("/nutrition"),
    getItem("/lab-analysis"),
    getItem("/telehealth"),
    getItem("/mental-health"),
    getItem("/fitness"),
  ];
  const referenceItems = [
    getItem("/diseases"),
    getItem("/doctors"),
    getItem("/government"),
    getItem("/blog"),
  ];

  const mobileItems = navigationItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-background/70 border-b">
      <div className="container mx-auto px-4 h-16 relative flex flex-row-reverse md:flex-row items-center justify-between">
        <Link to="/" className="font-bold text-primary text-lg sm:text-xl font-arabic whitespace-nowrap">
          Code4Care <span className="text-secondary">المفرق</span>
        </Link>
        {/* Desktop Navigation (centered) */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {/* الرئيسية */}
          <Button
            asChild
            variant={pathname === "/" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full font-arabic px-4"
          >
            <Link to="/" aria-current={pathname === "/" ? "page" : undefined}>الرئيسية</Link>
          </Button>

          {/* الخدمات الأساسية */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full font-arabic px-4">
                الخدمات الأساسية
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="font-arabic">
              {coreItems.map((item) => (
                <DropdownMenuItem asChild key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* الخدمات المساندة */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full font-arabic px-4">
                الخدمات المساندة
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="font-arabic">
              {assistItems.map((item) => (
                <DropdownMenuItem asChild key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* المراجع */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full font-arabic px-4">
                المراجع
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="font-arabic">
              {referenceItems.map((item) => (
                <DropdownMenuItem asChild key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="فتح القائمة">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-arabic">القائمة</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-1">
                {mobileItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      to={item.href}
                      className="block px-3 py-3 rounded-lg text-base font-arabic text-foreground hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
