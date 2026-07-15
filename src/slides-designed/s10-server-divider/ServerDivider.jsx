import SectionDivider from '../../components/SectionDivider/SectionDivider.jsx'
import './styles.css'

export default function ServerDivider() {
  return (
    <SectionDivider
      number="02"
      title="SERVER / API"
      icon="server"
      subtitle="שכבת השרת: קבלת בקשות, לוגיקה עסקית וחשיפת נקודות קצה"
      chips={['Node.js', 'Express', 'REST API']}
    />
  )
}
