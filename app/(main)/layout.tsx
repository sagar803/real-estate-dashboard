'use client'

import React, { useState } from "react"
import { BarChart, Home, Settings, Upload, LogOutIcon, Menu, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import Spinner from "@/components/Spinner"
import { UserProvider, useUser } from "@/lib/userContext"

type DashboardLinkProps = {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  sidebarOpen: boolean;
};

const DashboardLink: React.FC<DashboardLinkProps> = ({ href, icon: Icon, children, sidebarOpen }) => (
  <Link href={href} className={`flex items-center ${!sidebarOpen && "justify-center"} px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200`}>
    <Icon className="h-4 w-4" />
    {sidebarOpen && <span className="ml-3">{children}</span>}
  </Link>
);

const LayoutContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { isLoading, isAuthenticated, signOut } = useUser();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col justify-between transition-all duration-300 ease-in-out`}>
        <div>
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ChatBot SaaS</h1>}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="p-0 h-8 w-8"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="mt-4 space-y-1">
            <DashboardLink href="/dashboard" icon={Home} sidebarOpen={sidebarOpen}>
              Dashboard
            </DashboardLink>
            <DashboardLink href="/upload" icon={Upload} sidebarOpen={sidebarOpen}>
              Upload Data
            </DashboardLink>
            <DashboardLink href="/analytics" icon={BarChart} sidebarOpen={sidebarOpen}>
              Analytics
            </DashboardLink>
            <DashboardLink href="/settings" icon={Settings} sidebarOpen={sidebarOpen}>
              Settings
            </DashboardLink>
          </nav>
        </div>
        <Button
          className={`m-4 border border-black ${sidebarOpen ? '' : 'p-0 w-8 h-8'}`}
          onClick={signOut}
        >
          {sidebarOpen ? 'Logout' : <LogOutIcon size={18} strokeWidth={1}/>}
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
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