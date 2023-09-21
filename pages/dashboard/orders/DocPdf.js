/* eslint-disable indent */
import DashboardLayout from '../../../components/shared/layout';
import { Button, List, message } from 'antd';
import DetailOrderTable from '../../../components/orders/detail/orderTable';
import { Document, Page, View, Text } from '@react-pdf/renderer';


const DocPdf = (currentOrder, orderStatusToUse, user) => {
	
	return (
		<Document>
			<Page size="A4">
				<DashboardLayout>
					<View
						style={{
							margin: '1rem',
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<View style={{ display: 'flex', width: '90%' }}>
							<Text title="Detalles de pédido" />
						</View>

						<List
							style={{
								width: '96%',
								padding: '10px 30px',
								backgroundColor: 'white',
								marginBottom: '25px',
								borderRadius: '15px',
								boxShadow: '4px 4px 8px rgba(207, 207, 207, 0.479)',
							}}
						>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Número de pedido:</Text>
								<Text>{currentOrder.numberOrden}</Text>
							</List.Item>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Vendedor:</Text>
								<Text>{user?.fullname}</Text>
							</List.Item>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Estado:</Text>
								<Text style={{ fontWeight: 'bold' }}>
									{orderStatusToUse[currentOrder.idStatusOrder]}
								</Text>
							</List.Item>

							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Cliente:</Text>
								<Text>{currentOrder.fullNameClient}</Text>
							</List.Item>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Contacto:</Text>
								<Text>{currentOrder.phoneClient}</Text>
							</List.Item>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Dirección:</Text>
								<Text>{currentOrder.address}</Text>
							</List.Item>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>Fecha de creación:</Text>
								<Text>
									{new Date(currentOrder.fechaEntrega).toLocaleDateString()}
								</Text>
							</List.Item>
							<List.Item>
								<Text style={{ fontWeight: 'bold' }}>
									Observacion (opcional):
								</Text>
								<Text style={{}}>{currentOrder.comments}</Text>
							</List.Item>
						</List>
						<DetailOrderTable
							products={currentOrder?.body}
							total={currentOrder?.totalBot}
						/>
					</View>
				</DashboardLayout>
			</Page>
		</Document>
	);
};

export default DocPdf;
