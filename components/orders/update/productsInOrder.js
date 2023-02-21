import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import { Space } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useEffect, useMemo, useState } from 'react';
import { addKeys } from '../../../util/setKeys';
import { useOrders } from '../hooks/useOrders';
import { message } from 'antd';

export default function ProductsInOrder({
	order,
	openDeleteModal,
	setProductsQuantity,
	confirmProductQuantity,
}) {
	const orderColumns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 2,
			render: (text, record) => (
				<p style={{ color: record.isPromo == '1' && 'green' }}>
					${record.isPromo == '1' ? record.marketPrice : text}
				</p>
			),
		},
		{
			title: 'Cantidad',
			dataIndex: 'weight',
			key: 3,
			render: (number, record, index) => (
				<Space>
					<Input
						type="number"
						style={{ width: '60px' }}
						value={order?.body[index].weight}
						onChange={(e) =>
							setProductsQuantity(e.target.value, index)
						}
					/>
					<Button
						type="primary"
						onClick={() => handleUpdateProduct(record)}
					>
						Ok
					</Button>
				</Space>
			),
		},
		{
			title: 'Acciones',
			key: 3,
			render: (record) => (
				<Space>
					<Button
						onClick={() => openDeleteModal(record)}
						type="primary"
						danger
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const { setLoading } = useLoadingContext();

	const handleUpdateProduct = async (record) => {
		setLoading(true);
		try {
			await confirmProductQuantity(record.idOrderB, Number(record.weight));
			message.success('Cantidad actualizada');
		} catch (error) {
			console.error(error);
			message.error('Error al actualizar cantidad');
		} finally {
			setLoading(false);
		}
	};

	const productList = useMemo(() => {
		const list = order?.body;
		addKeys(list);
		return list;
	}, [order]);

	const { loading } = useLoadingContext();

	return (
		<>
			<Table
				columns={orderColumns}
				loading={loading}
				dataSource={productList}
			/>
		</>
	);
}
