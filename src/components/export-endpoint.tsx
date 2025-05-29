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
import { Endpoint } from "@/types"

type ExportProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	endpoint?: Endpoint | null;
};


export function ExportEndpoint({ open, onOpenChange }: ExportProps) {
    const [layout, setLayout] = useState("comfortable")

    const handleContinue = () => {
        alert(`You selected: ${layout}`)
        onOpenChange(false) // Close the dialog after exporting
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Export Request</AlertDialogTitle>
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
                        <RadioGroupItem value="default" id="r1" />
                        <Label htmlFor="r1">Collection v2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comfortable" id="r2" />
                        <Label htmlFor="r2">Collection v2.1</Label>
                    </div>
                </RadioGroup>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleContinue}>Export</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
