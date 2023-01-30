import { Button, Input } from 'antd';
import { Select } from 'antd';
import { Col, Form, Row } from 'antd';
import { Collapse } from 'antd';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';

export default function SubCategoryFilters({ setQuery, setSelectedCategory }) {
	const { categories } = useCategoryContext();

	const [searchForm] = Form.useForm();

	const onReset = () => {
		searchForm.resetFields();
		setQuery('');
		setSelectedCategory(null);
	};

	const handleSearch = (values) => {
		setQuery(values.nameSubFamily);
		console.log('values', values);
		setSelectedCategory(values.idFamily);
	};

	return (
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Form
					style={{ maxWidth: '800px', width: '100%' }}
					labelCol={{ span: 8 }}
					onFinish={handleSearch}
					form={searchForm}
				>
					<Row>
						<Col span={12}>
							<Form.Item
								label="Nombre"
								name="nameSubFamily"
								style={{ padding: '0 .5rem' }}
							>
								<Input allowClear />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label="Categoría"
								name="idFamily"
								style={{ padding: '0 .5rem' }}
							>
								<Select allowClear>
									{categories &&
										categories.map((c) => (
											<Select.Option
												key={c.idProductFamily}
												value={c.idProductFamily}
											>
												{c.name}
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
