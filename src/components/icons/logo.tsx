import React from "react";
import Image from "next/image";

const Logo = () => {
	return (
		<>
			<Image
				src="/logo.png"
				alt="logo"
				width={110}
				height={110}
				className="object-cover"
			/>
		</>
	);
};

export default Logo;
