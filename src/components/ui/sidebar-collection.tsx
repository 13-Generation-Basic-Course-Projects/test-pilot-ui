"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Keeping original constants
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Keeping original context and hook
type SidebarCollectionContextProps = {
	state: "expanded" | "collapsed";
	open: boolean;
	setOpen: (open: boolean) => void;
	openMobile: boolean;
	setOpenMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebarCollection: () => void;
};

const SidebarCollectionContext =
	React.createContext<SidebarCollectionContextProps | null>(null);

function useSidebarCollection() {
	const context = React.useContext(SidebarCollectionContext);
	if (!context) {
		throw new Error(
			"useSidebarCollection must be used within a SidebarCollectionProvider."
		);
	}

	return context;
}

// Keeping original provider
function SidebarCollectionProvider({
	defaultOpen = true,
	open: openProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	...props
}: React.ComponentProps<"div"> & {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React.useState(false);

	const [_open, _setOpen] = React.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React.useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;
			if (setOpenProp) {
				setOpenProp(openState);
			} else {
				_setOpen(openState);
			}

			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open]
	);

	const toggleSidebarCollection = React.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [isMobile, setOpen, setOpenMobile]);

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault();
				toggleSidebarCollection();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebarCollection]);

	const state = open ? "expanded" : "collapsed";

	const contextValue = React.useMemo<SidebarCollectionContextProps>(
		() => ({
			state,
			open,
			setOpen,
			isMobile,
			openMobile,
			setOpenMobile,
			toggleSidebarCollection,
		}),
		[
			state,
			open,
			setOpen,
			isMobile,
			openMobile,
			setOpenMobile,
			toggleSidebarCollection,
		]
	);

	return (
		<SidebarCollectionContext.Provider value={contextValue}>
			<TooltipProvider delayDuration={0}>
				<div
					data-slot="sidebar-collection-wrapper"
					style={
						{
							// We'll remove these if they are no longer relevant to global styling
							// "--sidebar-width": SIDEBAR_WIDTH,
							// "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
							...style,
						} as React.CSSProperties
					}
					className={cn(
						// Removed fixed min-h-svh and w-full, this wrapper now just acts as a container
						// "group/sidebar-collection-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", // Old
						"group/sidebar-collection-wrapper flex", // Adjusted
						className
					)}
					{...props}
				>
					{children}
				</div>
			</TooltipProvider>
		</SidebarCollectionContext.Provider>
	);
}

function SidebarCollection({
	side = "left", // This prop will be less relevant for non-fixed but kept for consistency
	variant = "sidebar", // This prop's effect might be reduced for non-fixed
	collapsible = "offcanvas",
	className,
	children,
	...props
}: React.ComponentProps<"div"> & {
	side?: "left" | "right";
	variant?: "sidebar" | "floating" | "inset"; // Keep for consistency, but effects might change
	collapsible?: "offcanvas" | "icon" | "none";
}) {
	const { isMobile, state, openMobile, setOpenMobile, open } =
		useSidebarCollection();

	// Mobile behavior remains the same (Sheet)
	if (isMobile) {
		return (
			<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<SheetContent
					data-sidebar-collection="sidebar-collection"
					data-slot="sidebar-collection"
					data-mobile="true"
					className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
					style={
						{
							"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
						} as React.CSSProperties
					}
					side={side}
				>
					<SheetHeader className="sr-only">
						<SheetTitle>SidebarCollection</SheetTitle>
						<SheetDescription>
							Displays the mobile sidebar-collection.
						</SheetDescription>
					</SheetHeader>
					<div className="flex h-full w-full flex-col">{children}</div>
				</SheetContent>
			</Sheet>
		);
	}

	// Desktop behavior - modified for flexibility
	// We remove the gap and fixed positioning here.
	return (
		<div
			className={cn(
				"group peer text-sidebar-foreground hidden md:block",
				"bg-sidebar text-sidebar-foreground flex h-full flex-col", // Default styling for the sidebar itself
				// Width based on collapsible state
				state === "expanded" && `w-[${SIDEBAR_WIDTH}]`,
				collapsible === "icon" &&
					state === "collapsed" &&
					`w-[${SIDEBAR_WIDTH_ICON}]`,
				collapsible === "offcanvas" &&
					state === "collapsed" &&
					"w-0 overflow-hidden", // Completely hide
				"transition-[width] duration-200 ease-linear", // Add transition for width changes
				className
			)}
			data-state={state}
			data-collapsible={state === "collapsed" ? collapsible : ""}
			data-variant={variant}
			data-side={side} // Still useful for styling if you have conditional styles based on side
			data-slot="sidebar-collection"
			{...props}
		>
			{/* The inner container remains the same as it handles internal styling */}
			<div
				data-sidebar-collection="sidebar-collection"
				data-slot="sidebar-collection-inner"
				className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
			>
				{children}
			</div>
		</div>
	);
}

