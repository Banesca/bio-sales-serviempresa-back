import { useContext, createContext, useState, useEffect } from 'react';

const BusinessContext = createContext();

export function useBusinessProvider() {
	return useContext(BusinessContext);
}

export function BusinessProvider(props) {
	const [business, setBusiness] = useState([]);
	const [selectedBusiness, setSelectedBusiness] = useState(null);

	const handleSetBusiness = (business) => {
		setBusiness(business);
	};

	const handleSetSelectedBusiness = (business) => {
		setSelectedBusiness(business);
	};

	useEffect(() => {
		const savedBusiness = localStorage.getItem('business');
		const savedSelectedBusiness = localStorage.getItem('selectedBusiness');
		setBusiness(JSON.parse(savedBusiness));
		setSelectedBusiness(JSON.parse(savedSelectedBusiness));
	}, []);

	return (
		<BusinessContext.Provider
			value={{
				business,
				selectedBusiness,
				handleSetBusiness,
				handleSetSelectedBusiness,
			}}
		>
			{props.children}
		</BusinessContext.Provider>
	);
}
