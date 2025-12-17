"use client";

import React from "react";
import styles from "./RevenueChart.module.css";

interface MonthData {
  month: string;
  value: number;
  label: string;
}

interface RevenueChartProps {
  data?: MonthData[];
}

const defaultData: MonthData[] = [
  { month: "Jul", value: 2800, label: "R$ 2.800" },
  { month: "Ago", value: 3200, label: "R$ 3.200" },
  { month: "Set", value: 2950, label: "R$ 2.950" },
  { month: "Out", value: 3400, label: "R$ 3.400" },
  { month: "Nov", value: 3650, label: "R$ 3.650" },
  { month: "Dez", value: 3950, label: "R$ 3.950" },
];

const RevenueChart: React.FC<RevenueChartProps> = ({ data = defaultData }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className={styles.revenueChartSection}>
      <h3>Receita Mensal - Últimos 6 Meses</h3>
      <div className={styles.revenueChart}>
        {data.map((monthData, index, array) => {
          const heightPercent = (monthData.value / maxValue) * 100;
          const prevValue =
            index > 0 ? array[index - 1].value : monthData.value;
          const isIncreasing = monthData.value > prevValue;
          const isDecreasing = monthData.value < prevValue;

          return (
            <div key={monthData.month} className={styles.chartBarContainer}>
              <div className={styles.chartValue}>{monthData.label}</div>
              <div
                className={`${styles.chartBar} ${
                  isIncreasing
                    ? styles.increasing
                    : isDecreasing
                    ? styles.decreasing
                    : styles.stable
                }`}
                style={{ height: `${heightPercent}%` }}
                title={`${monthData.month}: ${monthData.label}`}
              ></div>
              <div className={styles.chartLabel}>{monthData.month}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.increasing}`}></span>
          <span>Crescimento</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.decreasing}`}></span>
          <span>Queda</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.stable}`}></span>
          <span>Estável</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
