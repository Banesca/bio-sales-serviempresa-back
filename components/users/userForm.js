import PropTypes from 'prop-types';
import { Button, Col, Row, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import Loading from '../shared/loading';
import { useRouter } from 'next/router';
import { useRequest } from '../../hooks/useRequest';
import { useUser } from './hooks/useUser';
import { PROFILES, PROFILE_LIST } from '../shared/profiles';
import { LeftOutlined } from '@ant-design/icons';

const UserForm = ({
	user,
	update,
	submitFunction,
	business,
	userBusiness,
	pin,
}) => {
	const { requestHandler } = useRequest();

	const { findUserByEmail } = useUser();

	const [userData, setUserData] = useState({
		fullname: user.fullname || '',
		mail: user.mail || '',
		pin: pin || '',
		idProfileFk: user.idProfileFk || null,
	});

	const regexpTlp =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.;])[A-Za-z\d$@$!%*?&]{8,15}/;
	const [loading, setLoading] = useState(false);
	const [businessByUser, setBusinessByUser] = useState(userBusiness);
	const [click, setClick] = useState(false);

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
		click ? setClick(false) : setClick(true);
	};

	useEffect(() => {
		click ? onReset() : '';
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [click]);

	const router = useRouter();

	const handleAsigne = async (userId, businessId) => {
		const res = await requestHandler.post('/api/v2/user/branch/add', {
			idUserFk: userId,
			idSucursalFk: businessId,
		});
		if (res.isLeft()) {
			setLoading(false);
			message.error('Ha ocurrido un error al asignar empresa');
		}
	};

	const handleFindUser = async (email) => {
		try {
			return await findUserByEmail(email);
		} catch (error) {
			message.error('Error al encontrar usuario');
		}
	};

	const onSubmit = async () => {
		try {
			setLoading(true);
			await submitFunction(userData);
			if (
				!update &&
				(userData.idProfileFk == PROFILES.SELLER ||
					userData.idProfileFk == PROFILES.ADMIN ||
					userData.idProfileFk == PROFILES.BILLER)
			) {
				const user = await handleFindUser(userData.mail);
				if (!user) {
					return message.error('Error al asignar permisos');
				}
				for (const business of businessByUser) {
					await handleAsigne(user.idUser, business);
				}
			}
			message.success(update ? 'Usuario actualizado' : 'Usuario agregado');
			router.push('/dashboard/users');
		} catch (error) {
			message.error(
				update
					? `${error.response.data.status}`
					: `${error.response.data.status}`
			);
		} finally {
			setLoading(false);
		}
	};

	if (!user && update) {
		return <Loading isLoading={true} />;
	}

	const handleReturn = () => {
		router.push('/dashboard/users');
		setLoading(true);
	};

	return (
		<div style={{ overfl: 'scroll' }}>
			<section
				style={{
					textAlign: 'center',
					fontSize: '2.5rem',
					display: 'flex',
					width: '100%',
					backgroundColor: 'white !important',
				}}
			>
				<Button
					style={{ marginRight: '48%', height: '42px', borderRadius: '20px' }}
					onClick={handleReturn}
				>
					<LeftOutlined style={{ fontSize: '1.5rem', marginRight: '50%' }} />
				</Button>
				<h2
					style={{ fontSize: '2.8rem', marginTop: '0px', marginLeft: '-180px' }}
				>
					{update ? 'Editar Usuario' : 'Agregar Usuario'}
				</h2>
			</section>
			<div
				style={{
					width: '100%',
					maxWidth: '100%',
					margin: '.5rem auto',
					padding: '60px',
					borderRadius: '20px',
					boxShadow: '6px 6px 10px rgba(180, 180, 180, 0.479)',
				}}
			>
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
						Repit: userData.pin,
						business: userBusiness,
					}}
					form={form}
				>
					<Form.Item
						label="Nombre y apellido"
						name="fullname"
						rules={[{ required: true, message: 'Ingresa un nombre y apellido' }]}
					>
						<Input
							autoComplete="none"
							type="text"
							name="fullname"
							value={userData.fullname}
							onChange={handleChange}
						/>
					</Form.Item>
					<Form.Item
						label="Correo"
						autoComplete="none"
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
							{PROFILE_LIST.map((p) => {
								if (p.id === 1) {
									return;
								}
								return (
									<Select.Option key={p.id} value={p.id}>
										{p.name}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
					{!update && userData.idProfileFk && (
						<Form.Item
							label="Empresas"
							name="business"
							rules={[
								{
									required:
										!update &&
										(userData.idProfileFk == PROFILES.SELLER ||
											userData.idProfileFk == PROFILES.BILLER ||
											userData.idProfileFk == PROFILES.ADMIN ||
											userData.idProfileFk == PROFILES.MERCHANDISER),
									message: 'Elige una empresa',
								},
							]}
						>
							<Select
								value={businessByUser}
								mode={userData.idProfileFk === PROFILES.SELLER && 'multiple'}
								onChange={(value) => {
									if (Array.isArray(value)) {
										setBusinessByUser(value);
									} else {
										setBusinessByUser([value]);
									}
								}}
							>
								{business.map((p) => (
									<Select.Option key={p.idSucursal} value={p.idSucursal}>
										{p.nombre}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					)}
					<Form.Item
						label="Contraseña"
						autoComplete="none"
						name="pin"
						rules={[
							{
								min: 8,
								message: 'Escribe una contraseña de minimo 8 caracteres',
							},
							{
								pattern: regexpTlp,
								message:
									'Las contraseña debe tener: de 8 a 16 caracteres, 1 mayuscula, 1 minuscula y 1 caracter especial',
							},
						]}
					>
						<Input.Password
							type="password"
							name="pin"
							value={userData.pin}
							onChange={handleChange}
						/>
					</Form.Item>
					<Form.Item
						label="Repetir contraseña"
						name="Repit"
						autoComplete="none"
						dependencies={['pin']}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('pin') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error('Las dos contraseñas no son iguales')
									);
								},
							}),
						]}
					>
						<Input.Password
							type="password"
							name="Repit"
							value={pin}
							onChange={handleChange}
						/>
					</Form.Item>

					<Row>
						<Col span={12}>
							<Form.Item
								wrapperCol={{
									span: 12,
									offset: 12,
								}}
							>
								<Button type="warning" block onClick={onReset}>
									Limpiar
								</Button>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item wrapperCol={{ span: 12, offset: 12 }}>
								<Button htmlType="submit" type="success" block>
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
