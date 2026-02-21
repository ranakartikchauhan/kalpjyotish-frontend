import React from "react";
import styles from "./WalletSection.module.css";
import { useGetAstroWalletQuery } from "../../services/backendApi";

const asInr = (value) => `INR ${Number(value || 0).toFixed(2)}`;

const WalletSection = ({ astrologerId }) => {
  const { data, isLoading } = useGetAstroWalletQuery(
    { astroId: astrologerId },
    { skip: !astrologerId }
  );

  const transactions = data?.transactions || [];
  const walletBalance = Number(data?.walletBalance || 0);
  const totalSessions = Number(data?.totalSessions || 0);
  const totalMinutes = Number(data?.totalMinutes || 0);
  const avgPerSession = totalSessions > 0 ? walletBalance / totalSessions : 0;

  if (!astrologerId) {
    return <div className={styles.walletContainer}>Please login as astrologer.</div>;
  }

  if (isLoading) {
    return <div className={styles.walletContainer}>Loading wallet...</div>;
  }

  return (
    <div className={styles.walletContainer}>
      <div className={styles.balanceCard}>
        <div className={styles.balanceInfo}>
          <h3>Total Earned (Wallet)</h3>
          <h1>{asInr(walletBalance)}</h1>
          <p>Completed sessions credited based on charged per-minute rate</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>INR</div>
          <div className={styles.statInfo}>
            <h4>Total Earnings</h4>
            <h2>{asInr(walletBalance)}</h2>
            <p>All completed sessions</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>#</div>
          <div className={styles.statInfo}>
            <h4>Total Sessions</h4>
            <h2>{totalSessions}</h2>
            <p>Chat + Voice + Video + Live</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>MIN</div>
          <div className={styles.statInfo}>
            <h4>Total Minutes</h4>
            <h2>{totalMinutes.toFixed(2)}</h2>
            <p>Average/session: {avgPerSession > 0 ? asInr(avgPerSession) : "INR 0.00"}</p>
          </div>
        </div>
      </div>

      <div className={styles.transactionsSection}>
        <h2>Earning Transactions</h2>
        <div className={styles.transactionsList}>
          {transactions.length === 0 ? <div className={styles.transactionItem}>No transactions found.</div> : null}
          {transactions.map((tx) => (
            <div key={tx.sessionId} className={styles.transactionItem}>
              <div className={styles.transactionIcon}>+</div>
              <div className={styles.transactionDetails}>
                <h4>{String(tx.callType || "session").toUpperCase()} Session</h4>
                <p>
                  {new Date(tx.date).toLocaleDateString()} at{" "}
                  {new Date(tx.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p>
                  {tx.durationMinutes} min x INR {Number(tx.ratePerMinute || 0).toFixed(2)}/min
                </p>
              </div>
              <div className={`${styles.transactionAmount} ${styles.credit}`}>+{asInr(tx.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
