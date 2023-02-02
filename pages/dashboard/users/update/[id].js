import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../../../components/shared/layout';
import UserForm from '../../../../components/users/userForm';
import Loading from '../../../../components/shared/loading';
import { useRouter } from 'next/router';
import { useRequest } from '../../../../hooks/useRequest';
import { GeneralContext } from '../../../_app';
import { message } from 'antd';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';

const UpdateUser = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [businessByUser, setBusinessByUser] = useState([]);

	const router = useRouter();
	const { id } = router.query;

	const { requestHandler } = useRequest();

	const getUserRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/${id}`);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		const value = res.value.getValue().data[0];
		setUser(value);
		setLoading(false);
	};

	const updateUserRequest = async (data) => {
		const res = await requestHandler.put('/api/v2/user/edit/lite', {
			fullname: data.fullname,
			mail: data.mail,
			idProfileFk: data.idProfileFk,
			idUser: id,
		});
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
	};

	const getUserBusiness = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/branch/${userId}`);
		console.log(res);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setBusinessByUser(value.map((b) => b.idSucursal));
	};

	const generalContext = useContext(GeneralContext);
	const { business } = useBusinessProvider();

	useEffect(() => {
		if (Object.keys(generalContext).length > 0 && id) {
			getUserRequest(id);
			getUserBusiness(id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, id]);

	if (loading || !business) {
		return (
			<>
				<DashboardLayout></DashboardLayout>
				<Loading isLoading={loading} />
			</>
		);
	}

	return (
		<DashboardLayout>
			<UserForm
				business={business}
				submitFunction={updateUserRequest}
				update={true}
				user={user}
				userBusiness={businessByUser}
			/>
		</DashboardLayout>
	);
};

export default UpdateUser;
