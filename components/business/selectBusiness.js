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

	return (
		<Row>
			{contextHolder}
			<Col span={24}>
				<h3 style={{ color: 'white', textAlign: 'center' }}>
					Ambiente Empresarial
				</h3>
				<Form.Item wrapperCol={{ span: 6, offset: 9 }}>
					<Select
						defaultValue={
							selectedBusiness
								? selectedBusiness.nombre
								: 'Elige una empresa'
						}
						onChange={onChange}
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
			</Col>
		</Row>
	);
};
export default SelectBusiness;
