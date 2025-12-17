import { useAuth } from "../../hooks/useAuth";
import InfoCard from "../../components/UI/InfoCard";
import { FileText, TrendingUp, WandSparkles } from "lucide-react";
import QuickActionsCard from "../../components/UI/QuickActionsCard";
import MiniCard from "../../components/UI/MiniCard";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import styles from '../../styles/pages/DashboardPage.module.css';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { $api } from "../../api/api";
import { getAllEssays } from "../../services/essayService";

type Essay = {
  id: number;
  topic: string;
  page_count: number;
  date: string;
  status: string;
};

const DashboardPage = () => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

//  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
//      setLoading(true);
//      console.log($api.defaults.baseURL);
//      $api.get(`${$api.defaults.baseURL}/api/v1/essays`)
//        .then(res => setEssays(res.data.essays)) // <-- добавляем .essays
//        .catch(() => console.error("Ошибка загрузки эссе"))
//       .finally(() => setLoading(false));
//  }, []);
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
        `api/v1/refprint/${id}`,
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.Dashboard}>
      <h2 className={styles.Welcome}>Добро пожаловать {user?.username}</h2>
      <span className={styles.SubWelcome}>Вот обзор ваших документов и активности</span>
      <section
        className={styles.InfoCards}
      >
        <Link
          to="/library"
        >
          <InfoCard
            label="Всего документов"
            value={essays.length}
            Icon={FileText}
          />
        </Link>
        <Link
          to="/library"
        >
          <QuickActionsCard
              title="Мои документы"
              subtitle="Просмотр библиотеки"
              Icon={FileText}
              color="#b700ff"
              colorTransparent="rgba(183, 0, 255, 0.15)"
          />
        </Link>
        <Link to="/balance">
          <InfoCard
            label="Баланс"
            value={`${user?.balance} KGZ`}
            Icon={TrendingUp}
            color="white"
            bgColor="#00d636ff"
          />
        </Link>

      </section>

      <ButtonPrimary onClick={() => navigate('/generate')} className={styles.mainBtn}>
        <span style={{display: "flex", justifyContent: "center", gap: "15px"}}><WandSparkles/> Сгенерировать реферат</span>
      </ButtonPrimary>

      <section className={styles.cards}>
        <span className={styles.headText}>Ваши рефераты</span>
        {essays.map(e => (
          <MiniCard
            className={styles.cardItem}
            key={e.id}
            id={String(e.id)}
            title={e.topic}
            subtitle={`${e.page_count} страниц`}
            desc={e.date}
            status={e.status}
            onDownload={(id) => {
                console.log("Скачиваем", id)
                downloadRefPrint(id);
              }
            }
            onGenerate={(id) => navigate(`/generate/item/${id}`)} // переход на генерацию
          />
        ))}
      </section>


    </div>
  );
};

export default DashboardPage;
