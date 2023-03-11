import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../../../components/shared/layout';
import UserForm from '../../../../components/users/userForm';
import Loading from '../../../../components/shared/loading';
import { useRouter } from 'next/router';
import { useRequest } from '../../../../hooks/useRequest';
import { GeneralContext } from '../../../_app';
import { message } from 'antd';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';
import { useUser } from '../../../../components/users/hooks/useUser';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';

const UpdateUser = () => {
	const { loading, setLoading } = useLoadingContext();
	const [user, setUser] = useState({});
	const [businessByUser, setBusinessByUser] = useState([]);

	const router = useRouter();
	const { id } = router.query;

	const { requestHandler } = useRequest();

	const { getUserById, updateUser, upPass } = useUser();

	const getUserRequest = async (id) => {
		setLoading(true);
		try {
			const user = await getUserById(id);
			if (!user) {
				message.error('Usuario no encontrado');
			}
			setUser(user);
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	const getUserBusiness = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${userId}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setBusinessByUser(value.map((b) => b.idSucursal));
	};

	const updateUserRequest = async (data) => {
		await updateUser(data, id);
		console.log(data);
		await upPass(id, data)
	};

	const generalContext = useContext(GeneralContext);
	const { business } = useBusinessProvider();

	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length > 0 && id) {
			getUserRequest(id);
			getUserBusiness(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, id]);

	return (
		<DashboardLayout>
			{loading ? (
				<Loading isLoading={loading} />
			) : (
				<UserForm
					business={business}
					submitFunction={updateUserRequest}
					update={true}
					user={user}
					userBusiness={businessByUser}
				/>
			)}
		</DashboardLayout>
	);
};

export default UpdateUser;
