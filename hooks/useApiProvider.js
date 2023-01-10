import { useState } from 'react';
import { ipBackOffice } from '../util/environment';

const ApiContext = React.createContext();

export const ApiProvider = (props) => {
	const [apiData, setApiData] = useState();

	useEffect(() => {
		async function setApi(business = 'demo') {
			try {
				const response = await axios.get(
					`${ipBackOffice}/customer/byname/${business}`
				);
				setApiData(response.data.restaurante);
			} catch (error) {
				console.log(error);
			}
		}
		setApi();
	}, []);

	return (
		<ApiContext.Provider value={apiData}>
			{props.children}
		</ApiContext.Provider>
	);
};
