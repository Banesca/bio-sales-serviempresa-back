import { createContext, useContext, useReducer } from 'react';
import { useRequest } from './useRequest';

const BrandContext = createContext();

export function useBrandContext() {
	return useContext(BrandContext);
}

const ACTIONS = {
	SET_BRANDS: 'setBrands',
};

export function BrandsProvider({ children }) {
	const { requestHandler } = useRequest();

	const INITIAL_STATE = {
		brands: [],
	};

	function reducer(state, action) {
		switch (action.type) {
			case ACTIONS.SET_BRANDS:
				return {
					...state,
					brands: action.payload,
				};
		}
	}

	const getBrands = async (id) => {
		const res = await requestHandler.get(`/api/v2/brand/list/${id}`);
		console.log(res);
	};

	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	return (
		<BrandContext.Provider value={{ brands: state.brands, getBrands }}>
			{children}
		</BrandContext.Provider>
	);
}
