import React from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { Card, ConfigProvider, Space, Table } from 'antd';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import Image from 'next/image';

const Merchandising = () => {
	const { filtered } = useProductFilter();
	const columns = [
		{
			title: 'Producto',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Codigo',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					{/* <Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/${product.idProduct}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/update/${product.idProduct}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button> */}
				</Space>
			),
		},
	];
	const columns2 = [
		{
			title: 'Fecha del reporte',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					{/* <Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/${product.idProduct}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/update/${product.idProduct}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button> */}
				</Space>
			),
		},
	];
	const columns3 = [
		{
			title: 'Producto',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Codigo',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					{/* <Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/${product.idProduct}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/update/${product.idProduct}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button> */}
				</Space>
			),
		},
	];

	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Reporte del merchandising'}></Title>
				<div className="flex flex-col gap-5">
					<ConfigProvider
						renderEmpty={
							filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
						}
					>
						<Table columns={columns2} />
					</ConfigProvider>
					<h1 className="text-center text-4xl font-semibold">
						Reporte 09052023
					</h1>
					<Card className="shadow-lg rounded-xl gap-5">
						<h2 className="text-center text-3xl my-2">Evidencia fotográfica</h2>
						<div className="flex gap-5 justify-center items-center">
							<div className="flex flex-col gap-2">
								<h2>Antes:</h2>
								<div className="h-80 w-96 relative mb-5">
									<Image
										alt="Sin datos"
										src={''}
										fill
										className="object-cover bg-gray-200"
									/>
								</div>
								<div>
									<h1>Descripción:</h1>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Después:</h2>
								<div className="h-80 w-96 relative mb-5">
									<Image
										alt="Sin datos"
										src={''}
										fill
										className="object-cover bg-gray-200"
									/>
								</div>
								<div>
									<h1>Descripción:</h1>
								</div>
							</div>
						</div>
					</Card>
					<div className="w-full h-full">
						<h1 className="text-3xl text-center my-4">
							Estados de los productos
						</h1>
						<ConfigProvider
							renderEmpty={
								filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
							}
						>
							<Table columns={columns3} />
						</ConfigProvider>
					</div>
					<div className="w-full">
						<h1 className="text-3xl text-center my-4">Productos sugeridos</h1>
						<ConfigProvider
							renderEmpty={
								filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
							}
						>
							<Table columns={columns} />
						</ConfigProvider>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Merchandising;
