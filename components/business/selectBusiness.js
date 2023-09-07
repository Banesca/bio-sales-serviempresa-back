import React, { useEffect, useState } from 'react';
import { message, Select, Col, Row } from 'antd';
import { Form } from 'antd';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';

const SelectBusiness = () => {
	const { business, handleSetSelectedBusiness, selectedBusiness } =
		useBusinessProvider();

	const [messageApi, contextHolder] = message.useMessage();

	const handleMessage = (name) => {
		messageApi.info(`Almacen ${name} seleccionado`);
	};

	const onChange = (key) => {
		const filterBusiness = business.find((b) => b.idSucursal === key);
		handleSetSelectedBusiness(filterBusiness);
		localStorage.setItem('selectedBusiness', JSON.stringify(filterBusiness));
		localStorage.setItem('bs', filterBusiness.nombre);
		handleMessage(filterBusiness.nombre);
	};

	const [form] = Form.useForm();
	useEffect(() => {
		if (Object.keys(selectedBusiness).length) {
			form.setFieldValue('business', selectedBusiness.nombre);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBusiness]);

	return (
		<Form form={form}>
			<Form.Item name="business">
				<Select
					onChange={onChange}
					style={{
						minWidth: '200px',
						marginTop: '2rem',
						marginBottom: '1rem',
						backgroundColor: 'white',
						borderRadius: '15px',
						boxShadow: '4px 3px 8px 2px #9c9c9c5d',
					}}
				>
					{business &&
						business.map((b) => (
							<Select.Option key={b.idSucursal} value={b.idSucursal}>
								{b.nombre}
							</Select.Option>
						))}
				</Select>
			</Form.Item>
		</Form>
	);
};
export default SelectBusiness;
