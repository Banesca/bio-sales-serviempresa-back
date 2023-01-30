import PropTypes from 'prop-types';
import { Button, Col, Row, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import Loading from '../loading';
import { Router, useRouter } from 'next/router';
import { useRequest } from '../../hooks/useRequest';

const UserForm = ({ user, update, submitFunction, business, userBusiness }) => {
	const { requestHandler } = useRequest();

	const [userData, setUserData] = useState({
		fullname: user.fullname || '',
		mail: user.mail || '',
		pin: user.pin || '',
		idProfileFk: user.idProfileFk || null,
	});

	const [loading, setLoading] = useState(false);
	const [businessByUser, setBusinessByUser] = useState(userBusiness);

	const profileList = [
		{ name: 'Administrador', id: 1 },
		{ name: 'Facturador', id: 2 },
		{ name: 'Vendedor', id: 3 },
	];

	const handleChange = (e) => {
		setUserData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}));
	};

	const [form] = Form.useForm();
	const onReset = () => {
		setUserData({
			fullname: '',
			mail: '',
			pin: '',
			idProfileFk: null,
		});
		form.resetFields();
	};

	const router = useRouter();

	// User business
	const handleAsigne = async (userId, businessId) => {
		const res = await requestHandler.post(`/api/v2/user/branch/add`, {
			idUserFk: userId,
			idSucursalFk: businessId,
		});
		if (res.isLeft()) {
			setLoading(false);
			message.error('Ha ocurrido un error al asignar empresa');
		}
	};
	// User business End

	useEffect(() => {
		console.log(businessByUser);
	}, [businessByUser]);

	const onSubmit = async () => {
		setLoading(true);
		await submitFunction(userData);
		if (!update) {
			// for (const business of businessByUser) {
			// 	await handleAsigne(user.idUser, business);
			// }
			onReset();
			setLoading(false);
			return;
		}
		message.success(update ? 'Usuario actualizado' : 'Usuario agregado');
		setLoading(false);
		router.push('/dashboard/users');
	};

	if (!user && update) {
		return <Loading isLoading={true} />;
	}

	return (
		<div>
			<div
				style={{
					maxWidth: '500px',
					margin: '4rem auto',
				}}
			>
				<h1
					style={{
						color: 'white',
						fontSize: '2rem',
						textAlign: 'center',
					}}
				>
					{update ? 'Actualizar Usuario' : 'Agregar Usuario'}
				</h1>
				<Form
					name="addProduct"
					labelCol={{ span: 6 }}
					onFinish={onSubmit}
					autoComplete="off"
					initialValues={{
						fullname: userData.fullname,
						mail: userData.mail,
						idProfileFk: userData.idProfileFk,
						pin: userData.pin,
						business: userBusiness,
					}}
					form={form}
				>
					<Form.Item
						label="Nombre"
						name="fullname"
						rules={[
							{ required: true, message: 'Ingresa un nombre' },
						]}
					>
						<Input
							type="text"
							name="fullname"
							value={userData.fullname}
							onChange={handleChange}
						/>
					</Form.Item>
					<Form.Item
						label="Correo"
						name="mail"
						rules={[
							{
								required: true,
								message: 'Ingresa un email',
							},
							{
								type: 'email',
								message: 'Ingresa un email valido',
							},
						]}
					>
						<Input
							type="text"
							name="mail"
							value={userData.mail}
							onChange={handleChange}
						/>
					</Form.Item>
					{!update && (
						<Form.Item
							label="Contraseña"
							name="pin"
							rules={[
								{
									required: true,
									message: 'Ingresa una contraseña',
								},
							]}
						>
							<Input
								type="password"
								name="pin"
								value={userData.pin}
								onChange={handleChange}
							/>
						</Form.Item>
					)}
					<Form.Item
						label="Perfil"
						name="idProfileFk"
						rules={[
							{
								required: true,
								message: 'Elige un perfil',
							},
						]}
					>
						<Select
							value={userData.idProfileFk}
							onChange={(value) =>
								setUserData((prev) => ({
									...prev,
									idProfileFk: value,
								}))
							}
						>
							{profileList.map((p) => (
								<Select.Option key={p.id} value={p.id}>
									{p.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					{!update && (
						<Form.Item label="Empresas" name="business">
							<Select
								value={businessByUser}
								mode="multiple"
								onChange={(value) => setBusinessByUser(value)}
							>
								{business.map((p) => (
									<Select.Option
										key={p.idSucursal}
										value={p.idSucursal}
									>
										{p.nombre}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					)}
					<Row>
						<Col span={12}>
							<Form.Item
								wrapperCol={{
									span: 12,
									offset: 12,
								}}
							>
								<Button block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ span: 12, offset: 12 }}>
								<Button htmlType="submit" type="primary" block>
									{update ? 'Actualizar' : 'Agregar'}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
			<Loading isLoading={loading} />
		</div>
	);
};

UserForm.propTypes = {
	update: PropTypes.bool.isRequired,
	user: PropTypes.object,
	submitFunction: PropTypes.func.isRequired,
	userBusiness: PropTypes.arrayOf(PropTypes.number),
};

export default UserForm;
