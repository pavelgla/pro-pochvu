import { redirect } from "next/navigation";

// База знаний пока не наполнена реальными статьями — ведём в блог,
// где уже опубликованы материалы по уходу, удобрениям и озеленению.
// Видео-раздел остаётся отдельно: /knowledge-base/video.
export default function KnowledgeBasePage() {
  redirect("/blog");
}
