import Image from 'next/image';
import React from 'react';

const MainLogo = () => {
	return (
		<Image
			alt=""
			src={'/Images/LOGO.png'}
			fill
			priority
			sizes="(max-width: 300px)"
		/>
	);
};

export default MainLogo;
