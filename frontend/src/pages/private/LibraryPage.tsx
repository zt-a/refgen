import { useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import { $api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";
import { Search } from "lucide-react";
import { getAllEssays } from "../../services/essayService";

// Тип для эссе
type Essay = {
  id: number;
  topic: string;
  page_count: number;
  date: string;
  status: string;
};

const LibraryPage = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");


  useEffect(() => {
    const fetchEssays = async () => {
      setLoading(true);
      try {
        const data = await getAllEssays();
        setEssays(data.essays);
      } catch (err) {
        console.error("Ошибка загрузки эссе", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, []);

  const downloadRefPrint = async (id: string) => {
    try {
      const response = await $api.get(
        `/v1/refprint/${id}`,
        {
          responseType: 'blob',
        }
      )

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `refgen_${id}.docx` // можно добавить .pdf, .docx и т.п.
      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Ошибка при скачивании файла', error)
    }
  }


  const filteredEssays = essays.filter(e =>
    e.topic.toLowerCase().includes(search.toLowerCase())
  );


  if (loading) return <p>Загрузка эссе...</p>;



  return (
    <>
      <h2><Search/> Поиск по теме</h2>
      <Input
        type="text"
        placeholder="Поиск по теме..."
        value={search}
        onChange={setSearch}
        
      />

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          padding: 20,
        }}
      >
        {filteredEssays.map(e => (
          <Card
            key={e.id}
            id={String(e.id)}
            title={e.topic}
            pages={e.page_count}
            date={e.date}
            status={e.status}
            onDownload={(id) => {
                downloadRefPrint(id);
              }
            }
            onGenerate={(id) => navigate(`/generate/item/${id}`)} // переход на генерацию
          />
        ))}
      </div>
    </>
  );
};

export default LibraryPage;
