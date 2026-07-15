import SectionDivider from '../../components/SectionDivider/SectionDivider.jsx'
import './styles.css'

export default function DataDivider() {
  return (
    <SectionDivider
      number="01"
      title="DATA"
      icon="database"
      subtitle="איך המידע על מוצרים ומחירים נאסף, נשמר ומוזרם למערכת"
      chips={['MongoDB', 'Mongoose', 'NoSQL']}
    />
  )
}
