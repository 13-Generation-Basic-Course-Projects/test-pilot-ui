import { Progress } from "@/components/ui/progress";

interface ProgressMonitoringProps {
	completed: number;
	total: number;
}

export function ProgressMonitoring({
	completed,
	total,
}: ProgressMonitoringProps) {
	const percentage = (completed / total) * 100;
	return (
		<div className="w-full space-y-2">
			<Progress value={percentage} className="w-full h-2" />
			<div className="flex justify-between text-sm text-[#94A3B8]">
				<span>
					{completed} of {total} completed
				</span>
				<span>{Math.round(percentage)}%</span>
			</div>
		</div>
	);
}
