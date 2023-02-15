import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useRouter } from 'next/router';

export default function Title({ title, path, children }) {
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
				marginBottom: '1rem'
			}}
		>
			<ArrowLeftOutlined
				style={{ fontSize: '1.5rem' }}
				onClick={handleReturn}
			/>
			<Typography>
				<h1
					style={{
						textAlign: 'center',
						fontSize: '1.5rem',
						margin: '0',
					}}
				>
					{title}
				</h1>
			</Typography>
			<div>{children}</div>
		</div>
	);
}
