import '../styles/globals.css';
import { createContext, useContext, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import axios from 'axios';

import { ipBackOffice } from '../util/environment';
import Loading from '../components/loading';
import { BusinessProvider } from '../hooks/useBusinessProvider';

export const GeneralContext = createContext();

function MyApp({ Component, pageProps }) {
	const [generalData, setGeneralData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function setBusiness(business = 'demo') {
			try {
				const response = await axios.get(
					`${ipBackOffice}/customer/byname/${business}`
				);
				setGeneralData(response.data.restaurante);
			} catch (error) {
				console.log(error);
			}
		}
		setBusiness();
		setLoading(false);
	}, []);

	console.log(generalData);

	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<GeneralContext.Provider value={generalData}>
				<BusinessProvider>
					<Component {...pageProps} />
					<Loading isLoading={loading} />
				</BusinessProvider>
			</GeneralContext.Provider>
		</ConfigProvider>
	);
}

export default MyApp;
