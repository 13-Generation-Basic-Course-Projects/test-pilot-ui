import React from "react";
import Image from "next/image";

const Logo = () => {
	return (
		<>
			<Image
				src="/logo.png"
				alt="logo"
				width={100}
				height={100}
				className="object-cover"
			/>
		</>
	);
};

export default Logo;
