import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../../../components/layout';
import UserForm from '../../../../components/users/userForm';
import Loading from '../../../../components/loading';
import { useRouter } from 'next/router';
import { useRequest } from '../../../../hooks/useRequest';
import { GeneralContext } from '../../../_app';
import { message } from 'antd';

const UpdateUser = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});

	const router = useRouter();
	const { id } = router.query;

	const getUserRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/${id}`);
		if (res.isLeft()) {
			console.log(res);
			setLoading(false);
			return;
		}
		console.log(res);
		console.log('RESPONSE', res.value.getValue().data[0]);
		const value = res.value.getValue().data[0];
		setUser(value);
		setLoading(false);
	};

	const { requestHandler } = useRequest();
	const updateUserRequest = async (data) => {
		const res = await requestHandler.put('/api/v2/user/edit/lite', {
			fullname: data.fullname,
			mail: data.mail,
			idProfileFk: data.idProfileFk,
			idUser: id,
		});
		if (res.isLeft()) {
			console.log(res);
			message.error('Ha ocurrido un error');
			return;
		}
		console.log(res);
	};

	const generalContext = useContext(GeneralContext);
	useEffect(() => {
		if (generalContext && id) {
			getUserRequest(id);
		}
	}, [generalContext, id]);

	console.log(user);

	if (loading) {
		return (
			<DashboardLayout>
				<Loading isLoading={loading} />
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<UserForm
				requestHandler={updateUserRequest}
				update={true}
				user={user}
			/>
		</DashboardLayout>
	);
};

export default UpdateUser;
