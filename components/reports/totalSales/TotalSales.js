import { Button, Card, List } from 'antd';
import React, { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';

const TotalSales = () => {
	const [report, setReport] = useState();
	const { requestHandler } = useRequest();

	const getReports = async () => {
		const res = await requestHandler.post('/api/v2/report/totals');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value._value.response[0];
		setReport(value);
	};
	return (
		<Card className="w-[50%] shadow-lg">
			<h1 className="text-3xl text-center my-6">Ventas totales</h1>
			<List>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Acciones</p>
					<Button type="default">Exportar</Button>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Promedio de ticket:</p>
					<p>{`$${report?.promedioTicket}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Promedio hoy:</p>
					<p>{`$${report?.promedioHoy}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Total de tickets:</p>
					<p>{`${report?.totalTicket}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Venta de ayer:</p>
					<p>{`$${report?.ventaAyer}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Venta de hoy:</p>
					<p>{`$${report?.ventaHoy}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Pedidos anulados:</p>
					<p>{`${report?.totalAnulados}`}</p>
				</List.Item>
			</List>
		</Card>
	);
};

export default TotalSales;