// Keeping other components as they are, they will now be styled based on their parent's width.

function SidebarCollectionTrigger({
	className,
	onClick,
	...props
}: React.ComponentProps<typeof Button>) {
	const { toggleSidebarCollection } = useSidebarCollection();

	return (
		<Button
			data-sidebar-collection="trigger"
			data-slot="sidebar-collection-trigger"
			variant="ghost"
			size="icon"
			className={cn("size-7", className)}
			onClick={(event) => {
				onClick?.(event);
				toggleSidebarCollection();
			}}
			{...props}
		>
			<PanelLeftIcon />
			<span className="sr-only">Toggle SidebarCollection</span>
		</Button>
	);
}

// Removed SidebarCollectionRail and SidebarCollectionInset as they are for fixed layouts.
// You would need to implement equivalent functionality if you want to resize a non-fixed sidebar.

function SidebarCollectionInput({
	className,
	...props
}: React.ComponentProps<typeof Input>) {
	return (
		<Input
			data-slot="sidebar-collection-input"
			data-sidebar-collection="input"
			className={cn("bg-background h-12 w-full shadow-none", className)}
			{...props}
		/>
	);
}

function SidebarCollectionHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-collection-header"
			data-sidebar-collection="header"
			className={cn("flex flex-col gap-2 p-2", className)}
			{...props}
		/>
	);
}

function SidebarCollectionFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-collection-footer"
			data-sidebar-collection="footer"
			className={cn("flex flex-col gap-2 p-2", className)}
			{...props}
		/>
	);
}

function SidebarCollectionSeparator({
	className,
	...props
}: React.ComponentProps<typeof Separator>) {
	return (
		<Separator
			data-slot="sidebar-collection-separator"
			data-sidebar-collection="separator"
			className={cn("bg-sidebar-border mx-2 w-auto", className)}
			{...props}
		/>
	);
}

function SidebarCollectionContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-collection-content"
			data-sidebar-collection="content"
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
				className
			)}
			{...props}
		/>
	);
}

function SidebarCollectionGroup({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-collection-group"
			data-sidebar-collection="group"
			className={cn("relative flex w-full min-w-0 flex-col p-2 ", className)}
			{...props}
		/>
	);
}

function SidebarCollectionGroupLabel({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="sidebar-collection-group-label"
			data-sidebar-collection="group-label"
			className={cn(
				"text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
				"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
				className
			)}
			{...props}
		/>
	);
}

function SidebarCollectionGroupAction({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="sidebar-collection-group-action"
			data-sidebar-collection="group-action"
			className={cn(
				"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
				"after:absolute after:-inset-2 md:after:hidden",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...props}
		/>
	);
}

function SidebarCollectionGroupContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-collection-group-content"
			data-sidebar-collection="group-content"
			className={cn("w-full text-sm", className)}
			{...props}
		/>
	);
}

function SidebarCollectionMenu({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="sidebar-collection-menu"
			data-sidebar-collection="menu"
			className={cn("flex w-full flex-col gap-1", className)}
			{...props}
		/>
	);
}

function SidebarCollectionMenuItem({
	className,
	...props
}: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="sidebar-collection-menu-item"
			data-sidebar-collection="menu-item"
			className={cn("group/menu-item relative", className)}
			{...props}
		/>
	);
}

