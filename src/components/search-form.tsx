"use client";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from "@/components/ui/sidebar";
import Form from "next/form";

interface SearchFormProps {
	className?: string;
	defaultValue?: string;
	onSearch: (query: string) => void;
}

export function SearchForm({
	className,
	defaultValue = "",
	onSearch,
}: SearchFormProps) {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(e.target.value);
	};

	return (
		<Form action="/project" className="w-full">
			<SidebarGroup className="py-0 px-0">
				<SidebarGroupContent className="relative">
					<Label htmlFor="search" className="sr-only">
						Search
					</Label>
					<SidebarInput
						type="search"
						name="query"
						id="search"
						placeholder="Search project..."
						className={`pl-8 ${className || ""}`}
						defaultValue={defaultValue}
						onChange={handleInputChange}
					/>
					<Search className="pointer-events-none absolute left-2 bottom-[8px] size-4 -translate-y-1/2 select-none opacity-50" />
				</SidebarGroupContent>
			</SidebarGroup>
		</Form>
	);
}
