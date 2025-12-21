"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className = "",
  minYear = 1920,
  maxYear = new Date().getFullYear(),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Atualizar viewDate quando value mudar
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      setViewDate(new Date(year, month - 1, day));
    }
  }, [value]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (month: number) => {
    setViewDate(new Date(viewDate.getFullYear(), month, 1));
  };

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day
    );
    const formattedDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    return `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: React.ReactNode[] = [];

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    // Dias do mês
    const selectedDay = value
      ? (() => {
          const [y, m, d] = value.split("-").map(Number);
          return y === year && m === month + 1 ? d : null;
        })()
      : null;

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDay === day;
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      days.push(
        <button
          key={day}
          type="button"
          className={`${styles.day} ${isSelected ? styles.selected : ""} ${
            isToday ? styles.today : ""
          }`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const generateYearOptions = () => {
    const years: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <div className={styles.inputWrapper} onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          className={styles.input}
          value={formatDisplayDate(value)}
          placeholder={placeholder}
          readOnly
        />
        <i className={`fas fa-calendar-alt ${styles.icon}`}></i>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrevMonth}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className={styles.selectors}>
              <select
                className={styles.monthSelect}
                value={viewDate.getMonth()}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className={styles.yearSelect}
                value={viewDate.getFullYear()}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={styles.navButton}
              onClick={handleNextMonth}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className={styles.weekDays}>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.days}>{renderCalendarDays()}</div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.todayButton}
              onClick={() => {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}-${String(
                  today.getMonth() + 1
                ).padStart(2, "0")}-${String(today.getDate()).padStart(
                  2,
                  "0"
                )}`;
                onChange(formattedDate);
                setIsOpen(false);
              }}
            >
              Hoje
            </button>
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
