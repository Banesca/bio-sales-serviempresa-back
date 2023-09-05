import { Button, Card, Col, Form, Input, Row } from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { useTdc } from '../../../components/tdc/useTdc';

export default function Tdc() {
	const { actualTdc, updateTdc, form, loading } = useTdc();
	

	return (
		<DashboardLayout>
			<div className="gap-3 flex flex-col items-center justify-center p-4 m-4">
				<Title title={'Tasa de cambios'}></Title>
				<Row className="w-[95%]" gutter={10}>
					<Col span={12}>
						<Card className="shadow-lg">
							<h1 className="text-3xl text-center">Tasa actual</h1>
							<h2 className="text-3xl text-center">
								<b>{actualTdc}</b>
							</h2>
						</Card>
					</Col>
					<Col span={12}>
						<Card className="shadow-lg">
							<h1 className="text-3xl text-center">Actualizar tasa</h1>

							<Row justify={'center'}>
								<Col span={20}>
									<Form
										layout="vertical"
										form={form}
										onFinish={updateTdc}
										className="p-6"
									>
										<Form.Item
											label="Nueva tasa de cambio"
											initialValue={actualTdc}
											rules={[
												{ required: true, message: 'La tasa es requerida' },
											]}
											name="param"
										>
											<Input value={actualTdc} size="large" />
										</Form.Item>
										<Form.Item>
											<Row justify={'center'}>
												<Button
													type="success"
													block
													htmlType="submit"
													loading={loading}
													size="large"
												>
													Guardar
												</Button>
											</Row>
										</Form.Item>
									</Form>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</div>
		</DashboardLayout>
	);
}
