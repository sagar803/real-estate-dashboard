//@ts-nocheck
'use client'

import { useState, useRef } from 'react'
import { Plus, X, File, Image, Video, FileUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabaseClient'


export default function FileUpload({files, setFiles}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    const newFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      description: '',
      propertyIndex: ''
    }))
    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleDescriptionChange = (index: number, value: string) => {
    setFiles(prevFiles => 
      prevFiles.map((file, i) => 
        i === index ? { ...file, description: value } : file
      )
    )
  }

  const handlePropertyIndexChange = (index: number, value: string) => {
    setFiles(prevFiles => 
      prevFiles.map((file, i) => 
        i === index ? { ...file, propertyIndex: value } : file
      )
    )
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-6 w-6 text-blue-500" />
    if (type.startsWith('video/')) return <Video className="h-6 w-6 text-green-500" />
    return <File className="h-6 w-6 text-gray-500" />
  }

  return (
    <div className="container mx-auto p-4">
        <div className="flex items-center my-4">
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf"
                multiple
                className="hidden"
            />
            <Label 
                className={` flex-1 py-8 border-2 border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center text-muted-foreground border-blue-600 bg-blue-500"`}
                onClick={() => fileInputRef.current?.click()}
            >
                <FileUp className="w-8 h-8 mb-2" />
                <span>Click to select</span>
                <span className="text-xs">
                    {files 
                    ? `${files.length} file(s) selected`
                    : 'No file selected'}
                </span>
            </Label>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {files.map((file, index) => (
            <div
                key={index}
                className="rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row"
            >
                <div className="relative sm:w-1/3">
                    {file.file.type.startsWith('image/') && (
                        <img src={file.preview} alt="Preview" className="w-full h-48 sm:h-full object-cover" />
                    )}
                    {file.file.type.startsWith('video/') && (
                        <video src={file.preview} className="w-full h-48 sm:h-full object-cover" controls />
                    )}
                    {file.file.type === 'application/pdf' && (
                        <div className="w-full h-48 sm:h-full flex items-center justify-center"><File className="h-16 w-16 text-gray-400" /></div>
                    )}
                </div>
                <div className="p-4 sm:w-2/3 relative">
                    <div
                        className="absolute top-2 right-2 rounded-full cursor-pointer"
                        onClick={() => handleRemoveFile(index)}
                    >
                        <X className="h-4 w-4" />
                    </div>
                    <div className="flex items-center mb-4">
                        {getFileIcon(file.file.type)}
                        <span className="ml-2 text-sm font-medium text-gray-600 truncate">{file.file.name}</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor={`description-${index}`} className="text-sm font-medium text-gray-700">Description</Label>
                            <Input
                                id={`description-${index}`}
                                value={file.description}
                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                placeholder="Enter description"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`propertyIndex-${index}`} className="text-sm font-medium text-gray-700">Property Index</Label>
                            <Input
                                type='number'
                                id={`propertyIndex-${index}`}
                                value={file.propertyIndex}
                                onChange={(e) => handlePropertyIndexChange(index, e.target.value)}
                                placeholder="Enter property index"
                                className="mt-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}
