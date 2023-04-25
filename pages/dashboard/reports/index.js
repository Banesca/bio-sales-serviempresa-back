import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Button,
	List,
	Table,
	Modal,
	Form,
	Select,
	message,
	Input,
	DatePicker,
} from 'antd';
import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useUser } from '../../../components/users/hooks/useUser';
import useClients from '../../../components/clients/hooks/useClients';
import Link from 'next/link';
import { PROFILES, PROFILE_LIST } from '../../../components/shared/profiles';
import Title from '../../../components/shared/title';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import { useRequest } from '../../../hooks/useRequest';
import { UserOutlined } from '@ant-design/icons';
import SelectBusiness from '../../../components/business/selectBusiness';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeTwoTone,
	UploadOutlined,
} from '@ant-design/icons';

const UserDetail = () => {
	const columns = [
		{
			title: 'Sucursal',
			width: '200px',
			dataIndex: 'nombre',
			responsive: ['md'],
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Fecha',
			width: '200px',
			dataIndex: 'created_at',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Total',
			align: 'center',
			width: '200px',
			dataIndex: 'total',
			responsive: ['lg'],
			key: 5,
			render: (text) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>${text}</div>
				);
			},
		},
		/* {
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space size="small" style={{justifyContent: 'center', display: 'flex'}}>
					<Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(
								`/dashboard/products/${product.idProduct}`
							);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						onClick={() => {
							setLoading(true);
							router.push(
								`/dashboard/products/update/${product.idProduct}`
							);
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
					</Button>
				</Space>
			),
		}, */
	];

	const reportsSelect = [
		'Ventas generales por sucursal',
		'Detallado de productos vendidos',
	];
	const { requestHandler } = useRequest();
	const { loading, setLoading } = useLoadingContext();
	const generalContext = useContext(GeneralContext);

	const [report, setReport] = useState();
	/* const [sells, setSells] = useState([{
		created_at: '2023-03-27',
		total: 10,
		nombre: 'Principal'
	}]); */

	const [sells, setSells] = useState();

	const getReports = async () => {
		const res = await requestHandler.post('/api/v2/report/totals');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value._value.response[0];
		setReport(value);
	};

	const getReportsBySuc = async () => {
		const res = await requestHandler.post('/api/v2/report/venta/general', {
			dateEnd: '2023-3-27',
			dateStart: '2023-3-27',
		});
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value._value.response;
		setSells(value);
	};

	useEffect(() => {
		const id = localStorage.getItem('userId');
		if (Object.keys(generalContext).length) {
			getReports();
			getReportsBySuc();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const handleSelect = (value) => {
		if (value.value == 'Detallado de productos vendidos') {
			setProductsSelling(true);
		} else {
			setProductsSelling(false);
		}
	};

	const [filterForm] = Form.useForm();
	const [reportSearch, setReportSearch] = useState();
	const [productsSelling, setProductsSelling] = useState(false);

	const onSubmit = (value) => {
		setReportSearch(value);
	};
	return (
		<>
			<DashboardLayout>
				<h1
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
						fontSize: '3rem',
						gap: '20px',
						margin: '0px',
					}}
				>
					Reportes
				</h1>
				<div
					style={{
						gap: '15px',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<List
						style={{
							width: '95%',
							borderRadius: '15px',
							marginTop: '1rem',
							marginBottom: '1rem',
							backgroundColor: 'white',
							boxShadow: '4px 3px 8px 2px #9c9c9c5d',
						}}
					>
						<List.Item style={{ display: 'flex', justifyContent: 'center' }}>
							<h1
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
									fontSize: '1.6rem',
									gap: '20px',
									margin: '0px',
								}}
							>
								Ventas totales
							</h1>
						</List.Item>

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
					<List
						style={{
							width: '95%',
							borderRadius: '15px',
							marginBottom: '1rem',
							backgroundColor: 'white',
							boxShadow: '4px 3px 8px 2px #9c9c9c5d',
						}}
					>
						<h1
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
								fontSize: '1.6rem',
								margin: '10px',
							}}
						>
							Reportes generales de:
						</h1>
						<List.Item
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								gap: '25px',
							}}
						>
							{productsSelling ? <SelectBusiness /> : <></>}
							<Form
								onFinish={onSubmit}
								form={filterForm}
								style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}
							>
								<Form.Item
									name="selectValue"
									rules={[
										{
											required: true,
											message: 'Selecciona un reporte',
										},
									]}
								>
									<Select
										style={{ width: '270px' }}
										placeholder="Tipo de reporte"
										labelInValue
										onChange={handleSelect}
									>
										{reportsSelect.map((r, index) => {
											return (
												<Select.Option key={index} value={r}>
													{r}
												</Select.Option>
											);
										})}
									</Select>
								</Form.Item>
								<Form.Item name="date">
									<DatePicker.RangePicker
										placeholder={['Fecha inicial', 'Fecha final']}
									/>
								</Form.Item>

								<Button type="success" htmlType="submit">
									Generar reporte
								</Button>
							</Form>
						</List.Item>
						<List.Item>
							<Table
								style={{ width: '100%' }}
								columns={columns}
								dataSource={sells}
								loading={loading}
							/>
						</List.Item>

						{/* <List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Acciones</p>
							<Button type='default'>Exportar</Button>
						</List.Item>
						<List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Promedio de ticket:</p>
							<p>{`$${report.promedioTicket}`}</p>
						</List.Item >
						<List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Promedio hoy:</p>
							<p>{`$${report.promedioHoy}`}</p>
						</List.Item>
						<List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Total de tickets:</p>
							<p>{`${report.totalTicket}`}</p>
						</List.Item>
						<List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Venta de ayer:</p>
							<p>{`$${report.ventaAyer}`}</p>
						</List.Item>
						<List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Venta de hoy:</p>
							<p>{`$${report.ventaHoy}`}</p>
						</List.Item>
						<List.Item style={{padding: '15px 40px', justifyContent: 'space-between', fontSize: '18px'}}>
							<p style={{fontWeight: 'bold'}}>Pedidos anulados:</p>
							<p>{`${report.totalAnulados}`}</p>
						</List.Item> */}
					</List>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default UserDetail;
