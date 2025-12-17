import LandingPageHeader from '../../components/LandingPageHeader';
import Button from '../../components/UI/Button';
import ButtonPrimary from '../../components/UI/ButtonPrimary';
import styles from '../../styles/pages/LandingPage.module.css';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useNavigate, Navigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import LandingCard from '../../components/UI/LandingCard';
import Footer from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';


// Контейнер — управляет последовательностью появления
const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08, // задержка между элементами
        },
    },
};

// Каждый элемент — анимация снизу вверх
const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const, // TS теперь понимает тип
            stiffness: 120,
            damping: 15
        }
    }
};

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuth } = useAuth(); 
    
    if (isAuth) {
        return <Navigate to="/dashboard" />
    }


    return (
        <>
        <motion.div
            className={styles.Container}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <LandingPageHeader />
            </motion.div>

            <motion.div className={styles.landingPageTitle} variants={itemVariants}>
                Создавайте документы Word
            </motion.div>

            <motion.a href="#" className={styles.landingPageSubtitle} variants={itemVariants}>
                быстро и легко
            </motion.a>

            <motion.div className={styles.landingPageDescription} variants={itemVariants}>
                RefGen — это современный сервис для автоматической генерации, хранения и редактирования документов Word. Работайте эффективнее на любом устройстве.
            </motion.div>

            <motion.div className={styles.landingPageButtons} variants={itemVariants}>
                <ButtonPrimary onClick={() => navigate("/register")}>Начать бесплатно</ButtonPrimary>
                <Button onClick={() => navigate("/login")} >Узнать больше</Button>
            </motion.div>

            <div className={styles.cardsContainer}>
                {[{
                    title: "Генерация документов",
                    description: "Создавайте документы Word автоматически с помощью AI",
                    Icon: FileText
                },
                {
                    title: "Хранение и редактирование",
                    description: "Храните все документы в одном месте с возможностью редактирования",
                    Icon: FileText
                },
                {
                    title: "Безопасность",
                    description: "Ваши документы надежно защищены и доступны только вам",
                    Icon: FileText
                }].map((card, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                    >
                        <LandingCard
                            Icon={card.Icon}
                            title={card.title}
                            description={card.description}
                        />
                    </motion.div>
                ))}
            </div>


            </motion.div>
            <div className={styles.footer}>
                <Footer spanText='Все права защищены.'/>
            </div>
        </>
    );
};

export default LandingPage;
