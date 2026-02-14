import React, { useState } from 'react';
import styles from './WalletSection.module.css';

const WalletSection = () => {
    const [walletBalance] = useState(45250);
    const [transactions] = useState([
        { id: 1, type: 'credit', amount: 500, description: 'Consultation - Priya Sharma', date: '2024-02-10', time: '10:30 AM' },
        { id: 2, type: 'credit', amount: 750, description: 'Consultation - Rahul Verma', date: '2024-02-10', time: '09:15 AM' },
        { id: 3, type: 'debit', amount: 5000, description: 'Withdrawal to Bank', date: '2024-02-09', time: '03:20 PM' },
        { id: 4, type: 'credit', amount: 600, description: 'Consultation - Anjali Singh', date: '2024-02-09', time: '11:45 AM' },
        { id: 5, type: 'credit', amount: 450, description: 'Consultation - Vikram Patel', date: '2024-02-08', time: '02:30 PM' },
        { id: 6, type: 'debit', amount: 10000, description: 'Withdrawal to Bank', date: '2024-02-05', time: '04:15 PM' },
    ]);

    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const handleWithdraw = (e) => {
        e.preventDefault();
        alert(`Withdrawal request of ₹${withdrawAmount} submitted successfully!`);
        setWithdrawAmount('');
        setShowWithdrawModal(false);
    };

    return (
        <div className={styles.walletContainer}>
            {/* Wallet Balance Card */}
            <div className={styles.balanceCard}>
                <div className={styles.balanceInfo}>
                    <h3>Available Balance</h3>
                    <h1>₹{walletBalance.toLocaleString()}</h1>
                    <p>Last updated: Today at 11:30 AM</p>
                </div>
                <div className={styles.balanceActions}>
                    <button className={styles.withdrawBtn} onClick={() => setShowWithdrawModal(true)}>
                        Withdraw Money
                    </button>
                    <button className={styles.historyBtn}>View Full History</button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📈</div>
                    <div className={styles.statInfo}>
                        <h4>This Month</h4>
                        <h2>₹18,750</h2>
                        <p className={styles.positive}>+15% from last month</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💼</div>
                    <div className={styles.statInfo}>
                        <h4>Total Consultations</h4>
                        <h2>1,250</h2>
                        <p>All time</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏱️</div>
                    <div className={styles.statInfo}>
                        <h4>Avg. Session Time</h4>
                        <h2>25 min</h2>
                        <p>This month</p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className={styles.transactionsSection}>
                <h2>Recent Transactions</h2>
                <div className={styles.transactionsList}>
                    {transactions.map(transaction => (
                        <div key={transaction.id} className={styles.transactionItem}>
                            <div className={styles.transactionIcon}>
                                {transaction.type === 'credit' ? '📥' : '📤'}
                            </div>
                            <div className={styles.transactionDetails}>
                                <h4>{transaction.description}</h4>
                                <p>{transaction.date} at {transaction.time}</p>
                            </div>
                            <div className={`${styles.transactionAmount} ${styles[transaction.type]}`}>
                                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Withdraw Money</h2>
                            <button className={styles.closeBtn} onClick={() => setShowWithdrawModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleWithdraw}>
                            <div className={styles.modalBody}>
                                <p>Available Balance: ₹{walletBalance.toLocaleString()}</p>
                                <div className={styles.formGroup}>
                                    <label>Enter Amount</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Enter amount to withdraw"
                                        min="100"
                                        max={walletBalance}
                                        required
                                    />
                                </div>
                                <div className={styles.bankInfo}>
                                    <p><strong>Bank Account:</strong> XXXX XXXX XXXX 4567</p>
                                    <p><strong>IFSC Code:</strong> SBIN0001234</p>
                                    <button type="button" className={styles.changeBankBtn}>Change Bank Account</button>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowWithdrawModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.confirmBtn}>
                                    Confirm Withdrawal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletSection;