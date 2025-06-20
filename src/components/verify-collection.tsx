"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import { verifyShareToken } from "@/service/collection-service";
export default function VerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!token) {
      alert("No token found in URL.");
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("token") || "";
      const result = await verifyShareToken(token);
      console.log("Verify Result:", result);
      if (result.success) {
        const collectionId = result.payload?.[0]?.collectionId;
        if (collectionId) {
          router.push(`/project/${collectionId}`);
        } else {
          setCollectionData([]);
          setIsVerified(true);
        }
      } else {
        setError("Verification failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      console.error("Verification error:", err);
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
        <Card className="w-full max-w-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Token Verified!
            </CardTitle>
            <CardDescription>
              The shared collection was verified successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {collectionData.length > 0 ? (
              <ul className="list-disc pl-5">
                {collectionData.map((item) => (
                  <li key={item.id} className="mb-1">
                    <strong>{item.name}</strong> (ID: {item.id}, Collection ID:{" "}
                    {item.collectionId})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No collection data found in the shared token.</p>
            )}
            <Button className="w-full mt-4" onClick={handleContinue}>
              Continue
            </Button>
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
          <CardTitle className="text-2xl">Verify Shared Collection</CardTitle>
          <CardDescription>
            Click the button below to verify and view the shared collection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full h-12 text-lg"
          >
            {isVerifying ? "Verifying..." : "Verify Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
