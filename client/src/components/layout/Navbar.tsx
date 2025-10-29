'use client'

import * as Popover from '@radix-ui/react-popover'
import { LuChevronDown } from "react-icons/lu"
import { useEffect, useState } from "react"
import { RxExit } from "react-icons/rx"
import { useAuth } from "@/stores/auth"
import { Subtitle } from "@/components/ui/Subtitle"
import { User } from "lucide-react"
import { Title } from "@/components/ui/Title"
import { MobileMenuButton } from './Sidebar'
import { ToggleDarkModeButton } from './DarkModeToggle'
import { useLogout } from '@/services/auth.service'

export function Navbar() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex items-center bg-background border-b border-border w-full justify-between h-16 py-2 px-4 shadow-elegant">
      <div className="flex items-center gap-4">
        <MobileMenuButton />
      </div>

      <div className="flex items-center gap-4">
        <ToggleDarkModeButton />

        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              
              <div className="hidden md:flex flex-col text-left">
                <Title size="xs" className="text-foreground">
                  {user?.name || 'Usuário'}
                </Title>
                <Subtitle size="xs" className="text-muted-foreground">
                  {user?.email || 'user@email.com'}
                </Subtitle>
              </div>
              
              <LuChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </Popover.Trigger>
          
          <Popover.Portal>
            <Popover.Content 
              className="flex flex-col bg-background shadow-lg border border-border rounded-lg w-[270px] mt-2 p-2 gap-1 animate-fade-in z-50" 
              sideOffset={5} 
              side='bottom' 
              align='end'
            >
              <div className="md:hidden p-3 border-b border-border">
                <Title size="sm" className="text-foreground">
                  {user?.name || 'Usuário'}
                </Title>
                <Subtitle size="xs" className="text-muted-foreground">
                  {user?.email || 'user@email.com'}
                </Subtitle>
              </div>
              
              <button
                className='flex items-center gap-3 transition-colors duration-300 py-3 px-3 hover:bg-destructive/10 hover:text-destructive rounded-lg'
                onClick={() => logout()}
                disabled={isPending}
              >
                <RxExit className='w-5 h-5' />
                <span className="text-sm">
                  {isPending ? 'Saindo...' : 'Sair'}
                </span>
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}