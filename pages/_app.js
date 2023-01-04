import { ConfigProvider, theme } from 'antd';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<Component {...pageProps} />
		</ConfigProvider>
	);
}

export default MyApp;
