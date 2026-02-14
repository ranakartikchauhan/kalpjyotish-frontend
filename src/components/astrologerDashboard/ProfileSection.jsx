import React from 'react';
import styles from './ProfileSection.module.css';

const ProfileSection = ({ astrologerData = {} }) => {
    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarLarge}>
                        <img src={astrologerData.profilePhoto || astrologerData.profileImage || '/assets/user-avatar.png'} alt="Profile" />
                    </div>
                    <button className={styles.editBtn}>Profile</button>
                </div>

                <div className={styles.profileDetails}>
                    <div className={styles.detailRow}>
                        <label>Full Name</label>
                        <p>{astrologerData.name || '-'}</p>
                    </div>
                    <div className={styles.detailRow}>
                        <label>Email</label>
                        <p>{astrologerData.email || '-'}</p>
                    </div>
                    <div className={styles.detailRow}>
                        <label>Phone</label>
                        <p>{astrologerData.number || astrologerData.phone || '-'}</p>
                    </div>
                    <div className={styles.detailRow}>
                        <label>Specialization</label>
                        <p>
                            {Array.isArray(astrologerData.skills)
                                ? astrologerData.skills.join(', ')
                                : astrologerData.specialization || '-'}
                        </p>
                    </div>
                    <div className={styles.detailRow}>
                        <label>Experience</label>
                        <p>{astrologerData.experience || '-'}</p>
                    </div>
                    <div className={styles.detailRow}>
                        <label>EID</label>
                        <p>{astrologerData.eid || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
