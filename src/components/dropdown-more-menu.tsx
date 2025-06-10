"use client";

import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ActionItem {
	icon?: React.ReactNode;
	label: string;
	onClick: (event: React.MouseEvent) => void;
	isSeparator?: false;
	className?: string;
	endIcon?: React.ReactNode;
}

interface SeparatorItem {
	isSeparator: true;
}

type MenuItem = ActionItem | SeparatorItem;

interface ItemActionsDropdownProps {
	open: boolean;
	triggerIcon?: React.ReactNode;
	menuLabel?: string;
	items: MenuItem[];
	onOpenChange?: (open: boolean) => void;
}

export const ItemActionsDropdown: React.FC<ItemActionsDropdownProps> = ({
	triggerIcon = <MoreHorizontalIcon className="w-4 h-4" />,
	menuLabel,
	items,
	onOpenChange,
}) => {
	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
				<button
					aria-label="Open actions menu"
					className="p-1 rounded-full hover:bg-slate-200 text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
				>
					{triggerIcon}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				onClick={(e) => e.stopPropagation()}
				className="w-48 z-50"
			>
				{menuLabel && (
					<>
						<DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				)}
				{items.map((item, index) => {
					if (item.isSeparator) {
						return <DropdownMenuSeparator key={`separator-${index}`} />;
					}
					return (
						<DropdownMenuItem
							key={item.label + index}
							onClick={item.onClick}
							className={item.className}
						>
							<span className="flex items-center">
								{item.icon && <span className="mr-2">{item.icon}</span>}
								{item.label}
							</span>
							{item.endIcon && <span className="ml-2">{item.endIcon}</span>}{" "}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
