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
		const value = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_BRANDS, payload: value });
	};

	const addBrand = async (name, idSucursalFk) => {
		const res = await requestHandler.post(`/api/v2/brand/add`, {
			name,
			idSucursalFk,
		});
		if (res.isLeft()) {
			throw new Error();
		}
		await getBrands(idSucursalFk);
	};

	const deleteBrand = async (brandId, businessId) => {
		const res = await requestHandler.delete(`/api/v2/brand/delete/${brandId}`);
		if (res.isLeft()) {
			throw new Error(res.value.getErrorValue());
		}
		await getBrands(businessId);
	};

	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	return (
		<BrandContext.Provider
			value={{ brands: state.brands, getBrands, addBrand, deleteBrand }}
		>
			{children}
		</BrandContext.Provider>
	);
}