const sidebarCollectionMenuButtonVariants = cva(
	"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 cursor-pointer py-5 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar-collection=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline:
					"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
			size: {
				default: "h-8 text-sm",
				sm: "h-7 text-xs",
				lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

function SidebarCollectionMenuButton({
	asChild = false,
	isActive = false,
	variant = "default",
	size = "default",
	tooltip,
	className,
	...props
}: React.ComponentProps<"button"> & {
	asChild?: boolean;
	isActive?: boolean;
	tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarCollectionMenuButtonVariants>) {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebarCollection();

	const button = (
		<Comp
			data-slot="sidebar-collection-menu-button"
			data-sidebar-collection="menu-button"
			data-size={size}
			data-active={isActive}
			className={cn(
				sidebarCollectionMenuButtonVariants({ variant, size }),
				className
			)}
			{...props}
		/>
	);

	if (!tooltip) {
		return button;
	}

	if (typeof tooltip === "string") {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent
				side="right"
				align="center"
				hidden={state !== "collapsed" || isMobile}
				{...tooltip}
			/>
		</Tooltip>
	);
}

function SidebarCollectionMenuAction({
	className,
	asChild = false,
	showOnHover = false,
	...props
}: React.ComponentProps<"button"> & {
	asChild?: boolean;
	showOnHover?: boolean;
}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="sidebar-collection-menu-action"
			data-sidebar-collection="menu-action"
			className={cn(
				"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
				"after:absolute after:-inset-2 md:after:hidden",
				"peer-data-[size=sm]/menu-button:top-1",
				"peer-data-[size=default]/menu-button:top-1.5",
				"peer-data-[size=lg]/menu-button:top-2.5",
				"group-data-[collapsible=icon]:hidden",
				showOnHover &&
					"peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
				className
			)}
			{...props}
		/>
	);
}

function SidebarCollectionMenuBadge({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-collection-menu-badge"
			data-sidebar-collection="menu-badge"
			className={cn(
				"text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
				"peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
				"peer-data-[size=sm]/menu-button:top-1",
				"peer-data-[size=default]/menu-button:top-1.5",
				"peer-data-[size=lg]/menu-button:top-2.5",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...props}
		/>
	);
}

function SidebarCollectionMenuSkeleton({
	className,
	showIcon = false,
	...props
}: React.ComponentProps<"div"> & {
	showIcon?: boolean;
}) {
	const width = React.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);

	return (
		<div
			data-slot="sidebar-collection-menu-skeleton"
			data-sidebar-collection="menu-skeleton"
			className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
			{...props}
		>
			{showIcon && (
				<Skeleton
					className="size-4 rounded-md"
					data-sidebar-collection="menu-skeleton-icon"
				/>
			)}
			<Skeleton
				className="h-4 max-w-(--skeleton-width) flex-1"
				data-sidebar-collection="menu-skeleton-text"
				style={
					{
						"--skeleton-width": width,
					} as React.CSSProperties
				}
			/>
		</div>
	);
}

function SidebarCollectionMenuSub({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="sidebar-collection-menu-sub"
			data-sidebar-collection="menu-sub"
			className={cn(
				"border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...props}
		/>
	);
}

function SidebarCollectionMenuSubItem({
	className,
	...props
}: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="sidebar-collection-menu-sub-item"
			data-sidebar-collection="menu-sub-item"
			className={cn("group/menu-sub-item relative", className)}
			{...props}
		/>
	);
}

function SidebarCollectionMenuSubButton({
	asChild = false,
	size = "md",
	isActive = false,
	className,
	...props
}: React.ComponentProps<"a"> & {
	asChild?: boolean;
	size?: "sm" | "md";
	isActive?: boolean;
}) {
	const Comp = asChild ? Slot : "a";

	return (
		<Comp
			data-slot="sidebar-collection-menu-sub-button"
			data-sidebar-collection="menu-sub-button"
			data-size={size}
			data-active={isActive}
			className={cn(
				"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
				"data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
				size === "sm" && "text-xs",
				size === "md" && "text-sm",
				"group-data-[collapsible=icon]:hidden",
				className
			)}
			{...props}
		/>
	);
}

export {
	SidebarCollection,
	SidebarCollectionContent,
	SidebarCollectionFooter,
	SidebarCollectionGroup,
	SidebarCollectionGroupAction,
	SidebarCollectionGroupContent,
	SidebarCollectionGroupLabel,
	SidebarCollectionHeader,
	SidebarCollectionInput,
	SidebarCollectionMenu,
	SidebarCollectionMenuAction,
	SidebarCollectionMenuBadge,
	SidebarCollectionMenuButton,
	SidebarCollectionMenuItem,
	SidebarCollectionMenuSkeleton,
	SidebarCollectionMenuSub,
	SidebarCollectionMenuSubButton,
	SidebarCollectionMenuSubItem,
	SidebarCollectionProvider,
	SidebarCollectionSeparator,
	SidebarCollectionTrigger,
	useSidebarCollection,
};
