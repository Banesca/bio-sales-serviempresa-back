import { ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import { useRouter } from 'next/router';

export default function Title({ title, path, children, goBack }) {
	const router = useRouter();

	const handleReturn = () => {
		router.push(path);
	};

	return (
		<Row
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: '1rem',
			}}
		>
			<Col
				sm={{ span: 0 }}
				xs={{ span: 0 }}
				md={{ span: goBack ? 4 : 0 }}
				lg={{ span: goBack ? 6 : 0 }}
			>
				{goBack && (
					<ArrowLeftOutlined
						style={{ fontSize: '1.5rem' }}
						onClick={handleReturn}
					/>
				)}
			</Col>
			<Col
				lg={{
					offset: goBack ? 0 : 6,
					span: 12,
				}}
				md={{
					offset: goBack ? 0 : 6,
					span: 12,
				}}
				sm={{
					offset: goBack ? 0 : 6,
					span: 12,
				}}
				xs={{ span: children ? 12 : 24 }}
			>
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
			</Col>
			<Col
				lg={{ span: children ? 6 : 0 }}
				md={{ span: children ? 6 : 0 }}
				sm={{ span: children ? 6 : 0 }}
				xs={{ span: children ? 6 : 0 }}
				style={{
					justifyContent: 'end',
					display: 'flex',
				}}
			>
				{children}
			</Col>
		</Row>
	);
}
