import { cn } from "@/lib/utils";
import { format, addDays, isSameDay } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-1">
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());
        
        return (
          <button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={cn(
              "flex flex-col items-center min-w-[56px] px-3 py-2 rounded-xl transition-all duration-300",
              isSelected
                ? "bg-primary text-primary-foreground neon-glow-purple"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span className="text-xs font-medium uppercase">
              {isToday ? "Today" : format(date, "EEE")}
            </span>
            <span className="text-lg font-bold">{format(date, "d")}</span>
            <span className="text-xs opacity-70">{format(date, "MMM")}</span>
          </button>
        );
      })}
    </div>
  );
};
