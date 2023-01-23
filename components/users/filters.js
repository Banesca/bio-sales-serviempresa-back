import { Button, Input } from 'antd';
import { Select } from 'antd';
import { Col, Form } from 'antd';
import { Collapse, Row } from 'antd';

const UserFilters = ({ setQuery }) => {
	const profileList = [
		{ name: 'Administrador', id: 1 },
		{ name: 'Full Acceso', id: 2 },
		{ name: 'Vendedor', id: 3 },
	];

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
				<Row style={{ justifyContent: 'center', width: '100%' }}>
					<Form
						form={form}
						style={{ maxWidth: '800px', width: '100%' }}
						name="productFilters"
						onFinish={onSubmit}
						labelCol={{ span: 8 }}
					>
						<Row>
							<Col span={12}>
								<Form.Item
									label="Nombre"
									style={{ padding: '0 .5rem' }}
									name="fullname"
								>
									<Input type="text" />
								</Form.Item>
							</Col>
							<Col span={12}>
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
							<Col span={12}>
								<Form.Item
									label="Perfil"
									style={{ padding: '0 .5rem' }}
									name="idProfileFk"
								>
									<Select>
										{profileList.map((p) => (
											<Select.Option
												key={p.id}
												value={p.id}
											>
												{p.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item
									wrapperCol={{
										span: 12,
										offset: 8,
									}}
								>
									<Button block onClick={onReset}>
										Limpiar
									</Button>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item wrapperCol={{ span: 12, offset: 8 }}>
									<Button
										htmlType="submit"
										type="primary"
										block
									>
										Buscar
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Row>
			</Collapse.Panel>
		</Collapse>
	);
};

export default UserFilters;
