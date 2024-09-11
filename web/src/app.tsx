import { EmptyGoals } from './components/empty-goals'
import { Summary } from './components/summary'
import { Dialog } from './components/ui/dialog'

export function App() {
  return (
    <Dialog>
      {/* <EmptyGoals /> */}
      <Summary />
    </Dialog>
  )
}
