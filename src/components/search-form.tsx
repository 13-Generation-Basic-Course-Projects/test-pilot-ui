"use client";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

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
    <div className="w-full max-w-2xl mx-auto">
      <SidebarGroup className="py-0 px-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            type="search"
            name="query"
            id="search"
            placeholder="Search projects..."
            className={`pl-10 pr-4 py-2 w-full text-sm sm:text-base ${className || ""}`}
            defaultValue={defaultValue}
            onChange={handleInputChange}
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 sm:size-5 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}