"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	return (
		<form className={cn("flex flex-col gap-8 mb-10", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Forgot Password</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Enter your email to reset your reset account
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email Address</Label>
					<Input id="email" type="email" placeholder="testpilot@gmail.com" required />
				</div>
				<Button type="submit" className="w-full">
					Send
				</Button>
			</div>
			<div className="text-center text-sm">
				Remember your password{" "}
				<a href="#" className="underline underline-offset-4">
					Login
				</a>
			</div>
		</form>
	);
}
