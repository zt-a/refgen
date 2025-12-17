import { motion } from "framer-motion";
import styles from '../../styles/pages/NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles.wrapper}>
            <motion.h1
                className={styles.title}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            >
                404
            </motion.h1>

            <motion.h2
                className={styles.subtitle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Страница не найдена
            </motion.h2>

            <motion.p
                className={styles.description}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Возможно, эта страница ещё в разработке или была удалена.
            </motion.p>

            <motion.button
                className={styles.homeButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
            >
                На главную
            </motion.button>
        </div>
    );
};

export default NotFound;
