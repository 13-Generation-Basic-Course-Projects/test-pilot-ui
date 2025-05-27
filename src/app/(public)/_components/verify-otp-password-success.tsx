"use client";
import Link from "next/link"; // ✅ Correct import for routing
import Image from "next/image"; // ✅ Use next/image instead of lucide-react
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function VerifyOtpPasswordSuccessForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col items-center gap-6 mb-10", className)} {...props}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#34302B]">
          Congrats You Have Been Reset Your Password
        </h1>
      </div>

      {/* Success Image */}
      <div>
        <Image
          src="/verify-success.png"
          alt="Password reset success"
          width={100}
          height={100}
          className="rounded-3xl"
        />
      </div>
    <p className="text-[#94A3B8] text-center">Your password has been successfully reset.</p>
      {/* Button */}
      <Button type="submit" className="w-full max-w-xs">
        <Link href="/login">Login</Link>
      </Button>
    </form>
  );
}
