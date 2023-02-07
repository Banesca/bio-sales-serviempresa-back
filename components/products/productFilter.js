import { Button, Input, Select, Col, Form, Collapse, Row } from 'antd';

import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { useBrandContext } from '../../hooks/useBrandsProvider';

const ProductFilter = ({
	setQuery,
	clean,
}) => {
	const { categories, subCategories, lines } = useCategoryContext();
	const { brands } = useBrandContext();

	const [form] = Form.useForm();

	const onReset = () => {
		clean();
		form.resetFields();
	};

	const onSubmit = (values) => {
		setQuery({
			nameProduct: values.nameProduct || '',
			barCode: values.barCode || '',
			maxPrice: values.maxPrice || '',
			minPrice: values.minPrice || '',
			nameFamily: values.nameFamily || 0,
			nameSubFamily: values.nameSubFamily || 0,
			idBrandFk: values.idBrandFk || 0,
			idLineFk: values.idLineFk || 0,
		});
	};

	return (
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Row style={{ justifyContent: 'center' }}>
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
									name="nameProduct"
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label="Código"
									name="barCode"
									style={{ padding: '0 .5rem' }}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item
									label="Precio min"
									name="minPrice"
									style={{
										padding: '0 .5rem',
									}}
								>
									<Input type="number" allowClear />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label="Precio max"
									name="maxPrice"
									style={{
										padding: '0 .5rem',
									}}
								>
									<Input type="number" allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item
									label="Categoría"
									name="nameFamily"
									style={{
										padding: '0 .5rem',
									}}
								>
									<Select
										showSearch
										allowClear
										filterOption={(input, option) => {
											return (option?.children ?? '')
												.toLocaleLowerCase()
												.includes(
													input.toLocaleLowerCase()
												);
										}}
									>
										{categories &&
											categories.map((c, i) => (
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
							<Col span={12}>
								<Form.Item
									label="Sub Categoría"
									name="nameSubFamily"
									style={{
										padding: '0 .5rem',
									}}
								>
									<Select
										allowClear
										showSearch
										filterOption={(input, option) => {
											return (option?.children ?? '')
												.toLocaleLowerCase()
												.includes(
													input.toLocaleLowerCase()
												);
										}}
									>
										{subCategories &&
											subCategories.map((b, i) => (
												<Select.Option
													key={b.idProductSubFamily}
													value={b.idProductSubFamily}
												>
													{b.nameSubFamily}
												</Select.Option>
											))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item
									label="Linea"
									name="idLineFk"
									style={{
										padding: '0 .5rem',
									}}
								>
									<Select
										showSearch
										allowClear
										filterOption={(input, option) => {
											return (option?.children ?? '')
												.toLocaleLowerCase()
												.includes(
													input.toLocaleLowerCase()
												);
										}}
									>
										{lines &&
											lines.map((line, i) => (
												<Select.Option
													key={line.idLine}
													value={line.idLine}
												>
													{line.name}
												</Select.Option>
											))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label="Marca"
									name="idBrandFk"
									style={{
										padding: '0 .5rem',
									}}
								>
									<Select
										showSearch
										allowClear
										filterOption={(input, option) => {
											return (option?.children ?? '')
												.toLocaleLowerCase()
												.includes(
													input.toLocaleLowerCase()
												);
										}}
									>
										{brands &&
											brands.map((c, i) => (
												<Select.Option
													key={c.idBrand}
													value={c.idBrand}
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
								<Form.Item
									wrapperCol={{
										span: 12,
										offset: 8,
									}}
								>
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

export default ProductFilter;
