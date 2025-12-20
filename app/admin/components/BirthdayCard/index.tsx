"use client";

import React, { useMemo, useState } from "react";
import styles from "./BirthdayCard.module.css";

interface BirthdayPerson {
  id: string | number;
  name: string;
  birthDate: string;
  role?: string;
  profileImage?: string;
}

interface BirthdayCardProps {
  users: BirthdayPerson[];
}

// Função para parsear data sem problemas de timezone
// Quando a data vem como "YYYY-MM-DD", parseamos manualmente para evitar conversão UTC
const parseDateLocal = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  // Se a data está no formato ISO com T (ex: 2003-12-31T00:00:00.000Z)
  const cleanDate = dateStr.split("T")[0];
  const [year, month, day] = cleanDate.split("-").map(Number);
  return new Date(year, month - 1, day); // month é 0-indexed
};

const BirthdayCard: React.FC<BirthdayCardProps> = ({ users }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const monthNames = [
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

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: Array<{
      day: number | null;
      hasBirthday: boolean;
      isToday: boolean;
    }> = [];

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, hasBirthday: false, isToday: false });
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const hasBirthday = users.some((user) => {
        if (!user.birthDate) return false;
        const birthDate = parseDateLocal(user.birthDate);
        return (
          birthDate.getMonth() === selectedMonth && birthDate.getDate() === day
        );
      });

      const isToday =
        day === currentDate.getDate() &&
        selectedMonth === currentDate.getMonth() &&
        selectedYear === currentDate.getFullYear();

      days.push({ day, hasBirthday, isToday });
    }

    return days;
  }, [selectedMonth, selectedYear, users, currentDate]);

  // Aniversariantes do mês selecionado
  const birthdaysInMonth = useMemo(() => {
    return users
      .filter((user) => {
        if (!user.birthDate) return false;
        const birthDate = parseDateLocal(user.birthDate);
        return birthDate.getMonth() === selectedMonth;
      })
      .map((user) => {
        const birthDate = parseDateLocal(user.birthDate);
        return {
          ...user,
          day: birthDate.getDate(),
        };
      })
      .sort((a, b) => a.day - b.day);
  }, [users, selectedMonth]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleToday = () => {
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "professor":
        return "Professor(a)";
      case "aluno":
        return "Aluno(a)";
      default:
        return "";
    }
  };

  const getRoleClass = (role?: string) => {
    switch (role) {
      case "admin":
        return styles.roleAdmin;
      case "professor":
        return styles.roleTeacher;
      case "aluno":
        return styles.roleStudent;
      default:
        return "";
    }
  };

  const isCurrentMonth =
    selectedMonth === currentDate.getMonth() &&
    selectedYear === currentDate.getFullYear();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <i className="fas fa-birthday-cake"></i>
        </div>
        <h3>Aniversariantes</h3>
      </div>

      <div className={styles.content}>
        {/* Calendário */}
        <div className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <button
              className={styles.navButton}
              onClick={handlePrevMonth}
              title="Mês anterior"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className={styles.monthYear}>
              <span className={styles.monthName}>
                {monthNames[selectedMonth]}
              </span>
              <span className={styles.year}>{selectedYear}</span>
            </div>
            <button
              className={styles.navButton}
              onClick={handleNextMonth}
              title="Próximo mês"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {!isCurrentMonth && (
            <button className={styles.todayButton} onClick={handleToday}>
              <i className="fas fa-calendar-day"></i>
              Voltar para hoje
            </button>
          )}

          <div className={styles.calendar}>
            <div className={styles.weekDays}>
              {weekDays.map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.days}>
              {calendarDays.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`${styles.day} ${
                    dayInfo.day === null ? styles.empty : ""
                  } ${dayInfo.hasBirthday ? styles.hasBirthday : ""} ${
                    dayInfo.isToday ? styles.today : ""
                  }`}
                >
                  {dayInfo.day}
                  {dayInfo.hasBirthday && (
                    <span className={styles.birthdayDot}></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDot}></span>
              <span>Aniversário</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendToday}></span>
              <span>Hoje</span>
            </div>
          </div>
        </div>

        {/* Lista de Aniversariantes */}
        <div className={styles.birthdaySection}>
          <div className={styles.birthdayHeader}>
            <h4>
              <i className="fas fa-gift"></i>
              {monthNames[selectedMonth]}
            </h4>
            <span className={styles.count}>
              {birthdaysInMonth.length} aniversariante
              {birthdaysInMonth.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className={styles.birthdayList}>
            {birthdaysInMonth.length === 0 ? (
              <div className={styles.emptyState}>
                <i className="fas fa-calendar-times"></i>
                <p>Nenhum aniversariante em {monthNames[selectedMonth]}</p>
              </div>
            ) : (
              birthdaysInMonth.map((person) => {
                const isToday =
                  person.day === currentDate.getDate() &&
                  selectedMonth === currentDate.getMonth() &&
                  selectedYear === currentDate.getFullYear();

                return (
                  <div
                    key={person.id}
                    className={`${styles.birthdayItem} ${
                      isToday ? styles.todayItem : ""
                    }`}
                  >
                    <div className={styles.dateBox}>
                      <span className={styles.dayNumber}>
                        {person.day.toString().padStart(2, "0")}
                      </span>
                      <span className={styles.monthShort}>
                        {monthNames[selectedMonth].slice(0, 3)}
                      </span>
                    </div>

                    <div className={styles.avatar}>
                      {person.profileImage ? (
                        <img
                          src={person.profileImage}
                          alt={person.name}
                          className={styles.avatarImg}
                        />
                      ) : (
                        <span className={styles.avatarInitials}>
                          {getInitials(person.name)}
                        </span>
                      )}
                    </div>

                    <div className={styles.personInfo}>
                      <span className={styles.personName}>{person.name}</span>
                      {person.role && (
                        <span
                          className={`${styles.roleBadge} ${getRoleClass(
                            person.role
                          )}`}
                        >
                          {getRoleLabel(person.role)}
                        </span>
                      )}
                    </div>

                    {isToday && (
                      <div className={styles.todayBadge}>
                        <i className="fas fa-birthday-cake"></i>
                        Hoje!
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
