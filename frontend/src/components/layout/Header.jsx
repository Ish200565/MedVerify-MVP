import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">

      <h2 className="text-lg font-semibold">
        NGO Dashboard
      </h2>

      <Avatar>
        <AvatarFallback>NGO</AvatarFallback>
      </Avatar>

    </header>
  )
}