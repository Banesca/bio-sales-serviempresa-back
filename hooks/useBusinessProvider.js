import { useContext, createContext, useState, useEffect } from 'react';

const BusinessContext = createContext();

export function useBusinessProvider() {
	return useContext(BusinessContext);
}

export function BusinessProvider(props) {
	const [business, setBusiness] = useState([]);
	const [selectedBusiness, setSelectedBusiness] = useState({});

	const handleSetBusiness = (business) => {
		setBusiness(business);
	};

	const handleSetSelectedBusiness = (business) => {
		setSelectedBusiness(business);
	};

	useEffect(() => {
		const savedBusiness = JSON.parse(localStorage.getItem('business'));
		const savedSelectedBusiness = JSON.parse(
			localStorage.getItem('selectedBusiness')
		);
		console.log(savedSelectedBusiness, 'savedSelectedBusiness');
		setBusiness(savedBusiness);
		setSelectedBusiness((prev) =>
			savedSelectedBusiness.idSucursal == prev?.idSucursal
				? prev
				: savedSelectedBusiness
		);
	}, [selectedBusiness]);

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
