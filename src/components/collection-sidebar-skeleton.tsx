import type React from "react";

export const CollectionSidebarSkeleton = () => {
	return (
		<div className="w-80 border-r bg-background p-4 animate-pulse">
			{/* Skeleton for the Header */}
			<div className="flex items-center justify-between border-b pb-4">
				<div className="h-9 w-36 rounded-md bg-muted" />
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-md bg-muted" />
					<div className="h-8 w-8 rounded-md bg-muted" />
				</div>
			</div>

			{/* Skeleton for the Collection List */}
			<div className="mt-4 space-y-6">
				{/* Create a few placeholder collection items */}
				{[...Array(3)].map((_, i) => (
					<div key={i} className="space-y-3">
						{/* Collection Header */}
						<div className="flex items-center gap-3">
							<div className="h-5 w-5 rounded bg-muted" />
							<div className="h-5 w-4/5 rounded bg-muted" />
						</div>
						{/* Endpoints within the collection */}
						<div className="ml-4 space-y-3 pl-4">
							<div className="flex items-center gap-2">
								<div className="h-5 w-12 rounded-md bg-muted" />
								<div className="h-5 flex-1 rounded-md bg-muted" />
							</div>
							<div className="flex items-center gap-2">
								<div className="h-5 w-12 rounded-md bg-muted" />
								<div className="h-5 flex-1 rounded-md bg-muted" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
