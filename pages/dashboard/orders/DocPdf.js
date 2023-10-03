/* eslint-disable indent */
import DashboardLayout from '../../../components/shared/layout';
import { Button, List, message } from 'antd';
import DetailOrderTable from '../../../components/orders/detail/orderTable';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const DocPdf = (currentOrder, orderStatusToUse, user) => {

	const styles = StyleSheet.create({
		title: {
			alignItems: 'center',
			padding: '20px',
		},
		body: {
			width:'50%',
			display:'flex',
			padding: '10px',
		},
	});
	return (
		<Document>
			<Page size="A4">
				<View>
					<View style={styles.title}>
						<Text>Detalles de pédido</Text>
					</View>

					<View>
						<View style={styles.body}>
							<Text>Número de pedido:</Text>
							<Text>{currentOrder.numberOrden}</Text>
						</View>
						<View style={styles.body}>
							<Text>Vendedor:</Text>
							<Text>{user?.fullname}</Text>
						</View>
						<View style={styles.body}>
							<Text>Estado:</Text>
							<Text>{status.state}</Text>
						</View>
						<View style={styles.body}>
							<Text>Cliente:</Text>
							<Text>{currentOrder.fullNameClient}</Text>
						</View>
						<View style={styles.body}>
							<Text>Contacto:</Text>
							<Text>{currentOrder.phoneClient}</Text>
						</View>
						<View style={styles.body}>
							<Text>Dirección:</Text>
							<Text>{currentOrder.address}</Text>
						</View>
						<View style={styles.body}>
							<Text>Fecha de creación:</Text>
							<Text>
								{new Date(currentOrder.fechaEntrega).toLocaleDateString()}
							</Text>
						</View>
						<View style={styles.body}>
							<Text>Observacion:</Text>
							<Text style={{}}>{currentOrder.comments}</Text>
						</View>
					</View>
					{/* 	<View>
						<DetailOrderTable
							products={currentOrder?.body}
							total={currentOrder?.totalBot}
						/>
					</View> */}
				</View>
			</Page>
		</Document>
	);
};

export default DocPdf;
