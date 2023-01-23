import { message } from 'antd';
import DashboardLayout from '../../../components/layout';
import UserForm from '../../../components/users/userForm';
import { useRequest } from '../../../hooks/useRequest';

export const AddUserPage = () => {
	const { requestHandler } = useRequest();
	const AddUserRequest = async (data) => {
		const res = await requestHandler.post('/api/v2/user/add', data);
		if (res.isLeft()) {
			console.log(res);
			message.error('Ha ocurrido un error');
			return;
		}
		console.log(res);
	};

	return (
		<DashboardLayout>
			<UserForm
				update={false}
				user={{}}
				requestHandler={AddUserRequest}
			/>
		</DashboardLayout>
	);
};

export default AddUserPage;
