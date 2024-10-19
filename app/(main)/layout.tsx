'use client'

import React, { useState, useEffect } from "react"
import { BarChart, Home, Settings, Upload, LogOut, Menu, X, Bell, Search, MessageSquare, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/Spinner"
import { UserProvider, useUser } from "@/lib/userContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

type DashboardLinkProps = {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  sidebarOpen: boolean;
  isActive: boolean;
};

const DashboardLink: React.FC<DashboardLinkProps> = ({ href, icon: Icon, children, sidebarOpen, isActive }) => (
  <Link href={href} className={`flex items-center ${!sidebarOpen ? "justify-center px-3" : "px-4"} py-3 rounded-md transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : ''}`}>
    <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
    {sidebarOpen && (
      <>
        <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>{children}</span>
        {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
      </>
    )}
  </Link>
);

const LayoutContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { isLoading, isAuthenticated, signOut, user } = useUser();
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState<string>("Dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const title = pathname.split('/')[1];
    setPageTitle(title.charAt(0).toUpperCase() + title.slice(1) || "Dashboard");
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} border-r dark:border-gray-500 h-full flex flex-col justify-between transition-all duration-300 ease-in-out`}>
        <div>
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                  ChatBot&nbsp;SaaS
                </h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="p-0 h-8 w-8 rounded-full"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="mt-8 space-y-2 px-2">
            <DashboardLink href="/dashboard" icon={Home} sidebarOpen={sidebarOpen} isActive={pathname === '/dashboard'}>
              Dashboard
            </DashboardLink>
            <DashboardLink href="/chatbots" icon={MessageSquare} sidebarOpen={sidebarOpen} isActive={pathname === '/chatbots'}>
              Chatbots
            </DashboardLink>
            <DashboardLink href="/upload" icon={Upload} sidebarOpen={sidebarOpen} isActive={pathname === '/upload'}>
              Upload Data
            </DashboardLink>
            <DashboardLink href="/analytics" icon={BarChart} sidebarOpen={sidebarOpen} isActive={pathname === '/analytics'}>
              Analytics
            </DashboardLink>
            <DashboardLink href="/settings" icon={Settings} sidebarOpen={sidebarOpen} isActive={pathname === '/settings'}>
              Settings
            </DashboardLink>
          </nav>
        </div>
        <div className="p-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarImage src={user?.picture} alt={user?.full_name} />
                <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <Avatar>
                <AvatarImage src={user?.picture} alt={user?.full_name} />
                <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <Button
            variant="outline"
            className={`w-full justify-center ${sidebarOpen ? 'px-4' : 'px-0'}`}
            onClick={signOut}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b dark:border-gray-500 py-4 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{pageTitle}</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  )
}