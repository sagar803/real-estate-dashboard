// app/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from '@/lib/userContext'
import Spinner from '@/components/Spinner'
import { toast } from 'sonner'

interface Settings {
  route: string;
  chatbot_instruction: string;
}

export default function SettingsPage() {
  const { builder } = useUser()
  const [settings, setSettings] = useState<Settings>({
    route: '',
    chatbot_instruction: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/settings?builderId=${builder?.id}`)
        if (response.ok) {
          const data: Settings = await response.json()
          setSettings(data)
        } else {
          console.error('Failed to fetch settings')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
      setIsLoading(false)
    }

    if (builder?.id) {
      fetchSettings()
    }
  }, [builder?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          builderId: builder?.id,
          settings,
        }),
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Chatbot Settings</CardTitle>
          <CardDescription>Customize your chatbot experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Input
                id="route"
                name="route"
                value={settings.route}
                onChange={handleInputChange}
                placeholder="Enter route"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatbot-instructions">Chatbot Instructions</Label>
              <Textarea
                id="chatbot-instructions"
                name="chatbot_instruction"
                value={settings.chatbot_instruction}
                onChange={handleInputChange}
                placeholder="Enter chatbot instructions"
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
