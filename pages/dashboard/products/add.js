import { useState } from 'react';
import { Button, Input, Upload, Col, Form, Row } from 'antd';
import {
	LoadingOutlined,
	PlusOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import DashboardLayout from '../../../components/layout';
import { Image } from 'antd';

const AddProduct = () => {
	const onSubmit = (values) => {
		console.log(values);
	};

	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState();

	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div
				style={{
					marginTop: 8,
				}}
			>
				Upload
			</div>
		</div>
	);

	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	};

	const beforeUpload = (file) => {
		const isJpgOrPng =
			file.type === 'image/jpeg' ||
			file.type === 'image/png' ||
			file.type === 'image/jpeg';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		return isJpgOrPng && isLt2M;
	};

	const handleChange = (info) => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			console.log(info);
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (url) => {
				setLoading(false);
				setImageUrl(url);
			});
		}
	};

	return (
		<DashboardLayout>
			<h1
				style={{
					color: 'white',
					fontSize: '2rem',
					textAlign: 'center',
				}}
			>
				Agregar Producto
			</h1>
			<div
				style={{
					maxWidth: '800px',
					margin: 'auto',
				}}
			>
				<Form
					style={{ width: '100%' }}
					name="addProduct"
					labelCol={{ span: 4 }}
					initialValues={{ remember: true }}
					onFinish={onSubmit}
					autoComplete="off"
				>
					<Form.Item label="Nombre">
						<Input type="text"></Input>
					</Form.Item>
					<Row>
						<Col span={12}>
							<Form.Item label="Nombre" labelCol={{ span: 8 }}>
								<Input type="text"></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Nombre" labelCol={{ span: 8 }}>
								<Input type="text"></Input>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item label="Nombre" labelCol={{ span: 8 }}>
								<Input type="text"></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Nombre" labelCol={{ span: 8 }}>
								<Input type="text"></Input>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item label="Nombre" labelCol={{ span: 8 }}>
								<Input type="text"></Input>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Nombre" labelCol={{ span: 8 }}>
								<Input type="text"></Input>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item wrapperCol={{ span: 4, offset: 11 }}>
						<Upload
							name="avatar"
							className="avatar-uploader"
							listType="picture"
							beforeUpload={beforeUpload}
							onChange={handleChange}
						>
							<Button icon={<UploadOutlined />}>
								Subir imagen
							</Button>
						</Upload>
					</Form.Item>
				</Form>
			</div>
		</DashboardLayout>
	);
};

export default AddProduct;
