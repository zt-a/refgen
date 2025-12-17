import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../../components/UI/Input";
import NumberInput from "../../components/UI/NumberInput";
import SelectInput from "../../components/UI/SelectInput";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import { generatePlan } from "../../services/essayService";
import styles from '../../styles/pages/GeneratePage.module.css';

const GeneratePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    topic: "",
    subject: "",
    checked_by: "",
    language: "ru",
    page_count: 20,
    chapters_count: 6,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name: string, value: string | number) => {
    if (name === "page_count") {
      const pageValue = Math.max(10, Math.min(Number(value), 40));
      setForm((prev) => ({
        ...prev,
        page_count: pageValue,
        chapters_count:
          prev.chapters_count > (pageValue > 20 ? 15 : 8)
            ? pageValue > 20
              ? 15
              : 8
            : prev.chapters_count,
      }));
    } else if (name === "chapters_count") {
      const maxChapters = form.page_count > 20 ? 15 : 8;
      const minChapters = form.page_count > 20 ? 8 : 2;
      const chaptersValue = Math.max(minChapters, Math.min(Number(value), maxChapters));
      setForm((prev) => ({ ...prev, chapters_count: chaptersValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { essay_id } = await generatePlan(form);
      navigate(`/generate/plan/${essay_id}`);
    } catch {
      setError("Ошибка генерации плана");
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.title}>Генерация реферата</h1>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Первый ряд: Тема */}
        <Input
          name="topic"
          value={form.topic}
          onChange={(value) => handleChange("topic", value)}
          placeholder="Тема"
          required
        />

        {/* Второй ряд: Предмет и Проверяющий */}
        <div className={styles.row}>
          <Input
            name="subject"
            value={form.subject}
            onChange={(value) => handleChange("subject", value)}
            placeholder="Предмет"
            required
          />
          <Input
            name="checked_by"
            value={form.checked_by}
            onChange={(value) => handleChange("checked_by", value)}
            placeholder="Проверяющий"
            required
          />
        </div>

        {/* Третий ряд: page_count, chapters_count, language */}
        <div className={styles['row-three']}>
          <div className={styles.fieldGroup}>
            <label>Количество страниц:</label>
            <NumberInput
              value={form.page_count}
              onChange={(value) => handleChange("page_count", value)}
              min={10}
              max={40}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Количество глав:</label>
            <NumberInput
              value={form.chapters_count}
              onChange={(value) => handleChange("chapters_count", value)}
              min={form.page_count > 20 ? 8 : 2}
              max={form.page_count > 20 ? 15 : 8}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Язык:</label>
            <SelectInput
              value={form.language}
              onChange={(value) => handleChange("language", value)}
              options={[
                { label: "Русский", value: "ru" },
                { label: "Английский", value: "en" },
                { label: "Кыргызский", value: "ky" },
              ]}
            />
          </div>
        </div>


        {/* Кнопка */}
        <ButtonPrimary type="submit" disabled={loading}>
          {loading ? "Генерируем план..." : "Сгенерировать план"}
        </ButtonPrimary>
      </form>
    </motion.div>
  );
};

export default GeneratePage;
