import { Plus } from 'lucide-react'
import logo from '../assets/logo.svg'
import lets_start from '../assets/illustration_lets-start.svg'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { CreateGoal } from './create-goal'

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="in.orbit" />
      <img src={lets_start} alt="Let's start" />
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Cadastrar meta
        </Button>
      </DialogTrigger>
      <CreateGoal />
    </div>
  )
}
