import Deck from './components/Deck/Deck.jsx'
import Preloader from './components/Preloader/Preloader.jsx'
import { SLIDES } from './slides/index.jsx'

export default function App() {
  /* המצגת נטענת מתחת למסך הטעינה — כשהוא נעלם הכול כבר מפוענח */
  return (
    <>
      <Deck slides={SLIDES} />
      <Preloader />
    </>
  )
}
