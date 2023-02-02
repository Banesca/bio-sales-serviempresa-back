import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export default function Title({ title, path }) {
	const router = useRouter();

	const handleReturn = () => {
		router.push(path);
	};

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<ArrowLeftOutlined
				style={{ fontSize: '1.5rem', color: 'white' }}
				onClick={handleReturn}
			/>
			<h1
				style={{
					textAlign: 'center',
					fontSize: '2rem',
					color: 'white',
				}}
			>
				{title}
			</h1>
			<div></div>
		</div>
	);
}
