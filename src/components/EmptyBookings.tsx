import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Sparkles, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyBookingsProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyBookings: React.FC<EmptyBookingsProps> = ({
  title = "لا توجد حجوزات حتى الآن",
  description = "ابدأ بحجز جلسة مناسبة لك خلال دقائق",
  actionLabel = "ابدأ الحجز الآن",
  onAction,
  className,
}) => {
  return (
    <Card className={cn("p-8 text-center overflow-hidden", className)}>
      <div className="relative">
        {/* زخرفة خفيفة بالخلفية */}
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="mx-auto w-64 h-64 rounded-full blur-3xl bg-gradient-to-br from-emerald-100 via-white to-emerald-100" />
        </div>

        {/* أيقونة */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 mb-4">
          <CalendarCheck className="w-9 h-9 text-white animate-pulse" />
        </div>

        {/* العنوان والوصف */}
        <h3 className="text-2xl font-bold text-primary mb-2 font-arabic">{title}</h3>
        <p className="text-muted-foreground mb-5 font-arabic">{description}</p>

        {/* اقتراحات مفيدة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-arabic">
            <Sparkles className="w-4 h-4" /> اختر مختصاً مناسباً لك
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-arabic">
            <Clock className="w-4 h-4" /> وقت بين 9:00 ص و 5:00 م
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-arabic">
            <MapPin className="w-4 h-4" /> اختر مكان أو طريقة الجلسة
          </div>
        </div>

        {/* الدعوة للإجراء */}
        <Button onClick={onAction} className="font-arabic">
          <CalendarCheck className="w-4 h-4 ml-2" /> {actionLabel}
        </Button>
      </div>
    </Card>
  );
};

export default EmptyBookings;