import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import { useRouter } from 'next/router';

export default function Title({ title, path, children, goBack, update }) {
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
				alignItems: 'center',
				marginBottom: '1rem',
				gap: '21%'
			}}
		>
			<Col
				sm={{span: children ? 2 : 0}}
				xs={{span: children ? 2 : 0}}
				md={{ span: goBack ? 2 : 0 }}
				lg={{ span: goBack ? 2 : 0 }}
				style={{gap: '500px'}}
			>
				{goBack && (
					<Button onClick={handleReturn} style={{borderRadius: '20px', height: '42px'}}>
						<LeftOutlined
							style={{ fontSize: '1.5rem' }}
						/>
					</Button>
				)}
			</Col>
			<Col
				sm={{
					offset: goBack ? 0 : 6,
					span: 10,
				}}
				xs={{ span: children ? 12 : 12 }}
				md={{offset: update ? 0 : goBack ? 0 : 6, span: 10}}
				lg={{offset: goBack ? 0 : 6, span: 10}}
			>
				<Typography>
					{children 
						? <h1
							style={{
								textAlign: 'center',
								fontSize: '1.8rem',
								margin: '0',
							}}
						>
							{update ? update : title}
						</h1>
						: <h1
							style={{
								textAlign: 'center',
								fontSize: '1.8rem',
								margin: '0',
							}}
						>
							{update ? update : title}
						</h1>
					}
				</Typography>
			</Col>
			{children 
				? <Col
					lg={{ span: children ? 0 : 0 }}
					md={{ span: children ? 0 : 0, offset: 0 }}
					sm={{ span: children ? 0 : 0 }}
					xs={{ span: children ? 23 : 0}}
					style={{
						justifyContent: 'end',
						display: 'flex',
					}}
				>
					{children}
				</Col>
				: <></>
			}
			
		</Row>
	);
}
