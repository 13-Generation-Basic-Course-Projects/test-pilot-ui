import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { CollectionItem, ProjectItem } from "@/types";

type ExportProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	collection?: CollectionItem | null;
	project: ProjectItem | null;
};

export function ShareProject({ open, onOpenChange }: ExportProps) {
	const [copied, setCopied] = useState(false);

	const shareLink = "test-pilot/share/a1b2c3d4-e5f6-7890-1234-567890abcdef";

	const handleCopy = () => {
		navigator.clipboard.writeText(shareLink).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl rounded-xl">
				<DialogHeader>
					<DialogTitle>Share project</DialogTitle>
				</DialogHeader>

				<div className="rounded-md flex items-center justify-between space-x-2">
					<span className="text-sm font-medium mr-2">Link :</span>
					<span className="bg-muted px-4 rounded-md text-sm font-mono truncate flex-1 flex items-center justify-between">
						{shareLink}
						<Button
							size="icon"
							variant={copied ? "secondary" : "ghost"}
							onClick={handleCopy}
							className="ml-2 outline-0 cursor-pointer"
							aria-label="Copy share link"
						>
							{copied ? (
								<>
									<Check className="h-4 w-4 text-green-500" />
									<span className="sr-only">Copied</span>
								</>
							) : (
								<>
									<Copy className="h-4 w-4" />
									<span className="sr-only">Copy</span>
								</>
							)}
						</Button>
					</span>
					<DialogClose asChild>
						<Button type="button" className="cursor-pointer">
							Share
						</Button>
					</DialogClose>
				</div>

				<DialogFooter className="justify-end" />
			</DialogContent>
		</Dialog>
	);
}
