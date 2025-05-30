"use client"

import React, { useRef, useState } from "react"
import { UploadCloud, File as FileIcon, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type ImportDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ImportCollection({ open, onOpenChange }: ImportDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            setFile(droppedFile)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleUpload = () => {
        if (!file) return
        // Replace this with actual upload logic (e.g., fetch/FormData)
        alert(`Uploading: ${file.name}`)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-2xl p-0 overflow-hidden rounded-lg"
                onInteractOutside={(e) => e.preventDefault()}
            >
                {/* Header */}
                <div className="pl-4 pr-4 pt-4 flex items-center justify-between">
                    <DialogHeader>
                        <DialogTitle>Import Collection</DialogTitle>
                    </DialogHeader>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                    >
                    </Button>
                </div>

                {/* Content */}
                <div className="pl-4 pr-4 pb-4 space-y-4">
                    <Input
                        placeholder="Paste cURL, Raw text or URL..."
                        className="w-full px-4 py-2 text-sm rounded"
                    />

                    {/* Drop Zone */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-center transition hover:bg-muted/20"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="flex gap-4">
                            <UploadCloud strokeWidth={1} className="w-15 h-15 text-muted-foreground mb-3" />
                            <div>
                                <p className="text-base font-medium text-muted-foreground">
                                    Drop anywhere to import
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    or select{" "}
                                    <button
                                        className="text-blue-500 hover:underline focus:outline-none cursor-pointer"
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        file
                                    </button>{" "}
                                    or{" "}
                                    <button
                                        className="text-blue-500 hover:underline focus:outline-none cursor-pointer"
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        folders
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept=".csv,.xls,.xlsx,.pdf,.txt"
                            ref={inputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* File Info + Upload Button */}
                    {file && (
                        <div className="flex items-center justify-between mt-4 px-2">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <FileIcon className="w-4 h-4" />
                                <span>{file.name}</span>
                            </div>
                            <Button size="sm" onClick={handleUpload}>
                                Upload File
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
