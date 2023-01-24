import React, { useEffect, useState } from 'react';
import { message, Select, Col, Row } from 'antd';
import { setTabs } from '../../util/setKeys';
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
		const filterBusiness = business.filter((b) => b.idSucursal === key)[0];
		handleSetSelectedBusiness(filterBusiness);
		localStorage.setItem(
			'selectedBusiness',
			JSON.stringify(filterBusiness)
		);
		handleMessage(filterBusiness.nombre);
	};

	const [form] = Form.useForm();
	useEffect(() => {
		if (selectedBusiness) {
			form.setFieldValue('business', selectedBusiness.nombre);
		}
	}, [selectedBusiness]);

	return (
		<Row>
			{contextHolder}
			<Col span={24}>
				<h3 style={{ color: 'white', textAlign: 'center' }}>
					Ambiente Empresarial
				</h3>
				<Form form={form}>
					<Form.Item
						wrapperCol={{ span: 6, offset: 9 }}
						name="business"
					>
						<Select onChange={onChange}>
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
			</Col>
		</Row>
	);
};
export default SelectBusiness;
