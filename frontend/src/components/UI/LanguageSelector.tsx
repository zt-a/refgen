import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, spring } from "framer-motion";
import styles from "../../styles/components/UI/LanguageSelector.module.css";
import { useTranslation } from "react-i18next";
import flag_en from '../../assets/flag_en.jpg';
import flag_ru from '../../assets/flag_ru.jpg';
import flag_kg from '../../assets/flag_kg.png';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const languages = [
        { code: "ru", label: "RU", icon: flag_ru },
        { code: "en", label: "EN", icon: flag_en },
        { code: "ky", label: "KY", icon: flag_kg },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <div className={styles.languageWrapper} ref={wrapperRef}>
            <button className={styles.languageBtn} onClick={() => setOpen(prev => !prev)}>
                <img src={currentLang.icon} width="20px" alt={currentLang.label} />
                {currentLang.label}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className={styles.languageDropdown}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ type: spring, stiffness: 160, damping: 14, duration: 0.25 }}
                    >
                        {languages.map(lang => (
                            <div
                                key={lang.code}
                                className={styles.languageItem}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setOpen(false);
                                }}
                            >
                                <img src={lang.icon} width="24px" height="auto" alt={lang.label} /> {lang.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
