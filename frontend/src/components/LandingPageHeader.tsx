import styles from '../styles/components/LandingPageHeader.module.css';
import ButtonPrimary from './UI/ButtonPrimary';
import Logo from './UI/Logo';
import { motion, spring } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './UI/ProfileMenu';
import { useTranslation } from 'react-i18next';

const LandingPageHeader = () => {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const { t } = useTranslation();
    

    const motionConfig = {
        initial: { x: 40, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { type: spring, stiffness: 120, damping: 15 }
    };

    return (
        <header className={styles.Header}>
            <motion.div
                className={styles.leftHeader}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: spring, stiffness: 120, damping: 15 }}
            >
                <Logo />
            </motion.div>

            <motion.div
                className={styles.rightHeader}
                {...motionConfig}
                transition={{ ...motionConfig.transition, delay: 0.1 }}
            >
                {!isAuth ? (
                    <>
                        <Link to="/login" className={styles.link}>{t('login')}</Link>
                        <ButtonPrimary onClick={() => navigate("/register")}>{t('register')}</ButtonPrimary>
                    </>
                ) : (
                    <ProfileMenu />
                )}
            </motion.div>
        </header>
    );
};

export default LandingPageHeader;
