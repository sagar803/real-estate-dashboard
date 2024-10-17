'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from '@/lib/userContext'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings } from 'lucide-react'
import LoadingSkeleton from '@/components/skeleton'

interface Chatbot {
  id: string;
  route: string;
  configuration: {
    route: string;
    chatbot_instruction: string;
  };
  active: boolean;
}

export default function ChatbotsPage() {
  const { builder } = useUser()
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchChatbots()
  }, [])
  
  const fetchChatbots = async () => {
    console.log(builder)
    if (!builder) return

    try {
      const { data, error } = await supabase
        .from('chatbot')
        .select('*')
        .eq('user_id', builder.id)

      if (error) throw error
      if(data.length === 0) toast.info('You have not created any chatbot yet.')
      setChatbots(data)
    } catch (error) {
      console.error('Error fetching chatbots:', error)
      toast.error('Failed to fetch chatbots')
    } finally {
      setIsLoading(false)
    }
  }

  const updateChatbotConfig = async (id: string, newConfig: Chatbot['configuration']) => {
    try {
      const { error } = await supabase
        .from('chatbot')
        .update({ 
          configuration: newConfig,
          route: newConfig.route
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Chatbot configuration updated successfully')
      setIsDialogOpen(false)
      
      // Fetch the updated data
      await fetchChatbots()
    } catch (error) {
      console.error('Error updating chatbot:', error)
      toast.error('Failed to update chatbot configuration')
    }
  }

  const handleConfigUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedChatbot) return

    const formData = new FormData(e.currentTarget)
    const route = formData.get('route') as string
    const chatbot_instruction = formData.get('chatbot_instruction') as string

    updateChatbotConfig(selectedChatbot.id, { route, chatbot_instruction })
  }

  const openDialog = (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot)
    setIsDialogOpen(true)
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chatbots.length > 0 ? (
          chatbots.map((chatbot) => (
            <Card key={chatbot.id} className="relative">
              <CardHeader>
                <CardTitle>{chatbot.route}</CardTitle>
                <CardDescription>
                  Status: {chatbot.active ? 'Active' : 'Inactive'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="truncate">
                  Instruction: {chatbot.configuration.chatbot_instruction}
                </p>
              </CardContent>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => openDialog(chatbot)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Card>
          ))) : (
            <p className="text-gray-600">No chatbots found</p>
          )
        }
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chatbot Configuration</DialogTitle>
          </DialogHeader>
          {selectedChatbot && (
            <form onSubmit={handleConfigUpdate} className="space-y-4">
              <div>
                <Label htmlFor="route">Route</Label>
                <Input
                  id="route"
                  name="route"
                  defaultValue={selectedChatbot.configuration.route}
                  placeholder="Enter route"
                />
              </div>
              <div>
                <Label htmlFor="chatbot_instruction">Chatbot Instruction</Label>
                <Textarea
                  id="chatbot_instruction"
                  name="chatbot_instruction"
                  defaultValue={selectedChatbot.configuration.chatbot_instruction}
                  placeholder="Enter chatbot instruction"
                  rows={4}
                />
              </div>
              <Button type="submit">Update Configuration</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}