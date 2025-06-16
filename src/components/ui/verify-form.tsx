"use client";

import { useState } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import { verifyCollaboratorToken } from "@/service/project-collaborator-service";
import {router} from "next/client";

export default function VerifyForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";


    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = async () => {
        if (!token) {
            alert("No token found in URL.");
            return;
        }

        setIsVerifying(true);
        try {
            await verifyCollaboratorToken(token);
            setIsVerified(true);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsVerifying(false);
        }
    };
    const handleContinue = () => {
        router.push("/");
    };

    if (isVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-600">Verified!</CardTitle>
                        <CardDescription>
                            Your account has been successfully verified. You can now continue using our services.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={handleContinue}>Continue</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Account</CardTitle>
                    <CardDescription>
                        Click the button below to verify your invitation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleVerify} disabled={isVerifying} className="w-full h-12 text-lg">
                        {isVerifying ? "Verifying..." : "Verify Now"}
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}
