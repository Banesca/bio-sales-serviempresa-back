import DashboardLayout from '../../../components/shared/layout';
import UserForm from '../../../components/users/userForm';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import { useUser } from '../../../components/users/hooks/useUser';

export const AddUserPage = () => {
	const { business } = useBusinessProvider();

	const { addUser } = useUser()

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
				submitFunction={addUser}
				business={business}
			/>
		</DashboardLayout>
	);
};

export default AddUserPage;
