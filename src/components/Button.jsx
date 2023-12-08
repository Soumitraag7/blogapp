import React from 'react';

export default function Button({
	children,
	type = 'button',
	bgColor = 'bg-blue-700',
	textColour = 'text-white',
	clssName = '',
	...props
}) {
	return (
		<button
			className={`px-4 py-2 rounded-lg ${bgColor} ${textColour} ${clssName}`}
			{...props}
		>
			{children}
		</button>
	);
}
