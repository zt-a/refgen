import { $api } from "../api/api";

/* 1. Генерация плана */
export const generatePlan = async (data: {
  topic: string;
  subject: string;
  checked_by: string;
  language?: string;
  page_count?: number;
  chapters_count?: number;
}) => {
  const res = await $api.post("/api/v1/essays/plan/generate", data);
  return res.data as { essay_id: number };
};

/* 2. Получить главы по эссе */
export const getChapters = async (essay_id: number) => {
  const res = await $api.get(`/api/v1/essays/${essay_id}/chapters`);
  return res.data as {
    chapters: { id: number; title: string; position: number }[];
  };
};

/* 3. Обновить название главы */
export const updateChapterTitle = async (chapter_id: number, title: string) => {
  await $api.put("/api/v1/essays/chapter/title/update", {
    chapter_id,
    title,
  });
};

/* 4. Генерация эссе */
export const generateEssay = async (essay_id: number) => {
  const res = await $api.post(`/api/v1/essays/${essay_id}/generate`);
  return res.data;
};

/* 5. Статус генерации */
export const getEssayStatus = async (essay_id: number) => {
  const res = await $api.get(`/api/v1/essays/${essay_id}/status`);
  return res.data as { status: string };
};

/* 6. Скачать DOCX */
export const downloadEssay = async (essay_id: number) => {
  const res = await $api.get(`/api/v1/refprint/${essay_id}`, {
    responseType: "blob",
  });
  return res.data;
};


/* Получить все эссе пользователя */
export const getAllEssays = async () => {
  const res = await $api.get("/api/v1/essays");
  return res.data as {
    essays: {
      id: number;
      topic: string;
      page_count: number;
      date: string;
      status: string;
    }[];
  };
};
