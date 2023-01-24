import React from 'react';

const AuthContext = React.createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = React.useState({
		token: '',
	});

	const setUserAuthInfo = (token) => {
		localStorage.setItem('token', token);

		setAuthState({
			token,
		});
	};

	// checks if the user is authenticated or not
	const isUserAuthenticated = () => {
		if (!authState.token) {
			return false;
		}
	};

	return (
		<Provider
			value={{
				authState,
				setAuthState: (userAuthInfo) => setUserAuthInfo(userAuthInfo),
				isUserAuthenticated,
			}}
		>
			{children}
		</Provider>
	);
};

export { AuthContext, AuthProvider };
