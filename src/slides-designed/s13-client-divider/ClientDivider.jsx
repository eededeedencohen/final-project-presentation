import SectionDivider from '../../components/SectionDivider/SectionDivider.jsx'
import './styles.css'

export default function ClientDivider() {
  return (
    <SectionDivider
      number="03"
      title="CLIENT SPA"
      icon="layout"
      subtitle="אפליקציית צד-לקוח חד-עמודית: רכיבים, ניהול מצב וחוויית משתמש"
      chips={['React', 'Context', 'Hooks']}
    />
  )
}
