import React, { useState } from 'react';
import styles from './EarningsSection.module.css';

const EarningsSection = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const earningsData = {
        today: { amount: 2500, consultations: 5 },
        week: { amount: 12750, consultations: 28 },
        month: { amount: 45250, consultations: 105 },
        year: { amount: 542000, consultations: 1250 }
    };

    const monthlyData = [
        { month: 'Jan', amount: 38500, consultations: 89 },
        { month: 'Feb', amount: 45250, consultations: 105 },
        { month: 'Mar', amount: 41200, consultations: 96 },
        { month: 'Apr', amount: 48900, consultations: 112 },
        { month: 'May', amount: 52300, consultations: 121 },
        { month: 'Jun', amount: 49100, consultations: 115 },
    ];

    const topServices = [
        { name: 'Birth Chart Analysis', count: 45, revenue: 22500 },
        { name: 'Career Consultation', count: 32, revenue: 16000 },
        { name: 'Relationship Guidance', count: 28, revenue: 14000 },
        { name: 'Remedial Solutions', count: 20, revenue: 10000 },
        { name: 'Gemstone Consultation', count: 15, revenue: 7500 },
    ];

    return (
        <div className={styles.earningsContainer}>
            {/* Period Selector */}
            <div className={styles.periodSelector}>
                <button
                    className={selectedPeriod === 'today' ? styles.active : ''}
                    onClick={() => setSelectedPeriod('today')}
                >
                    Today
                </button>
                <button
                    className={selectedPeriod === 'week' ? styles.active : ''}
                    onClick={() => setSelectedPeriod('week')}
                >
                    This Week
                </button>
                <button
                    className={selectedPeriod === 'month' ? styles.active : ''}
                    onClick={() => setSelectedPeriod('month')}
                >
                    This Month
                </button>
                <button
                    className={selectedPeriod === 'year' ? styles.active : ''}
                    onClick={() => setSelectedPeriod('year')}
                >
                    This Year
                </button>
            </div>

            {/* Earnings Summary */}
            <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                    <div className={styles.cardIcon}>💰</div>
                    <div className={styles.cardContent}>
                        <h4>Total Earnings</h4>
                        <h2>₹{earningsData[selectedPeriod].amount.toLocaleString()}</h2>
                        <p>From {earningsData[selectedPeriod].consultations} consultations</p>
                    </div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.cardIcon}>📊</div>
                    <div className={styles.cardContent}>
                        <h4>Average per Session</h4>
                        <h2>₹{Math.round(earningsData[selectedPeriod].amount / earningsData[selectedPeriod].consultations)}</h2>
                        <p>Based on all consultations</p>
                    </div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.cardIcon}>🎯</div>
                    <div className={styles.cardContent}>
                        <h4>Growth Rate</h4>
                        <h2>+15%</h2>
                        <p className={styles.positive}>Compared to last period</p>
                    </div>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className={styles.chartSection}>
                <h2>Monthly Earnings Trend</h2>
                <div className={styles.chart}>
                    {monthlyData.map((data, index) => (
                        <div key={index} className={styles.chartBar}>
                            <div
                                className={styles.bar}
                                style={{ height: `${(data.amount / 60000) * 100}%` }}
                            >
                                <span className={styles.barValue}>₹{(data.amount / 1000).toFixed(0)}k</span>
                            </div>
                            <span className={styles.barLabel}>{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Services */}
            <div className={styles.servicesSection}>
                <h2>Top Performing Services</h2>
                <div className={styles.servicesList}>
                    {topServices.map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <div className={styles.serviceRank}>#{index + 1}</div>
                            <div className={styles.serviceInfo}>
                                <h4>{service.name}</h4>
                                <p>{service.count} consultations</p>
                            </div>
                            <div className={styles.serviceRevenue}>
                                ₹{service.revenue.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Download Report Button */}
            <div className={styles.actionsSection}>
                <button className={styles.downloadBtn}>
                    📥 Download Earnings Report
                </button>
            </div>
        </div>
    );
};

export default EarningsSection;
