"use client";

import React, { useState, useEffect } from "react";
import styles from "./RevenueChart.module.css";
import apiService from "@/lib/api";
import { useAuthStore } from "@/app/store/authStore";

interface MonthData {
  month: string;
  value: number;
  label: string;
}

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const RevenueChart: React.FC = () => {
  const { token } = useAuthStore();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState<MonthData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Gerar anos disponíveis (últimos 5 anos)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await apiService.getMonthlyRevenue(
          selectedYear,
          token
        );

        // Converter dados da API para o formato do gráfico
        const revenueMap = new Map<number, number>();
        response.data.forEach((item) => {
          revenueMap.set(item.month, item.total);
        });

        // Criar array com todos os 12 meses
        const chartData: MonthData[] = MONTHS.map((monthName, index) => {
          const monthNumber = index + 1;
          const value = revenueMap.get(monthNumber) || 0;
          return {
            month: monthName,
            value,
            label: `R$ ${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          };
        });

        setData(chartData);
      } catch (error) {
        console.error("Erro ao carregar receita:", error);
        // Setar todos os meses com valor 0 em caso de erro
        setData(
          MONTHS.map((monthName) => ({
            month: monthName,
            value: 0,
            label: "R$ 0,00",
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenue();
  }, [selectedYear, token]);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={styles.revenueChartSection}>
      <div className={styles.chartHeader}>
        <h3>Receita Mensal - {selectedYear}</h3>
        <select
          className={styles.yearFilter}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando...</span>
        </div>
      ) : (
        <>
          <div className={styles.revenueChart}>
            {data.map((monthData, index, array) => {
              const heightPercent = (monthData.value / maxValue) * 100;
              const prevValue =
                index > 0 ? array[index - 1].value : monthData.value;
              const isIncreasing = monthData.value > prevValue;
              const isDecreasing = monthData.value < prevValue;

              return (
                <div key={monthData.month} className={styles.chartBarContainer}>
                  <div className={styles.chartValue}>
                    {monthData.value > 0 ? monthData.label : "-"}
                  </div>
                  <div
                    className={`${styles.chartBar} ${
                      monthData.value === 0
                        ? styles.empty
                        : isIncreasing
                        ? styles.increasing
                        : isDecreasing
                        ? styles.decreasing
                        : styles.stable
                    }`}
                    style={{
                      height:
                        monthData.value > 0
                          ? `${Math.max(heightPercent, 5)}%`
                          : "2px",
                    }}
                    title={`${monthData.month}: ${monthData.label}`}
                  ></div>
                  <div className={styles.chartLabel}>{monthData.month}</div>
                </div>
              );
            })}
          </div>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendColor} ${styles.increasing}`}
              ></span>
              <span>Crescimento</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendColor} ${styles.decreasing}`}
              ></span>
              <span>Queda</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendColor} ${styles.stable}`}></span>
              <span>Estável</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueChart;
