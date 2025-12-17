import LoginForm from '../../components/LoginForm';
import Back from '../../components/UI/Back';
import Logo from '../../components/UI/Logo';
import styles from '../../styles/pages/LoginPage.module.css';
import { motion } from "framer-motion";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const itemTopVariants = {
    hidden: { y: -40, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 120, damping: 15 }
    },
};

const itemBottomVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 120, damping: 15 }
    },
};

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
            // После успешного логина — редирект на главную
            navigate('/');
        } catch (e) {
            console.log('Ошибка авторизации', e);
            // Можно показать уведомление или ошибку в форме
        }
    };

    return (
        <section className={styles.Page}>
            <div className={styles.topLeftHeader}>
                <motion.div className={styles.back} variants={itemTopVariants} initial="hidden" animate="visible">
                    <Back url="/" />
                </motion.div>

                <motion.div 
                    className={styles.logo}
                    variants={itemTopVariants} 
                    initial="hidden" 
                    animate="visible" 
                    transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 15 }}
                >
                    <Logo />
                </motion.div>
            </div>

            <motion.div 
                className={styles.centerForm}
                variants={itemBottomVariants} 
                initial="hidden" 
                animate="visible" 
                transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 15 }}
            >
                <LoginForm onSubmit={handleLogin} />
            </motion.div>
        </section>
    );
};

export default LoginPage;
