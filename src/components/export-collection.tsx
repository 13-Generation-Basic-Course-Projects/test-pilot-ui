"use client"

import React, { useState } from "react"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type ExportProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ExportCollection({ open, onOpenChange }: ExportProps) {
    const [layout, setLayout] = useState("comfortable")

    const handleContinue = () => {
        alert(`You selected: ${layout}`)
        onOpenChange(false) 
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Export Collection</AlertDialogTitle>
                    <AlertDialogDescription>
                        New request will be exported as JSON file.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <RadioGroup
                    value={layout}
                    onValueChange={setLayout}
                    className="space-y-2 py-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="r2" />
                        <Label htmlFor="r1">Collection v2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comfortable" id="r1" />
                        <Label htmlFor="r2">Collection v2.1</Label>
                    </div>
                </RadioGroup>

                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <Button onClick={handleContinue} className="cursor-pointer">Export</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
