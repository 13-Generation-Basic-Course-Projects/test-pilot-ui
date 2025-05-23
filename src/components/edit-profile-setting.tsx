"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function EditProfile() {
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
        setOpen(false);
    };

    const handleSave = () => {
        console.log("Changes saved (simulated)");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent
                className=" p-0"
                onInteractOutside={(e) => e.preventDefault()} 
            >
                <div className="relative bg-white rounded-xl shadow p-8">
                    {/* Close Button (X) */}
                    <DialogClose asChild>
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            aria-label="Close"
                        >
                        </button>
                    </DialogClose>

                    {/* Header */}
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-xl font-semibold text-center text-gray-900">
                            Profile Details
                        </DialogTitle>
                    </DialogHeader>

                    {/* Profile Info */}
                    <div className="flex items-center pb-6 mb-8">
                        <img
                            src="/profile.png"
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover mr-5"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-900">Testing Pilot</p>
                            <p className="text-sm font-medium text-gray-500">testingpilot@gmail.com</p>
                        </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Username
                            </label>
                            <Input defaultValue="Teb Yuma" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Email
                            </label>
                            <Input type="email" defaultValue="yuma123@gmail.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Password
                            </label>
                            <Input type="password" defaultValue="********" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <DialogFooter className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
