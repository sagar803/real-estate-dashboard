//@ts-nocheck
'use client'

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Image, Video, FileUp } from "lucide-react"
import { useUser } from "@/lib/userContext"
import { toast } from "sonner"

export default function Component() {
  const { builder } = useUser()
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [videoFiles, setVideoFiles] = useState<FileList | null>(null)
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null)
  const [systemInstruction, setSystemInstruction] = useState("")
  const [routeName, setRouteName] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (csvFile && systemInstruction && routeName) {
      try {
        const result = await uploadData(csvFile)
        toast.success("Chatbot successfully created")
        console.log('Upload result:', result)
      } catch (error) {
        toast.error("Failed to create chatbot")
        console.error('Upload failed:', error)
      }
    }
    // console.log('Image Files:', imageFiles)
    // console.log('Video Files:', videoFiles)
    // console.log('PDF Files:', pdfFiles)
    // console.log('System Instruction:', systemInstruction)
    // console.log('Route Name:', routeName)
  }

  async function uploadData(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('builderId', builder.id);
    formData.append('systemInstruction', systemInstruction);
    formData.append('routeName', routeName);
  
    const response = await fetch('/api/upload/data', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) throw new Error('Upload failed');  
    return response.json();
  }

  const FileUploadSection = ({ id, label, accept, icon: Icon, files, setFiles, multiple = false }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (multiple) {
              setFiles(e.target.files);
            } else {
              setFiles(e.target.files ? e.target.files[0] : null);
            }
          }}
          className="hidden"
        />
        <Label
          htmlFor={id}
          className="flex-1 py-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors duration-200 flex flex-col items-center justify-center text-muted-foreground"
        >
          <FileUp className="w-8 h-8 mb-2" />
          <span>Click to upload or drag and drop</span>
          <span className="text-xs">
            {files 
              ? (multiple ? `${files.length} file(s) selected` : '1 file selected') 
              : 'No file selected'}
          </span>
        </Label>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Data</CardTitle>
          <CardDescription>Upload your files and provide instructions to train your chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="files" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="files">File Upload</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>
              <hr className="mt-4"/>
              <TabsContent value="files" className="mt-10 grid md:grid-cols-2 gap-4">
                <FileUploadSection
                  id="csv-upload"
                  label="CSV Files"
                  accept=".csv"
                  icon={FileText}
                  files={csvFile}
                  setFiles={setCsvFile}
                />
                <FileUploadSection
                  id="image-upload"
                  label="Images"
                  accept="image/*"
                  icon={Image}
                  files={imageFiles}
                  setFiles={setImageFiles}
                  multiple={true}
                />
                <FileUploadSection
                  id="video-upload"
                  label="Videos"
                  accept="video/*"
                  icon={Video}
                  files={videoFiles}
                  setFiles={setVideoFiles}
                  multiple={true}
                />
                <FileUploadSection
                  id="pdf-upload"
                  label="PDF Files"
                  accept=".pdf"
                  icon={FileUp}
                  files={pdfFiles}
                  setFiles={setPdfFiles}
                  multiple={true}
                />
              </TabsContent>
              <TabsContent value="instructions" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="system-instruction">System Instruction</Label>
                  <Textarea
                    id="system-instruction"
                    placeholder="Enter system instructions here..."
                    className="min-h-[150px]"
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
            </Tabs>
            <Button 
              type="submit" 
              className="select-none w-full"
              disabled={!(systemInstruction && routeName && csvFile)}
            >
              <Upload className="w-4 h-4 mr-2" />
                Generate Chatbot
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}