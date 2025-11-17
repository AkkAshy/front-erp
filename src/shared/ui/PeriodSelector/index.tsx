import { type FC } from "react";
import CalendarRange from "@/features/CalendarRange";
import { CalendarIcon } from "../icons";
import clsx from "clsx";

// scss
import styles from "./PeriodSelector.module.scss";

type Props = {
  isOpenRangeCalendar?: boolean;
  setIsOpenRangeCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsToggleRange?: React.Dispatch<React.SetStateAction<boolean>>;
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
  fromDate: string;
  setToDate: React.Dispatch<React.SetStateAction<string>>;
  toDate: string;
};

const PeriodSelector: FC<Props> = ({
  isOpenRangeCalendar,
  setIsOpenRangeCalendar,
  setIsToggleRange,
  setFromDate,
  fromDate,
  setToDate,
  toDate,
}) => {
  return (
    <>
      <div
        className={clsx(
          styles.statistics__calendar,
          fromDate && styles.selected__range
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpenRangeCalendar((prev) => !prev);
          setIsToggleRange?.(false);
        }}
      >
        <CalendarIcon />

        <div className={styles.calendar__select}>
          <p className={styles.select__from}>{fromDate ? fromDate : "dan"}</p>
          <span className={styles.vertical_line} />
          <p className={styles.select__to}>{toDate ? toDate : "gacha"}</p>
        </div>

        <div
          className={clsx(
            styles.calendar__dropdown,
            isOpenRangeCalendar && styles.open
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <CalendarRange setFromDate={setFromDate} setToDate={setToDate} />
        </div>
      </div>
    </>
  );
};

export default PeriodSelector;
