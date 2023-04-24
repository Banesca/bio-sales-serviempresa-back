import { Button, Input, Select, Col, Form, Collapse, Row } from 'antd';

import { useCategoryContext } from '../../../../hooks/useCategoriesProvider';
import { useBrandContext } from '../../../../hooks/useBrandsProvider';
import { PROFILES } from '../../../../components/shared/profiles';
import SelectBusiness from '../../../../components/business/selectBusiness';
import { useAuthContext } from '../../../../context/useUserProfileProvider';

const Filter = ({ setQuery, clean }) => {
	const { categories, subCategories, lines } = useCategoryContext();
	const { brands } = useBrandContext();
	const { userProfile } = useAuthContext();

	const [form] = Form.useForm();

	const onReset = () => {
		clean();
		form.resetFields();
	};

	const onSubmit = (values) => {
		setQuery({
			nameProduct: values?.nameProduct || '',
			barCode: values?.barCode || '',
			pricePurchase: values?.pricePurchase || '',
			priceSale: values?.priceSale || '',
			family: values?.family || '',
			nameSubFamily: values?.nameSubFamily || 0,
			stock: values?.stock || 0,
			idProduct: values?.idProduct || 0,
		});
		console.log(values);
	};

	return (
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Row style={{ justifyContent: 'center' }}>
					<Form
						form={form}
						style={{ maxWidth: '800px', width: '100%', fontWeight: 'bold' }}
						name="productFilters"
						onFinish={onSubmit}
					>
						{userProfile == PROFILES.MASTER && <SelectBusiness />}
						<Row>
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Nombre"
									style={{ padding: '0 .5rem' }}
									name="nameProduct"
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
									}}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Código"
									name="barCode"
									style={{ padding: '0 .5rem' }}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
									}}
								>
									<Input allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Precio compra"
									name="priceSale"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
									}}
								>
									<Input type="number" allowClear />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Precio venta"
									name="pricePurchase"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
									}}
								>
									<Input type="number" allowClear />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Categoría"
									name="nameFamily"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
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
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Sub Categoría"
									name="nameSubFamily"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
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
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="Stock"
									name="stock"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
									}}
								>
									<Input type="number" allowClear />
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }}>
								<Form.Item
									label="ID"
									name="idProduct"
									style={{
										padding: '0 .5rem',
									}}
									labelCol={{
										md: { span: 8 },
										sm: { span: 10 },
									}}
									wrapperCol={{
										md: { span: 16 },
										sm: { span: 14 },
									}}
								>
									<Input type="number" allowClear />
								</Form.Item>
							</Col>
						</Row>
						
						<Row>
							<Col
								sm={{ span: 12, offset: 0 }}
								xs={{ span: 12, offset: 0 }}
								lg={{ span: 8, offset: 4 }}
								md={{ span: 8, offset: 4 }}
							>
								<Form.Item
									style={{
										padding: '0 .5rem',
									}}
								>
									<Button type='warning' block onClick={onReset}>
										Limpiar
									</Button>
								</Form.Item>
							</Col>
							<Col
								sm={{ span: 12, offset: 0 }}
								xs={{ span: 12, offset: 0 }}
								lg={{ span: 8, offset: 4 }}
								md={{ span: 8, offset: 4 }}
							>
								<Form.Item
									style={{
										padding: '0 .5rem',
									}}
								>
									<Button
										htmlType="submit"
										type="success"
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

export default Filter;