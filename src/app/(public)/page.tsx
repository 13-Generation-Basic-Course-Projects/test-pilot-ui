import LandingPageComponent from "@/components/landing-page";
import { NavbarComponent } from "@/components/navbar";
import { InviteToProject } from "@/components/invite-to-projecct";

export default function Home() {
	return (
		<div className="">
			<NavbarComponent />
			<LandingPageComponent />
			<InviteToProject/>
		</div>
	);
}
