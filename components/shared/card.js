export default function Card({ children }) {
	return (
		<div
			style={{
				marginInline: '2rem',
				backgroundColor: '#fff',
				padding: '2rem',
				borderRadius: '1rem',
			}}
		>
			{children}
		</div>
	);
}
