/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useState, useEffect } from "react";
import { AuthContext, type Profile } from "../../context/AuthContext";
import Input from "../../components/UI/Input";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import SelectInput from "../../components/UI/SelectInput";
import styles from '../../styles/pages/AccountPage.module.css';
import Button from "../../components/UI/Button";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const { profile, updateProfile, isAuth, getProfile, logout } = useContext(AuthContext);
    const [form, setForm] = useState<Profile | null>(null);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    // Загружаем профиль один раз при монтировании
    useEffect(() => {
        if (isAuth && !profile) {
            getProfile();
        }
    }, [isAuth, profile, getProfile]);

    // Синхронизируем локальный state с profile при изменении
    useEffect(() => {
        if (profile) {
            setForm(profile);
        }
    }, [profile]);

    if (!isAuth) {
        return <p style={{ color: "red" }}>Пожалуйста, войдите в аккаунт, чтобы управлять документами.</p>;
    }

    if (!form) {
        return <p>Загрузка профиля...</p>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Проверка на заполненность всех полей
        for (const key of Object.keys(form)) {
            if (form[key as keyof Profile] === null || form[key as keyof Profile] === "") {
                setError("Все поля должны быть заполнены для генерации документов.");
                return;
            }
        }

        try {
            await updateProfile(form);
            setError("");
            alert("Профиль успешно обновлен. Теперь можно генерировать документы.");
            navigate("/dashboard");
        } catch (e) {
            setError("Ошибка при обновлении профиля.");
            console.log(e);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Профиль</h1>
            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <Input name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Имя" />
                <Input name="surname" value={form.surname} onChange={(v) => setForm({ ...form, surname: v })} placeholder="Фамилия" />
                <Input name="patronymic" value={form.patronymic || ""} onChange={(v) => setForm({ ...form, patronymic: v })} placeholder="Отчество" />
                <Input name="university" value={form.university || ""} onChange={(v) => setForm({ ...form, university: v })} placeholder="Университет" />
                <Input name="faculty" value={form.faculty || ""} onChange={(v) => setForm({ ...form, faculty: v })} placeholder="Факультет" />
                <SelectInput
                    name="course"
                    value={String(form.course || 1)}
                    onChange={(v) => setForm({ ...form, course: Number(v) })}
                    options={[{ label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" }, { label: "5", value: "5" }, { label: "6", value: "6" }]}
                />
                <Input name="group" value={form.group || ""} onChange={(v) => setForm({ ...form, group: v })} placeholder="Группа" />
                <Input name="city" value={form.city || ""} onChange={(v) => setForm({ ...form, city: v })} placeholder="Город" />
                <Input name="phone_number" value={form.phone_number || ""} onChange={(v) => setForm({ ...form, phone_number: v })} placeholder="Телефон" />
                <ButtonPrimary type="submit" className={styles.formSingle}>Сохранить профиль</ButtonPrimary>
            </form>

            <br />
            <Button onClick={logout} className={styles.btns}>Выйти из аккаунта</Button>

            {Object.values(form).some(value => value === "" || value === null) && (
                <p className={styles.notice}>
                    Для генерации документов необходимо заполнить все поля профиля.
                </p>
            )}
        </div>

    );
};

export default AccountPage;
