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
import useClients from '../components/clients/hooks/useClients';
import { useRequest } from '../hooks/useRequest';


export const GeneralContext = createContext();

function MyApp({ Component, pageProps }) {
	const [generalData, setGeneralData] = useState({});
	const [loading, setLoading] = useState(true);
	const { clients, listClients, deleteClient } = useClients();
	const router = useRouter();
	const { requestHandler } = useRequest();
	/* async function setBusiness(business = 'serviempresa') {
		try {
			const response = await axios.get(
				`${ipBackOffice}/customer/byname/${business}`
			);
			setGeneralData(response.data.restaurante);
			await localStorage.setItem(
				'apiPort',
				response.data?.restaurante?.api_port
			);
		} catch (error) {
			error;
		}
	} */
 
	async function setBusiness(business = 'demo') {
		try {
			const response = await axios.get(
				`${ipBackOffice}/customer/byname/${business}`
			);

			setGeneralData(response.data.restaurante);
			await localStorage.setItem(
				'apiPort',
				response.data?.restaurante?.api_port
			);
		} catch (error) {
			error;
		}
	}

	useEffect(() => {
		setBusiness();
		setLoading(false);
		console.log(generalData)

	}, []);

	useEffect(() => {
	console.log(generalData)
		//getSucursales()
	}, [generalData]);

	/*const getSucursales = async () => {
		const res = await requestHandler.get(`/api/v2/reportvisit/list/1/:100`);
		console.log(res);
	};*/

	/*useEffect(() => {
		setBusiness();
		setLoading(false);
		console.log('hola mundo')
	}, []);

*/

	useEffect(() => {
		const path = router.pathname;
		if (path.includes('/dashboard')) {
			const token = localStorage.getItem('accessToken');
			!token && router.push('/login');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
