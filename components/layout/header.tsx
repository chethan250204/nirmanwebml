"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Building2, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { User as UserType } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  user: UserType
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const { toast } = useToast()

  const displayName =
    user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.email

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.firstName
        ? user.firstName[0]
        : user.email[0]

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Nirman 2.0</span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{user.role} Dashboard</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">{displayName}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
