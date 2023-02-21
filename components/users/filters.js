import { Button, Input } from 'antd';
import { Select } from 'antd';
import { Col, Form } from 'antd';
import { Collapse, Row } from 'antd';
import { PROFILE_LIST } from '../shared/profiles';

const UserFilters = ({ setQuery }) => {
	const [form] = Form.useForm();

	const onReset = () => {
		setQuery({
			fullname: '',
			idProfileFk: '',
			mail: '',
		});
		form.resetFields();
	};

	const onSubmit = (values) => {
		setQuery({
			fullname: values.fullname || '',
			idProfileFk: values.idProfileFk || 0,
			mail: values.mail || '',
		});
	};

	return (
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Form
					form={form}
					style={{
						maxWidth: '600px',
						width: '100%',
						margin: '0 auto',
					}}
					name="productFilters"
					onFinish={onSubmit}
				>
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Nombre"
								style={{ padding: '0 .5rem' }}
								labelCol={{ md: { span: 6 }, sm: { span: 8 } }}
								wrapperCol={{
									md: { span: 18 },
									sm: { span: 16 },
								}}
								name="fullname"
							>
								<Input type="text" />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Correo"
								name="mail"
								style={{ padding: '0 .5rem' }}
							>
								<Input type="text" />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Perfil"
								labelCol={{ md: { span: 6 }, sm: { span: 8 } }}
								wrapperCol={{
									md: { span: 18 },
									sm: { span: 16 },
								}}
								style={{ padding: '0 .5rem' }}
								name="idProfileFk"
							>
								<Select>
									{PROFILE_LIST.map((p) => (
										<Select.Option key={p.id} value={p.id}>
											{p.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col
							sm={{ span: 12, offset: 0 }}
							xs={{ span: 12, offset: 0 }}
							lg={{ span: 9, offset: 3 }}
							md={{ span: 9, offset: 3 }}
						>
							<Form.Item style={{ margin: '0 .5rem 0 0' }}>
								<Button block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col
							sm={{ span: 12, offset: 0 }}
							xs={{ span: 12, offset: 0 }}
							lg={{ span: 9, offset: 3 }}
							md={{ span: 9, offset: 3 }}
						>
							<Form.Item style={{ margin: '0 .5rem 0 0' }}>
								<Button htmlType="submit" type="primary" block>
									Buscar
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Collapse.Panel>
		</Collapse>
	);
};

export default UserFilters;
