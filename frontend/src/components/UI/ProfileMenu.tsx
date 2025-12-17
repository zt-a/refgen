import styles from '../../styles/components/UI/ProfileMenu.module.css';
import { AnimatePresence, motion, spring } from 'framer-motion';
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Wallet, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../UI/LanguageSelector';

const ProfileMenu = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    const toggleMenu = () => setOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.profileWrapper} ref={wrapperRef}>
            <button className={styles.profileBtn} onClick={toggleMenu}>
                <div className={styles.ProfileImage}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : "P"}
                </div>
                <div className={styles.UserInfo}>
                    {user?.username || t("profile")}
                    <span>{user?.email || ""}</span>
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="profile-menu"
                        className={styles.profileMenu}
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ type: spring, stiffness: 160, damping: 14, duration: 0.25 }}
                    >
                        {/* Вставляем LanguageSelector */}
                        <LanguageSelector />

                        <button className={styles.menuItem} onClick={() => navigate("/account")}>
                            <Settings size={20}/> {t('profile')}
                        </button>
                        <button className={styles.menuItem} onClick={() => navigate("/balance")}>
                            <Wallet size={20}/> {t('balance')}: {user?.balance || 0} KGZ
                        </button>
                        <button className={`${styles.menuItem} ${styles.SignOutMenuItem}`} onClick={logout}>
                            <LogOut/> {t('signOut')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileMenu;
