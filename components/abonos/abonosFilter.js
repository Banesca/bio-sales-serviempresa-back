import { Button, Select, Input } from 'antd';
import { DatePicker } from 'antd';
import { Col, Form, Row } from 'antd';
import { Collapse } from 'antd';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';

export default function AbonosFilters({ setQuery,getOrdersRequest }) {
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
			
			nameclient: null,
			
		});
		filterForm.resetFields();
	};

	const handleSearch = async (values) => {
		
		setQuery({
			nameclient: values.nameclient || '',
		});

		if (values.date) {
			await getOrdersRequest({
				nameclient: values.nameclient, 
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
								name="nameclient"
							>
								<Input type="text" />
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
