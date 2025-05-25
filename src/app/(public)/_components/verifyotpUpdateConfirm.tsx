import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function VerifyotpUpdateConfirmForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	return (
		<form className={cn("flex flex-col gap-8 mb-10", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Enter New Password</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Choose your new password for your account
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<div className="flex items-center">
						<Label htmlFor="password">Password</Label>
					</div>
					<Input id="password" type="password" required />
				</div>
                <div className="grid gap-2">
					<div className="flex items-center">
						<Label htmlFor="password">Confirm Password</Label>
					</div>
					<Input id="password" type="password" required />
				</div>
				<Button type="submit" className="w-full">
					Confirm
				</Button>
			</div>
			
		</form>
	);
}
