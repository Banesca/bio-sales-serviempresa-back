import { Button, Card, List } from 'antd';
import React, { useState, useEffect } from 'react';
import { useRequest } from '../../../hooks/useRequest';


const TotalSales = () => {
	const [report, setReport] = useState("");
	const { requestHandler } = useRequest();
	

	useEffect(() => {
		getReports();
	},[]);

	
	useEffect(() => {
	},[report]);


	
	const getReports = async () => {
		const res = await requestHandler.post('/api/v2/report/totals/');
		if (!res.isLeft()) {
			const value = res.value.getValue().response[0];
			return setReport(value);
		} 
	};
	

	function validateValue(value){
		if(value == null){
			return 0
		} else {
			return value
		}
    }


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
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Promedio de ticket:</p>
					<p>{`$ ${validateValue(report?.promedioTicket)}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Promedio hoy:</p>
					<p>{`$ ${validateValue(report?.promedioHoy)}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Total de pédidos:</p>
					<p>{`${validateValue(report?.totalTicket)}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Venta de ayer:</p>
					<p>{`$ ${validateValue(report?.ventaAyer)}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Venta de hoy:</p>
					<p>{`$ ${validateValue(report?.ventaHoy)}`}</p>
				</List.Item>
				<List.Item
					style={{
						padding: '0px 40px',
						justifyContent: 'space-between',
						fontSize: '18px',
					}}
				>
					<p style={{ fontWeight: 'bold' }}>Pedidos anulados:</p>
					<p>{`${validateValue(report?.totalAnulados)}`}</p>
				</List.Item>
			</List>
		</Card>
	);
};

export default TotalSales;
