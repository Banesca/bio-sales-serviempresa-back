import { Button, Space } from 'antd';
import { Table } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';
import { useEffect } from 'react';
import { useProductOrders } from '../hooks/useProductOrders';

export default function ProductList({
	orderId,
	products,
	orderProducts,
	getOrderRequest,
}) {
	const AddColumns = [
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
			title: 'Acciones',
			key: 3,
			render: (text, record) => (
				<Space>
					<Button
						type="primary"
						onClick={() => handleAddProduct(record)}
					>
						Agregar
					</Button>
				</Space>
			),
		},
	];

	const { requestHandler } = useRequest();
	const { loading, setLoading } = useLoadingContext();
	const { addProduct } = useProductOrders();

	const productExist = (idProduct) => {
		let index = 0;
		let found = false;
		if (orderProducts) {
			for (const product of orderProducts) {
				if (product.idProduct === idProduct) {
					found = true;
					break;
				}
				index += 1;
			}
		}
		return {
			index,
			found,
		};
	};

	// Add Product
	const handleAddProductToOrder = async (body) => {
		console.log(body, 'body');
		setLoading(true);
		try {
			await addProduct({
				idOrderHFk: orderId,
				idProductFk: body.idProduct,
				idUserAddFk: localStorage.getItem('userId'),
				priceProductOrder: body.priceSale,
			});
			message.success('Producto agregado');
		} catch (error) {
			console.log(error);
			message.error('Error al agregar producto');
		} finally {
			setLoading(false);
		}
	};

	const handleAddProduct = async (record) => {
		if (products) {
			const { found, index } = productExist(record.idProduct);
			if (found) {
				console.log('found');
				let productList = [...orderProducts];
				productList[index].weight += 1;
				console.log(productList[index], 'product index');
				return await handleUpdateProduct({
					idOrderB: productList[index].idOrderB,
					weight: productList[index].weight,
				});
			}
		}
		await handleAddProductToOrder(record);
		await getOrderRequest(orderId);
	};
	// End Add Product

	const updateProductQuantity = async (idOrderB, weight) => {
		const res = await requestHandler.post(
			`/api/v2/order/product/setweight`,
			{ idOrderB, weight }
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const handleUpdateProduct = async ({ idOrderB, weight }) => {
		// setLoading(true);
		// const res = await requestHandler.post(
		// 	`/api/v2/order/product/setweight`,
		// 	{ idOrderB: record.idOrderB, weight: record.weight }
		// );
		// console.log(res);
		// if (res.isLeft()) {
		// 	message.error('Ha ocurrido un error');
		// }
		// setLoading(false);
		// await getOrderRequest(id);
		// message.success('Cantidad actualizada');
		try {
			setLoading(true);
			await updateProductQuantity(idOrderB, weight);
			message.success('Cantidad actualizada');
		} catch (error) {
			console.log(error);
			message.error('Error al actualizar cantidad');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log(products);
	}, [products]);

	return (
		<Table dataSource={products} columns={AddColumns} loading={loading} />
	);
}
