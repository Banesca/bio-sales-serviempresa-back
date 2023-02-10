import { Button, Input } from 'antd';
import { Col, Form, Row } from 'antd';
import { Collapse } from 'antd';

export default function BrandsFilters({ setQuery }) {
	const [searchForm] = Form.useForm();

	const onReset = () => {
		setQuery('');
		searchForm.resetFields();
	};

	const handleSearch = (values) => {
		setQuery(values.name);
		console.log(values);
	};

	return (
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Form
					style={{
						maxWidth: '600px',
						width: '100%',
						margin: '0 auto',
					}}
					onFinish={handleSearch}
					form={searchForm}
				>
					<Row>
						<Col span={24}>
							<Form.Item
								label="Nombre"
								name="name"
								style={{ marginInline: '.5rem' }}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col
							sm={{ span: 12, offset: 0 }}
							xs={{ span: 12, offset: 0 }}
							lg={{ span: 8 }}
							md={{ span: 8 }}
						>
							<Form.Item style={{ padding: '0 .5rem' }}>
								<Button block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col
							sm={{ span: 12, offset: 0 }}
							xs={{ span: 12, offset: 0 }}
							lg={{ span: 8, offset: 8 }}
							md={{ span: 8, offset: 8 }}
						>
							<Form.Item style={{ padding: '0 .5rem' }}>
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
}
