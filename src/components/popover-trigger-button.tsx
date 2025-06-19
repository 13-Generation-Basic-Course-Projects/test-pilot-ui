import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";

interface PopoverButtonProps {
	children: React.ReactNode;
	content: React.ReactNode;
}

export function PopoverButton({ children, content }: PopoverButtonProps) {
	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md border border-input bg-transparent p-0 hover:bg-accent focus:outline-none disabled:pointer-events-none disabled:opacity-50"
					aria-label="Add test case"
				>
					{children}
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="p-0 w-[250px]"
				align="start"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				{content}
			</PopoverContent>
		</Popover>
	);
}
