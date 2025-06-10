// A new component for the loading skeleton
export const CollectionSidebarSkeleton = () => {
	return (
		<div className="w-80 border-r bg-background p-4 animate-pulse">
			{/* Skeleton Header */}
			<div className="flex items-center justify-between border-b pb-4">
				<div className="h-8 w-32 rounded-md bg-muted" />
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-md bg-muted" />
					<div className="h-8 w-8 rounded-md bg-muted" />
				</div>
			</div>

			{/* Skeleton List */}
			<div className="mt-4 space-y-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center gap-3">
						<div className="h-6 w-6 rounded bg-muted" />
						<div className="h-6 flex-1 rounded bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
};
