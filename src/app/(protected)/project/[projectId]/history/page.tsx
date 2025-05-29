import History from "@/components/history";
import { LogOutPopup } from "@/components/logout-compoent";
import React from "react";
const HistoryPage = () => {
	return (
		<div>
			<LogOutPopup/>
			<History />
		</div>
	);
};
export default HistoryPage;
