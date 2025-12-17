import RegisterForm from '../../components/RegisterForm';
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

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (username: string, email: string, password: string) => {
        try {
            await register({ username, email, password });
            navigate('/account'); // редирект после успешной регистрации
        } catch (e) {
            console.log('Ошибка регистрации', e);
        }
    };

    return (
        <section className={styles.Page}>
            <div className={styles.topLeftHeader}>
                <motion.div variants={itemTopVariants} initial="hidden" animate="visible">
                    <Back url="/" />
                </motion.div>

                <motion.div 
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
                <RegisterForm onSubmit={handleRegister} />
            </motion.div>
        </section>
    );
};

export default RegisterPage;
