import { Button, Select, Input } from 'antd';
import { DatePicker } from 'antd';
import { Col, Form, Row } from 'antd';
import { Collapse } from 'antd';
import { orderStatusToUse } from '../../pages/dashboard/orders';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';

export default function OrdersFilters({ setQuery, getOrdersRequest }) {
	const [filterForm] = Form.useForm();
	const { selectedBusiness } = useBusinessProvider();

	const onReset = () => {
		let dateStart = new Date(2023, 0, 1);
		let dateEnd = new Date();
		getOrdersRequest({
			idBranchFk: `${selectedBusiness.idSucursal}`,
			dateStart,
			dateEnd,
		});
		setQuery({
			idStatusOrder: 0,
		
			startDate: null,
			endDate: null,
		});
		filterForm.resetFields();
	};

	const handleSearch = async (values) => {
		setQuery({
			idStatusOrder: values.idStatusOrder || 0,
			startDate: values.date ? values.date[0]?.$d : null,
			endDate: values.date ? values.date[1]?.$d : null,
			fullname: values.fullname || '',
		});

		if (values.date) {
			await getOrdersRequest({
				idBranchFk: `${selectedBusiness.idSucursal}`,
				dateStart: values.date[0].$d,
				dateEnd: values.date[1].$d,
			});
		}
	};

	return (
		<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
			<Collapse.Panel header="Filtros">
				<Form
					form={filterForm}
					onFinish={handleSearch}
					style={{ maxWidth: '900px' }}
					labelCol={{ span: 10 }}
				>
					<Row
						style={{
							justifyContent: 'space-between',
						}}
					>
						<Col span={11}>
							<Form.Item
								label="Cliente"
								style={{ padding: '0 .5rem' }}
								
								name="fullname"
							>
								<Input type="text" />
							</Form.Item>
						</Col>
						<Col span={11}>
							<Form.Item
								label="Vendedor"
								style={{
									padding: '0 .5rem',
								}}
							
							
								name="name"
							>
								<Input type="text" />
							</Form.Item>
						</Col>
						<Col span={11}>
							<Form.Item
								label="Estado"
								name="idStatusOrder"
								style={{
									padding: '0 .5rem',
								}}
							>
								<Select>
									{Object.entries(orderStatusToUse).map((o) => {
										return (
											<Select.Option key={o[0]} value={o[0]}>
												{o[1].state}
											</Select.Option>
										);
									})}
								</Select>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								label="Fecha"
								name="date"
								style={{
									padding: '0 .5rem',
								}}
							>
								<DatePicker.RangePicker
									placeholder={['Fecha inicial', 'Fecha final']}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Form.Item wrapperCol={{ offset: 9, span: 13 }}>
								<Button
									htmlType="submit"
									block
									type="warning"
									onClick={onReset}
								>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ offset: 10, span: 14 }}>
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
}
