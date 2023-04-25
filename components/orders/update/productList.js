import { Button, ConfigProvider, Space } from 'antd';
import { Table } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';
import { useEffect } from 'react';
import { useProductOrders } from '../hooks/useProductOrders';
import { UNIT_TYPE } from '../../../pages/dashboard/orders/update/[id]';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

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
				<p>${record.isPromo == '1' ? record.marketPrice : text}</p>
			),
		},
		{
			title: 'Acciones',
			key: 3,
			render: (text, record) => (
				<Space>
					<Button type="success" onClick={() => handleAddProduct(record)}>
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

	const handleAddProductToOrder = async (body) => {
		setLoading(true);
		try {
			let priceProductOrder =
				body.isPromo == 1 ? body.marketPrice : body.priceSale;
			if (body.idUnitMeasureSaleFk == UNIT_TYPE.KG) {
				priceProductOrder *= body.unitweight;
			}
			await addProduct({
				idOrderHFk: orderId,
				idProductFk: body.idProduct,
				idUserAddFk: localStorage.getItem('userId'),
				priceProductOrder,
			});
			message.success('Producto agregado');
		} catch (error) {
			message.error('Error al agregar producto');
		} finally {
			setLoading(false);
		}
	};

	const handleAddProduct = async (record) => {
		if (products) {
			const { found, index } = productExist(record.idProduct);
			if (found) {
				let productList = [...orderProducts];
				productList[index].weight += 1;
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
		const res = await requestHandler.post('/api/v2/order/product/setweight', {
			idOrderB,
			weight,
		});
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const handleUpdateProduct = async ({ idOrderB, weight }) => {
		try {
			setLoading(true);
			await updateProductQuantity(idOrderB, weight);
			message.success('Cantidad actualizada');
		} catch (error) {
			message.error('Error al actualizar cantidad');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {}, [products]);

	return (
		<ConfigProvider renderEmpty={CustomizeRenderEmpty}>
			<Table dataSource={products} columns={AddColumns} loading={loading} />
		</ConfigProvider>
	);
}
