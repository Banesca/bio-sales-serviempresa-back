import React from 'react';
import { useRouter } from 'next/router';

const ProfileContext = React.createContext();
const { Provider } = ProfileContext;

export function useAuthContext() {
	return React.useContext(ProfileContext);
}

export const ProfileProvider = ({ children }) => {
	const [userProfile, setUserProfile] = React.useState(null);

	const router = useRouter();

	React.useEffect(() => {
		const profile = localStorage.getItem('userProfile');
		if (!profile) {
			router.push('/login');
		}
		setUserProfile((prev) => (prev == profile ? prev : profile));
	}, [userProfile]);

	return (
		<Provider
			value={{
				userProfile,
			}}
		>
			{children}
		</Provider>
	);
};
