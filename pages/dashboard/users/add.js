import { message } from 'antd';
import DashboardLayout from '../../../components/layout';
import UserForm from '../../../components/users/userForm';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { useRequest } from '../../../hooks/useRequest';
import { useEffect, useState } from 'react';
import Loading from '../../../components/loading';

export const AddUserPage = () => {
	const { requestHandler } = useRequest();
	const { business } = useBusinessProvider();

	const AddUserRequest = async (data) => {
		const res = await requestHandler.post('/api/v2/user/add', data);
		if (res.isLeft()) {
			console.log(res);
			message.error('Ha ocurrido un error');
			return;
		}
		console.log(res);
	};

	if (!business) {
		return (
			<DashboardLayout>
				<Loading isLoading={true} />
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<UserForm
				update={false}
				user={{}}
				submitFunction={AddUserRequest}
				business={business}
			/>
		</DashboardLayout>
	);
};

export default AddUserPage;
