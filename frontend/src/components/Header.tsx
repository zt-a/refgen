import styles from '../styles/components/Header.module.css';
import Logo from './UI/Logo';
import { motion, spring } from 'framer-motion';
import ProfileMenu from './UI/ProfileMenu';

const Header = () => {
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
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: spring, stiffness: 120, damping: 15 }}
            >
                <ProfileMenu />
            </motion.div>
        </header>
    );
};

export default Header;
