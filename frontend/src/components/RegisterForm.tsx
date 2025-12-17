import { useState } from "react";
import Input from "./UI/Input";
import ButtonPrimary from "./UI/ButtonPrimary";
import styles from '../styles/components/RegisterForm.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface RegisterFormProps {
    onSubmit: (username: string, email: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('registerPasswordMismatch'));
            return;
        }
        setError(null);
        onSubmit(username, email, password);
    };

    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            <p><span>{t('registerTitle')}</span></p>
            <p>{t('registerDescription')}</p>

            <label>{t('registerFormUsernameLabel')}</label>
            <Input 
                value={username} 
                onChange={setUsername} 
                placeholder={t('registerFormUsernamePlaceholder')}
                type="text"
            />

            <label>{t('registerFormEmailLabel')}</label>
            <Input
                value={email} 
                onChange={setEmail} 
                placeholder={t('registerFormEmailPlaceholder')}
                type="email"
            />

            <label>{t('registerFormPasswordLabel')} </label>
            <Input 
                value={password} 
                onChange={setPassword} 
                placeholder={t('registerFormPasswordPlaceholder')} 
                type="password"
            />

            <label>{t('registerFormConfirmPasswordLabel')}</label>
            <Input 
                value={confirmPassword} 
                onChange={setConfirmPassword} 
                placeholder={t('registerFormConfirmPasswordPlaceholder')}
                type="password"
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ButtonPrimary type="submit">
                {t('registerFormSubmit')}
            </ButtonPrimary>

            <p>
                {t('registerAuthVariant')} <Link to='/login'>{t('login')}</Link>
            </p>
        </form>
    )
}

export default RegisterForm;
