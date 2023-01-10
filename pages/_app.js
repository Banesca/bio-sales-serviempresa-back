import { createContext, useContext, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import axios from 'axios';

import '../styles/globals.css';
import { ipBackOffice } from '../util/environment';
import Loading from '../components/loading';

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

	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<GeneralContext.Provider value={generalData}>
				<Component {...pageProps} />
				<Loading isLoading={loading} />
			</GeneralContext.Provider>
		</ConfigProvider>
	);
}

export default MyApp;
