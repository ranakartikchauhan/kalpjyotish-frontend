import React, { useMemo, useState } from "react";
import styles from "./EarningsSection.module.css";
import { useGetAstroDashboardSummaryQuery, useGetAstroEarningsQuery } from "../../services/backendApi";

const asInr = (value) => `INR ${Number(value || 0).toFixed(2)}`;

const EarningsSection = ({ astrologerId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const filter = selectedPeriod === "all" ? undefined : selectedPeriod;

  const { data: earningsData, isLoading } = useGetAstroEarningsQuery(
    { astroId: astrologerId, filter },
    { skip: !astrologerId }
  );
  const { data: summary } = useGetAstroDashboardSummaryQuery(
    { astroId: astrologerId, filter },
    { skip: !astrologerId }
  );

  const transactions = earningsData?.transactions || [];
  const totalEarning = Number(earningsData?.totalEarning || 0);
  const totalCalls = Number(earningsData?.totalCalls || 0);
  const totalMinutes = Number(earningsData?.totalMinutes || 0);
  const avgPerSession = totalCalls > 0 ? totalEarning / totalCalls : 0;

  const chartData = useMemo(() => transactions.slice(0, 6).reverse(), [transactions]);
  const topServices = useMemo(
    () =>
      ["voice", "video", "chat", "live"]
        .map((key) => ({
          key,
          sessions: Number(summary?.[key]?.sessions || 0),
          minutes: Number(summary?.[key]?.minutes || 0),
          earning: Number(summary?.[key]?.earning || 0),
        }))
        .filter((x) => x.sessions > 0)
        .sort((a, b) => b.earning - a.earning),
    [summary]
  );

  if (!astrologerId) {
    return <div className={styles.earningsContainer}>Please login as astrologer.</div>;
  }

  if (isLoading) {
    return <div className={styles.earningsContainer}>Loading earnings...</div>;
  }

  return (
    <div className={styles.earningsContainer}>
      <div className={styles.periodSelector}>
        <button className={selectedPeriod === "day" ? styles.active : ""} onClick={() => setSelectedPeriod("day")}>
          Today
        </button>
        <button className={selectedPeriod === "week" ? styles.active : ""} onClick={() => setSelectedPeriod("week")}>
          This Week
        </button>
        <button className={selectedPeriod === "month" ? styles.active : ""} onClick={() => setSelectedPeriod("month")}>
          This Month
        </button>
        <button className={selectedPeriod === "all" ? styles.active : ""} onClick={() => setSelectedPeriod("all")}>
          All Time
        </button>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>INR</div>
          <div className={styles.cardContent}>
            <h4>Total Earnings</h4>
            <h2>{asInr(totalEarning)}</h2>
            <p>From {totalCalls} consultations</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>AVG</div>
          <div className={styles.cardContent}>
            <h4>Average per Session</h4>
            <h2>{asInr(avgPerSession)}</h2>
            <p>Total minutes: {totalMinutes.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>MIN</div>
          <div className={styles.cardContent}>
            <h4>Minutes Billed</h4>
            <h2>{totalMinutes.toFixed(2)}</h2>
            <p>Charged by actual per-minute rates</p>
          </div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2>Recent Session Earnings</h2>
        <div className={styles.chart}>
          {chartData.length === 0 ? <div>No recent sessions.</div> : null}
          {chartData.map((item) => {
            const amount = Number(item.amount || 0);
            const max = Math.max(...chartData.map((x) => Number(x.amount || 0)), 1);
            return (
              <div key={item.sessionId} className={styles.chartBar}>
                <div className={styles.bar} style={{ height: `${Math.max(8, (amount / max) * 100)}%` }}>
                  <span className={styles.barValue}>{asInr(amount)}</span>
                </div>
                <span className={styles.barLabel}>{String(item.callType || "").toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.servicesSection}>
        <h2>Service-wise Earnings</h2>
        <div className={styles.servicesList}>
          {topServices.length === 0 ? <div className={styles.serviceItem}>No sessions found for selected period.</div> : null}
          {topServices.map((service, index) => (
            <div key={service.key} className={styles.serviceItem}>
              <div className={styles.serviceRank}>#{index + 1}</div>
              <div className={styles.serviceInfo}>
                <h4>{service.key.toUpperCase()}</h4>
                <p>
                  {service.sessions} sessions • {service.minutes.toFixed(2)} min
                </p>
              </div>
              <div className={styles.serviceRevenue}>{asInr(service.earning)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsSection;
