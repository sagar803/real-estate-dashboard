//@ts-nocheck
"use client"

import React, { useState, FormEvent, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, ExternalLink, FileUp } from "lucide-react"
import { useUser } from "@/lib/userContext"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { supabase } from "@/lib/supabaseClient"
import { v4 as uuidv4 } from 'uuid'
import FileUpload from "@/components/fileUpload"
import CsvUpload from "@/components/csvUpload"

const ColorPickerWithOpacity = React.memo(({ rgba, setRgba }) => {
  const [color, setColor] = useState(() => rgbaToHex(rgba))
  const [opacity, setOpacity] = useState(() => Math.round(rgba.a * 100))

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    const [r, g, b] = hexToRgb(newColor)
    setRgba({ r, g, b, a: rgba.a })
  }

  const handleOpacityChange = useCallback((value: number[]) => {
    const newOpacity = value[0] / 100
    setOpacity(value[0])
    setRgba(prev => ({ ...prev, a: newOpacity }))
  }, [setRgba])

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-12 h-12 rounded cursor-pointer"
        />
        <span className="font-semibold">{color}</span>
      </div>
      <div
        className="w-full h-24 rounded"
        style={{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }}
      ></div>
      <p className="font-mono">
        RGBA: rgba({rgba.r}, {rgba.g}, {rgba.b}, {rgba.a.toFixed(2)})
      </p>
      <div className="space-y-2">
        <Label htmlFor="opacity">Opacity: {opacity}%</Label>
        <Slider
          id="opacity"
          min={0}
          max={100}
          step={1}
          value={[opacity]}
          onValueChange={handleOpacityChange}
        />
      </div>
    </div>
  )
})

ColorPickerWithOpacity.displayName = 'ColorPickerWithOpacity'

function rgbaToHex({ r, g, b }: { r: number, g: number, b: number }): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0]
}

type FileItem = {
  file: File
  preview: string
  description: string
  propertyIndex: number
}

type UploadedFile = {
  url: string
  description: string
  propertyIndex: number
  fileType: string
}

export default function Component() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [systemInstruction, setSystemInstruction] = useState("")
  const [routeName, setRouteName] = useState("")
  const [appName, setAppName] = useState('')
  const [rgba, setRgba] = useState({ r: 255, g: 209, b: 209, a: 1 })
  const [chatbotUrl, setChatbotUrl] = useState('')

  const uploadFiles = async () => {
    const uploadedFiles: UploadedFile[] = []

    for (const fileItem of files) {
      const { file, description, propertyIndex } = fileItem

      const bucket = file.type.startsWith('image/') ? 'images' : 
                     file.type.startsWith('video/') ? 'videos' : 
                     'documents'

      const uniqueId = uuidv4()
      const filePath = `${uniqueId}_${file.name}`

      const { error } = await supabase.storage.from(bucket).upload(filePath, file)

      if (error) {
        console.error(`Error uploading ${file.name}:`, error)
        toast.error(`Error uploading ${file.name}`)
        continue
      }

      const publicUrl = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl

      uploadedFiles.push({
        url: publicUrl,
        description,
        propertyIndex,
        fileType: bucket
      })
    }

    return uploadedFiles
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!csvFile || !systemInstruction || !routeName || !appName) {
      toast.error("Please provide all required inputs")
      return
    }

    setIsLoading(true)
    try {
      const { data: existingRoute, error: routeError } = await supabase
        .from('chatbot')
        .select('configuration')
        .filter('configuration->>route', 'eq', routeName.toLowerCase())

      if (existingRoute?.length > 0) {
        toast.error("Route already exists. Please choose a unique route name.")
        return
      }

      const uploadedFiles = await uploadFiles()

      const result = await uploadData(csvFile, uploadedFiles)
      setChatbotUrl("https://saaaas.vercel.app/"+result.route)
      toast(<div><p className="font-bold">{"Chatbot successfully created"}</p><a href={"https://saaaas.vercel.app/"+result.route} className="flex gap-1 items-center" target="_blank" rel="noopener noreferrer">{"https://saaaas.vercel.app/"+result.route}<ExternalLink strokeWidth={1} size={20}/></a></div> , {duration: 8000})
      console.log('Upload result:', result)
    } catch (error) {
      toast.error("Failed to create chatbot")
      console.error('Upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadData = useCallback(async (file: File, uploadedFiles: UploadedFile[]) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user?.id || '')
    formData.append('systemInstruction', systemInstruction)
    formData.append('routeName', routeName.toLowerCase())
    formData.append('appName', appName)
    formData.append('uploadedFiles', JSON.stringify(uploadedFiles))
    formData.append('bgColor', `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`)

    const response = await fetch('/api/upload/data', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')

    return response.json()
  }, [user?.id, systemInstruction, routeName, appName, rgba])

  const isSubmitDisabled = !(systemInstruction && routeName && csvFile && appName && !isLoading)

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload Data</CardTitle>
          <CardDescription>Upload your files and provide instructions to train your chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="files">File Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="appearance" className="mt-4 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">App Name</Label>
                  <Input 
                    id="app-name" 
                    placeholder="Enter app name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <ColorPickerWithOpacity rgba={rgba} setRgba={setRgba} />
              </TabsContent>
              <TabsContent value="instructions" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="system-instruction">System Instruction</Label>
                  <Textarea
                    id="system-instruction"
                    placeholder="Enter system instructions here..."
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route-name">Route Name</Label>
                  <Input 
                    id="route-name" 
                    placeholder="Enter route name"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="csv" className="mt-4 space-y-6">
                <CsvUpload csvFile={csvFile} setCsvFile={setCsvFile} />
              </TabsContent>
              <TabsContent value="files" className="mt-4">
                <FileUpload files={files} setFiles={setFiles} />
              </TabsContent>
            </Tabs>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitDisabled}
            > 
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {'Processing...'}
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {"Generate Chatbot"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
