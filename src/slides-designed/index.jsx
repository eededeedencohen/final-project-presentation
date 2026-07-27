/* ============================================================
   רישום השקפים - הסדר כאן קובע את סדר המצגת.
   להוספת שקף: יוצרים תיקייה עם קומפוננטה + styles.css,
   מייבאים כאן ומוסיפים רשומה למערך.
   ============================================================ */

import TitleSlide from "./s01-title/TitleSlide.jsx";
import ProblemSlide from "./s02-problem/ProblemSlide.jsx";
import MotivationSlide from "./s03-motivation/MotivationSlide.jsx";
import SolutionSlide from "./s04-solution/SolutionSlide.jsx";
import ExistingSlide from "./s05-existing/ExistingSlide.jsx";
import GoalsSlide from "./s06-goals/GoalsSlide.jsx";
import TechSlide from "./s07-tech/TechSlide.jsx";
import DataDivider from "./s08-data-divider/DataDivider.jsx";
import DataFlowSlide from "./s09-data-flow/DataFlowSlide.jsx";
import ServerDivider from "./s10-server-divider/ServerDivider.jsx";
import ServerFlowSlide from "./s11-server-flow/ServerFlowSlide.jsx";
import AiServicesSlide from "./s12-ai-services/AiServicesSlide.jsx";
import ClientDivider from "./s13-client-divider/ClientDivider.jsx";
import ClientFlowSlide from "./s14-client-flow/ClientFlowSlide.jsx";
import ChallengesSlide from "./s15-challenges/ChallengesSlide.jsx";
import ImprovementsSlide from "./s16-improvements/ImprovementsSlide.jsx";
import ConclusionsSlide from "./s17-conclusions/ConclusionsSlide.jsx";
import ThanksSlide from "./s18-thanks/ThanksSlide.jsx";

export const SLIDES = [
  { id: "title", label: "פתיחה", Component: TitleSlide },
  { id: "problem", label: "הבעיה", Component: ProblemSlide },
  { id: "motivation", label: "מוטיבציה", Component: MotivationSlide },
  { id: "solution", label: "הפתרון", Component: SolutionSlide },
  { id: "existing", label: "מה קיים היום", Component: ExistingSlide },
  { id: "goals", label: "מטרות", Component: GoalsSlide },
  { id: "tech", label: "טכנולוגיות", Component: TechSlide },
  { id: "data-divider", label: "DATA", Component: DataDivider },
  { id: "data-flow", label: "Data Flow", Component: DataFlowSlide },
  { id: "server-divider", label: "SERVER/API", Component: ServerDivider },
  { id: "server-flow", label: "Server Flow", Component: ServerFlowSlide },
  { id: "ai-services", label: "AI Services", Component: AiServicesSlide },
  { id: "client-divider", label: "CLIENT SPA", Component: ClientDivider },
  { id: "client-flow", label: "Client Flow", Component: ClientFlowSlide },
  { id: "challenges", label: "אתגרים", Component: ChallengesSlide },
  {
    id: "improvements",
    label: "שיפורים עתידיים",
    Component: ImprovementsSlide,
  },
  { id: "conclusions", label: "מסקנות", Component: ConclusionsSlide },
  { id: "thanks", label: "תודה", Component: ThanksSlide },
];
