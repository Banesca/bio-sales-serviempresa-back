import React, { useEffect } from 'react';
import { message, Select, Col, Row } from 'antd';
import { Form } from 'antd';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';

const SelectBusiness = () => {
	const { business, handleSetSelectedBusiness, selectedBusiness } =
		useBusinessProvider();

	const [messageApi, contextHolder] = message.useMessage();

	const handleMessage = (name) => {
		messageApi.info(`Ambiente de empresarial ${name} seleccionado`);
	};

	const onChange = (key) => {
		const filterBusiness = business.find((b) => b.idSucursal === key);
		handleSetSelectedBusiness(filterBusiness);
		localStorage.setItem(
			'selectedBusiness',
			JSON.stringify(filterBusiness)
		);
		handleMessage(filterBusiness.nombre);
	};

	const [form] = Form.useForm();
	useEffect(() => {
		if (Object.keys(selectedBusiness).length) {
			form.setFieldValue('business', selectedBusiness.nombre);
		}
	}, [selectedBusiness]);

	return (
		<Row>
			{contextHolder}
			<Col span={24}>
				<h3 style={{ textAlign: 'center', margin: '0' }}>
					Ambiente Empresarial
				</h3>
				<Row style={{ display: 'flex', justifyContent: 'center' }}>
					<Form form={form}>
						<Form.Item name="business">
							<Select
								onChange={onChange}
								style={{ minWidth: '200px' }}
							>
								{business &&
									business.map((b) => (
										<Select.Option
											key={b.idSucursal}
											value={b.idSucursal}
										>
											{b.nombre}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Form>
				</Row>
			</Col>
		</Row>
	);
};
export default SelectBusiness;
