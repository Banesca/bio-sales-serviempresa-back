import '../styles/globals.css';
import '../styles/style.css';
import { createContext, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import axios from 'axios';

import { ipBackOffice } from '../util/environment';
import Loading from '../components/shared/loading';
import { BusinessProvider } from '../hooks/useBusinessProvider';
import { useRouter } from 'next/router';
import { CategoriesProvider } from '../hooks/useCategoriesProvider';
import { BrandsProvider } from '../hooks/useBrandsProvider';
import { LoadingProvider } from '../hooks/useLoadingProvider';
import { ProfileProvider } from '../context/useUserProfileProvider';

export const GeneralContext = createContext();

function MyApp({ Component, pageProps }) {
	const [generalData, setGeneralData] = useState({});
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	async function setBusiness(business = 'demo') {
		try {
			const response = await axios.get(
				`${ipBackOffice}/customer/byname/${business}`
			);
			setGeneralData(response.data.restaurante);
		} catch (error) {
			error;
		}
	}

	useEffect(() => {
		setBusiness();
		setLoading(false);
	}, []);

	useEffect(() => {
		const path = router.pathname;
		if (path.includes('/dashboard')) {
			const token = localStorage.getItem('accessToken');
			!token && router.push('/login');
		}
	}, [router.pathname]);

	return (
		<ConfigProvider
			theme={{
				algorithm: theme.defaultAlgorithm,
				token: {
					colorPrimary: '#0984e3',
					colorError: '#d00',
				},
			}}
		>
			<GeneralContext.Provider value={generalData}>
				<ProfileProvider>
					<BusinessProvider>
						<CategoriesProvider>
							<BrandsProvider>
								<LoadingProvider>
									<Component {...pageProps} />
									<Loading isLoading={loading} />
								</LoadingProvider>
							</BrandsProvider>
						</CategoriesProvider>
					</BusinessProvider>
				</ProfileProvider>
			</GeneralContext.Provider>
		</ConfigProvider>
	);
}

export default MyApp;
