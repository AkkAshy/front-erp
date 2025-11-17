import { useEffect, useState, type FC } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { uz } from "date-fns/locale";
import { format } from "date-fns";
import styles from "./CalendarRange.module.scss";

type Props = {
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
  setToDate: React.Dispatch<React.SetStateAction<string>>;
};

const CalendarRange: FC<Props> = ({ setFromDate, setToDate }) => {
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (range?.from) {
      setFromDate(format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      setToDate(format(range.to, "yyyy-MM-dd"));
    }
  }, [range, setFromDate, setToDate]);

  return (
    <div className={styles.calendar_range__wrapper}>
      <DayPicker
        mode="range"
        locale={uz}
        selected={range}
        onSelect={setRange}
        weekStartsOn={1}
        showOutsideDays
        numberOfMonths={2}
      />
    </div>
  );
};

export default CalendarRange;
