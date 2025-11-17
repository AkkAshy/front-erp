import { useEffect, useRef, useState, type FC } from "react";
import { ArrowDownIcon } from "@/shared/ui/icons";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { uz } from "date-fns/locale";
import { format } from "date-fns";
import clsx from "clsx";

import styles from "./Сalendar.module.scss";

type Props = {
  setCurrentDate: React.Dispatch<React.SetStateAction<string>>;
};

type DropdownOption = {
  value: string | number;
  label: string;
};

type DropdownProps = {
  value: number;
  onChange?: (event: { target: { value: string | number } }) => void;
  options: DropdownOption[];
};

function CustomDropdown({ value, onChange, options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = options?.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: number | string) => {
    if (!onChange) return;

    // Создаем минимальный объект события
    onChange({
      target: {
        value: selectedValue,
      },
    });

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className={styles.title}>{selected?.label}</p>
        <ArrowDownIcon selected={isOpen} />
      </button>
      <ul className={clsx(styles.dropdown, isOpen && styles.open)}>
        {options?.map((option) => (
          <li
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={option.value === value ? styles.selected : ""}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const Calendar: FC<Props> = ({ setCurrentDate }) => {
  const [selected, setSelected] = useState<Date | undefined>();

  useEffect(() => {
    if (selected) {
      setCurrentDate(format(selected, "yyyy-MM-dd"));
    }
  }, [selected, setCurrentDate]);

  return (
    <div className={styles.calendar__wrapper}>
      <DayPicker
        mode="single"
        locale={uz}
        selected={selected}
        onSelect={setSelected}
        weekStartsOn={1}
        showOutsideDays
        captionLayout="dropdown"
        startMonth={new Date(2024, 0)}
        components={{
          Dropdown: CustomDropdown as any,
          Chevron: ({ orientation }) => {
            return orientation === "left" ? (
              <ArrowDownIcon rotate={90} />
            ) : (
              <ArrowDownIcon rotate={-90}/>
            );
          },
        }}
      />
    </div>
  );
};

export default Calendar;
