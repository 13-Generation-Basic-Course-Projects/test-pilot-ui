"use client";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  Form,
} from "@/components/ui/form";

import Image from "next/image"; // Make sure to import the Next.js Image component

// Define form schema with zod
const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  pin: z.string().length(6, {
    message: "Your one-time password must be exactly 6 characters.",
  }),
});

export function VerifyOtpConfirmSuccessForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("OTP Verify Data:", data);
    // TODO: handle OTP verification (e.g., call API)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-8 mb-10", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Congrats! You have reset your password</h1>
        </div>

        {/* Image for verification success */}
        <div className="flex justify-center">
          <Image
            src="/verify-success.png"
            alt="Verification Successful"
            width={150}
            height={150}
            className="rounded-lg object-fit-contain"
          />
        </div>
        <p className="text-[#94A3B8] text-center">Your password has been successfully reset.</p>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Login
        </Button>

        {/* Resend OTP or other additional content */}
        <div className="text-center text-sm">
          <div className="flex justify-between">
            <div />
          </div>
        </div>
      </form>
    </Form>
  );
}