import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateEssay, getEssayStatus, downloadEssay, getChapters } from "../../services/essayService";

const GenerateItemPage = () => {
  const { essay_id } = useParams<{ essay_id: string }>();
  const [essayId, setEssayId] = useState<number | null>(null);
  const [plan, setPlan] = useState<{ id: number; title: string }[]>([]);
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Получаем главы из backend, если пришли напрямую
  useEffect(() => {
    if (!essay_id) return;
    getChapters(Number(essay_id))
      .then(res => setPlan(res.chapters))
      .catch(() => setError("Ошибка при загрузке плана"));
  }, [essay_id]);

  // Генерация эссе
  useEffect(() => {
    if (!plan.length) return;
    const startEssay = async () => {
      try {
        const data = await generateEssay(Number(essay_id));
        setEssayId(data.essay_id);
      } catch {
        setError("Ошибка при генерации эссе");
      }
    };
    startEssay();
  }, [plan, essay_id]);

  // Проверка статуса
  useEffect(() => {
    if (!essayId) return;
    const interval = setInterval(async () => {
      const statusData = await getEssayStatus(essayId);
      setStatus(statusData.status);
      if (statusData.status === "ready") clearInterval(interval);
    }, 5000);
    return () => clearInterval(interval);
  }, [essayId]);

  const handleDownload = async () => {
    if (!essayId) return;
    setLoading(true);
    try {
      const file = await downloadEssay(essayId);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "essay.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Ошибка при скачивании реферата");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p>{error}</p>;
  if (!plan.length) return <p>Загрузка плана...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h1>Генерация реферата</h1>
      <p>Статус: {status}</p>
      {status === "ready" && (
        <button onClick={handleDownload} disabled={loading}>
          {loading ? "Скачиваем..." : "Скачать реферат"}
        </button>
      )}
    </div>
  );
};

export default GenerateItemPage;
