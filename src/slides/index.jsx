/* ============================================================
   רישום השקפים — נוצר אוטומטית מהמצגת המקורית (20 שקפים).
   הסדר כאן קובע את סדר המצגת.
   ============================================================ */

import Slide01 from './p01/Slide01.jsx'
import Slide02 from './p02/Slide02.jsx'
import Slide03 from './p03/Slide03.jsx'
import Slide04 from './p04/Slide04.jsx'
import Slide05 from './p05/Slide05.jsx'
import Slide06 from './p06/Slide06.jsx'
import Slide07 from './p07/Slide07.jsx'
import Slide08 from './p08/Slide08.jsx'
import DataFlowExplainer from './x09-data-flow/DataFlowExplainer.jsx'
import Slide10 from './p10/Slide10.jsx'
import ServerFlowExplainer from './x11-server-flow/ServerFlowExplainer.jsx'
import Slide12 from './p12/Slide12.jsx'
import Slide13 from './p13/Slide13.jsx'
import ClientFlowExplainer from './x14-client-flow/ClientFlowExplainer.jsx'
import Slide15 from './p15/Slide15.jsx'
import Slide16 from './p16/Slide16.jsx'
import Slide17 from './p17/Slide17.jsx'
import Slide18 from './p18/Slide18.jsx'
import Slide19 from './p19/Slide19.jsx'
import Slide20 from './p20/Slide20.jsx'

export const SLIDES = [
  { id: 'p01', label: 'פתיחה', Component: Slide01 },
  { id: 'p02', label: 'הבעיה', Component: Slide02 },
  { id: 'p03', label: 'מוטיבציה', Component: Slide03 },
  { id: 'p04', label: 'פתרונות קיימים', Component: Slide04 },
  { id: 'p05', label: 'הפער בפתרונות', Component: Slide05 },
  { id: 'p06', label: 'מטרות יעד', Component: Slide06 },
  { id: 'p07', label: 'טכנולוגיות', Component: Slide07 },
  { id: 'p08', label: 'שכבת ה-Data', Component: Slide08 },
  { id: 'x09', label: 'Data Flow', Component: DataFlowExplainer },
  { id: 'p10', label: 'Server/API', Component: Slide10 },
  { id: 'x11', label: 'Server Flow', Component: ServerFlowExplainer },
  { id: 'p12', label: 'AI Services', Component: Slide12 },
  { id: 'p13', label: 'Client/SPA', Component: Slide13 },
  { id: 'x14', label: 'Client Flow', Component: ClientFlowExplainer },
  { id: 'p15', label: 'פיצ׳רים — תפעול קנייה', Component: Slide15 },
  { id: 'p16', label: 'פיצ׳רים — AI', Component: Slide16 },
  { id: 'p17', label: 'אתגרים', Component: Slide17 },
  { id: 'p18', label: 'שיפורים פוטנציאלים', Component: Slide18 },
  { id: 'p19', label: 'מסקנות והשפעה', Component: Slide19 },
  { id: 'p20', label: 'תודה', Component: Slide20 },
]
