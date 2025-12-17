import { useState } from "react";
import Input from "./UI/Input";
import ButtonPrimary from "./UI/ButtonPrimary";
import styles from '../styles/components/RegisterForm.module.css';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            <p><span>{t('loginTitle')}</span></p>
            <p>{t('loginDescription')}</p>

            <label>{t('loginFormEmailLabel')}</label>
            <Input
                value={email} 
                onChange={setEmail} 
                placeholder={t('loginFormEmailPlaceholder')}
                type="email"
            />

            <label>{t('loginFormPasswordLabel')}</label>
            <Input 
                value={password} 
                onChange={setPassword} 
                placeholder={t('loginFormPasswordPlaceholder')} 
                type="password"
            />

            <a href="#" style={{ float: "right", margin: "10px 0" }}>
                {t('loginForgotPassword')}
            </a>

            <ButtonPrimary type="submit">
                {t('login')}
            </ButtonPrimary>

            <p>
                {t('loginAuthVariant')} <Link to='/register'>{t('register')}</Link>
            </p>
        </form>
    );
}

export default LoginForm;
