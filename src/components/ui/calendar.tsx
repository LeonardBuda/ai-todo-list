import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Basic styling

interface CalendarProps {
  className?: string;
  onSelect?: (date: Date | undefined) => void;
  selected?: Date | undefined; // Optional: to show the selected date
}

export const Calendar: React.FC<CalendarProps> = ({ className, onSelect, selected }) => {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      className={className}
    />
  );
};