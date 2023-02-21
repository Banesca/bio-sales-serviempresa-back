import { Button, Input } from 'antd';
import { Select } from 'antd';
import { Col, Form, Row } from 'antd';
import { Collapse } from 'antd';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';

export default function LinesFilters({ setQuery, setSelectedSubCategory }) {
	const { subCategories } = useCategoryContext();

	const [searchForm] = Form.useForm();

	const onReset = () => {
		searchForm.resetFields();
		setQuery('');
		setSelectedSubCategory(null);
	};

	const handleSearch = (values) => {
		setQuery(values.nameSubFamily);
		setSelectedSubCategory(values.idSubFamily);
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
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Nombre"
								name="nameSubFamily"
								style={{ padding: '0 .5rem' }}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Sub Categoría"
								name="idSubFamily"
								style={{ padding: '0 .5rem' }}
							>
								<Select allowClear>
									{subCategories &&
										subCategories.map((c) => (
											<Select.Option
												key={c.idProductSubFamily}
												value={c.idProductSubFamily}
											>
												{c.nameSubFamily}
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
							lg={{ span: 8 }}
							md={{ span: 8 }}
						>
							<Form.Item style={{ margin: '0 .5rem' }}>
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
							<Form.Item style={{ margin: '0 .5rem' }}>
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
