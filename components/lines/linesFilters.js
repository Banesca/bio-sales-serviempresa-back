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
		console.log('values', values);
		setSelectedSubCategory(values.idSubFamily);
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
