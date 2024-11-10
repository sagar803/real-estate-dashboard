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
import { Settings, Image as ImageIcon, Video } from 'lucide-react'
import LoadingSkeleton from '@/components/skeleton'

interface MediaItem {
  url: string;
  // Add other media properties as needed
}

interface ChatbotMedia {
  images: MediaItem[];
  videos: MediaItem[];
}

interface ChatbotConfiguration {
  route: string;
  chatbot_instruction: string;
  app_name: string;
  bg_color: string;
}

interface Chatbot {
  id: string;
  configuration: ChatbotConfiguration;
  active: boolean;
  media?: ChatbotMedia;
}

export default function ChatbotsPage() {
  const { user } = useUser()
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchChatbots()
  }, [user])

  console.log(chatbots)
  
  const fetchChatbots = async () => {
    if (!user) return

    try {
      // First fetch chatbots
      const { data: data, error: chatbotsError } = await supabase
        .from('chatbot')
        .select('*')
        .eq('user_id', user.id)

      if (chatbotsError) throw chatbotsError

      // Then fetch properties for each chatbot
      const chatbotData = await Promise.all(
        data.map(async (chatbot) => {
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('images, videos')
            .eq('route', chatbot.configuration.route)

          if (propertiesError && propertiesError.code !== 'PGRST116') {
            console.error(`Error fetching properties for chatbot ${chatbot.id}:`, propertiesError)
          }
          const images = propertiesData ? propertiesData.flatMap(p => p.images) : [];
          const videos = propertiesData ? propertiesData.flatMap(p => p.videos) : [];
          return {
            ...chatbot,
            media: { images, videos }
          }
        })
      )

      if(chatbotData.length === 0) {
        toast.info('You have not created any chatbot yet.')
      }
      
      setChatbots(chatbotData)
    } catch (error) {
      console.error('Error fetching chatbots:', error)
      toast.error('Failed to fetch chatbots')
    } finally {
      setIsLoading(false)
    }
  }

  const updateChatbotConfig = async (id: string, newConfig: ChatbotConfiguration) => {
    try {
      const { error } = await supabase
        .from('chatbot')
        .update({ 
          configuration: newConfig,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Chatbot configuration updated successfully')
      setIsDialogOpen(false)
      
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
    const app_name = formData.get('app_name') as string
    const bg_color = formData.get('bg_color') as string

    updateChatbotConfig(selectedChatbot.id, { 
      route, 
      chatbot_instruction, 
      app_name, 
      bg_color 
    })
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
            <Card 
              key={chatbot.id} 
              className="relative"
              style={{ borderLeft: `10px solid ${chatbot.configuration.bg_color}` }}

            >
              <CardHeader>
                <CardTitle>{chatbot.configuration.app_name}</CardTitle>
                <CardDescription>
                  Route: {chatbot.configuration.route}
                  <br />
                  Status: {chatbot.active ? 'Active' : 'Inactive'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="truncate mb-4">
                  Instruction: {chatbot.configuration.chatbot_instruction}
                </p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>{chatbot.media?.images?.length || 0} images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>{chatbot.media?.videos?.length || 0} videos</span>
                  </div>
                </div>
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
          ))
        ) : (
          <p className="text-muted-foreground">No chatbots found</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chatbot Configuration</DialogTitle>
          </DialogHeader>
          {selectedChatbot && (
            <form onSubmit={handleConfigUpdate} className="space-y-4">
              <div>
                <Label htmlFor="app_name">App Name</Label>
                <Input
                  id="app_name"
                  name="app_name"
                  defaultValue={selectedChatbot.configuration.app_name}
                  placeholder="Enter app name"
                />
              </div>
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
                <Label htmlFor="bg_color">Background Color</Label>
                <Input
                  id="bg_color"
                  name="bg_color"
                  type="color"
                  defaultValue={selectedChatbot.configuration.bg_color}
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
              {selectedChatbot.media && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Media Assets:</p>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {selectedChatbot.media.images?.length || 0} images
                    </span>
                    <span className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {selectedChatbot.media.videos?.length || 0} videos
                    </span>
                  </div>
                </div>
              )}
              <Button type="submit">Update Configuration</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}