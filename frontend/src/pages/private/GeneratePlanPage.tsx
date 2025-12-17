import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChapters, updateChapterTitle } from "../../services/essayService";
import ButtonPrimary from "../../components/UI/ButtonPrimary";

type Chapter = {
  id: number;
  title: string;
  position: number;
};

const GeneratePlanPage = () => {
  const { essay_id } = useParams<{ essay_id: string }>();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Подгружаем главы
  useEffect(() => {
    if (!essay_id) return;
    setLoading(true);
    getChapters(Number(essay_id))
      .then(res => setChapters(res.chapters))
      .catch(() => setError("Ошибка при загрузке глав"))
      .finally(() => setLoading(false));
  }, [essay_id]);

  // Локальное изменение заголовка
  const handleTitleChange = (chapterId: number, newTitle: string) => {
    setChapters(prev =>
      prev.map(ch => (ch.id === chapterId ? { ...ch, title: newTitle } : ch))
    );
  };

  // Сохраняем изменения на backend
  const handleSaveChanges = async () => {
    setSaving(true);
    setError("");
    try {
      await Promise.all(chapters.map(ch => updateChapterTitle(ch.id, ch.title)));
      alert("Изменения сохранены!");
    } catch {
      setError("Ошибка при сохранении изменений");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Загрузка глав...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>План реферата</h1>

      <ul>
        {chapters.map(ch => (
          <li key={ch.id} style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={ch.title}
              onChange={(e) => handleTitleChange(ch.id, e.target.value)}
              style={{ width: "100%", padding: 6 }}
            />
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <ButtonPrimary onClick={handleSaveChanges} disabled={saving}>
          {saving ? "Сохраняем..." : "Сохранить изменения"}
        </ButtonPrimary>

        <ButtonPrimary onClick={() => navigate(`/generate/item/${essay_id}`)}>
          Сгенерировать реферат
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default GeneratePlanPage;
