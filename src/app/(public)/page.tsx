import LandingPageComponent from "@/components/landing-page";
import { NavbarComponent } from "@/components/navbar";
import { InviteToProject } from "@/components/invite-to-projecct";

import ProfileSetting from "@/components/profile-setting";
export default function Home() {
	return (
		<div className="">
			<NavbarComponent />
			<LandingPageComponent />
			<InviteToProject/>
		</div>
	);
}
