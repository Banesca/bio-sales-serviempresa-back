import { Button, Input, Select, Col, Form, Collapse, Row } from 'antd';

import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { useBrandContext } from '../../hooks/useBrandsProvider';
import { PROFILES } from '../shared/profiles';
import SelectBusiness from '../business/selectBusiness';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { useEffect, useState } from 'react';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { useRequest } from '../../hooks/useRequest';
import { useProductFilter } from './useProductFilter';

const ProductFilter = ({ setQuery, clean, filtered }) => {
	const { categories, subCategories, lines } = useCategoryContext();
	const { brands } = useBrandContext();
	const { userProfile } = useAuthContext();
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();
	const [form] = Form.useForm();
	

	const onReset = () => {
		clean();
		form.resetFields();
	};

	const onSubmit = async (values) => {
		setQuery({
			nameProduct: values.nameProduct || '',
			barCode: values.barCode || '',
			maxPrice: values.maxPrice || '',
			minPrice: values.minPrice || '',
			nameFamily: values.nameFamily || 0,
			nameSubFamily: values.nameSubFamily || 0,
			idBrandFk: values.idBrandFk || 0,
			idLineFk: values.idLineFk || 0,
			is5050: values.is5050 || '',
		});
		let id = selectedBusiness.idSucursal;
		const res = await requestHandler.post(`/api/v2/product/list/litereference/0/0/${id}/100/0`,{
			search: values.is5050 || '',
		});
		if(res.isRight){
			//console.log(res.value.getValue().data)
			//filtered()
			//filtered=res.value.getValue().[0]
		}
		
	};
	

	const [log, setLog] = useState();
	
	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
		//console.log(categories)
	}, []);

		
	useEffect(() => {
		//console.log(categories)
	}, [selectedBusiness]);

	return (
		<Collapse className="bg-gray-100 my-5 shadow-md">
			<Collapse.Panel header="Filtros">
				<Form
					form={form}
					className="max-w-[800px] w-full font-bold mx-auto"
					name="productFilters"
					onFinish={onSubmit}
				>
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Busqueda"
								className="p-2"
								name="is5050"
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
								label="Marca"
								name="idBrandFk"
								className="p-2"
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
											.includes(input.toLocaleLowerCase());
									}}
								>
									{brands &&
										brands.map((c, i) => (
											<Select.Option key={c.idBrand} value={c.idBrand}>
												{c.name}
											</Select.Option>
										))}
								</Select>
							</Form.Item>
						</Col>

					</Row>
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<Form.Item
								label="Categoría"
								name="nameFamily"
								className="p-2"
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
								className="p-2"
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
											.includes(input.toLocaleLowerCase());
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
								label="Linea"
								name="idLineFk"
								className="p-2"
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
											.includes(input.toLocaleLowerCase());
									}}
								>
									{lines &&
										lines.map((line, i) => (
											<Select.Option key={line.idLine} value={line.idLine}>
												{line.name}
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
							lg={{ span: 8, offset: 4 }}
							md={{ span: 8, offset: 4 }}
						>
							<Form.Item className="p-2">
								<Button type="warning" block onClick={onReset}>
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
							<Form.Item className="p-2">
								<Button htmlType="submit" type="success" block>
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

export default ProductFilter;
