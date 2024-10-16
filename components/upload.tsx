'use client'

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
  const [csvFiles, setCsvFiles] = useState<FileList | null>(null)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null)
  const [systemInstruction, setSystemInstruction] = useState("")
  const [routeName, setRouteName] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    console.log('CSV Files:', csvFiles)
    console.log('Image Files:', imageFiles)
    console.log('Video File:', videoFile)
    console.log('PDF Files:', pdfFiles)
    console.log('System Instruction:', systemInstruction)
    console.log('Route Name:', routeName)
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Upload Data</CardTitle>
        <CardDescription>Upload your files and provide instructions to train your chatbot</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="csv-upload">CSV Files</Label>
              <Input 
                id="csv-upload" 
                type="file" 
                accept=".csv" 
                multiple 
                onChange={(e) => setCsvFiles(e.target.files)}
              />
              {csvFiles && <p className="text-sm text-gray-500">{csvFiles.length} file(s) selected</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Images</Label>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => setImageFiles(e.target.files)}
              />
              {imageFiles && <p className="text-sm text-gray-500">{imageFiles.length} file(s) selected</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-upload">Video</Label>
              <Input 
                id="video-upload" 
                type="file" 
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              />
              {videoFile && <p className="text-sm text-gray-500">{videoFile.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf-upload">PDF</Label>
              <Input 
                id="pdf-upload" 
                type="file" 
                accept=".pdf" 
                multiple
                onChange={(e) => setPdfFiles(e.target.files)}
              />
              {pdfFiles && <p className="text-sm text-gray-500">{pdfFiles.length} file(s) selected</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-instruction">System Instruction</Label>
            <Textarea
              id="system-instruction"
              placeholder="Enter system instructions here..."
              className="min-h-[100px]"
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
          <Button type="submit" className="w-full">Upload Files and Create Route</Button>
        </form>
      </CardContent>
    </Card>
  )
}