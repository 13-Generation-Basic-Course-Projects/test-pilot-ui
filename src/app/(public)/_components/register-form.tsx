"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GithubIcon from "@/components/icons/github";
import GoogleIcon from "@/components/icons/google";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={cn("flex flex-col gap-8 mb-10", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold ">Create an account</h1>
        <p className="text-balance text-sm text-[#94A3B8]">
          Enter your credentials below to create an account
        </p>
      </div>

      <div className="flex justify-between items-center gap-8">
        <Button
          variant="outline"
          className="flex items-center justify-center w-full flex-1 cursor-pointer"
        >
          <GithubIcon />
          GitHub
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center w-full flex-1 cursor-pointer"
        >
          <GoogleIcon />
          Google
        </Button>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-6 text-muted-foreground uppercase">
          Or continue with
        </span>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-[#34302B]">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="channarith"
            required
            className="text-[#94A3B8]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-[#34302B]">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="channarith@gmail.com"
            required
            className="text-[#94A3B8]"
          />
        </div>

        <div className="grid gap-2 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[30px] text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>

      <div className="text-center text-sm text-[#94A3B8]">
        Already have an account ?{" "}
        <Link href="/login" className="text-[#0973DC]">
          Login
        </Link>
      </div>
    </form>
  );
}
