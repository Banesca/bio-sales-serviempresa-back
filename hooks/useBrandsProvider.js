import { createContext, useContext, useReducer } from 'react';
import { useRequest } from './useRequest';

const BrandContext = createContext();

export function useBrandContext() {
	return useContext(BrandContext);
}

const ACTIONS = {
	SET_BRANDS: 'setBrands',
	SET_CURRENT_BRANS: 'setCurrentBrand',
};

export function BrandsProvider({ children }) {
	const { requestHandler } = useRequest();

	const INITIAL_STATE = {
		brands: [],
		currentBrand: {},
	};

	function reducer(state, action) {
		switch (action.type) {
			case ACTIONS.SET_BRANDS:
				return {
					...state,
					brands: action.payload,
				};
			case ACTIONS.SET_CURRENT_BRANS:
				return {
					...state,
					currentBrand: action.payload,
				};
		}
	}

	const getBrands = async (id) => {
		const res = await requestHandler.get(`/api/v2/brand/list/${id}`);
		const value = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_BRANDS, payload: value });
	};

	const getBrandById = async (id) => {
		const res = await requestHandler.get(`/api/v2/brand/get/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		dispatch({ type: ACTIONS.SET_CURRENT_BRANS, payload: value });
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
		const res = await requestHandler.delete(
			`/api/v2/brand/delete/${brandId}`
		);
		if (res.isLeft()) {
			throw new Error(res.value.getErrorValue());
		}
		await getBrands(businessId);
	};

	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	return (
		<BrandContext.Provider
			value={{
				brands: state.brands,
				currentBrand: state.currentBrand,
				getBrands,
				getBrandById,
				addBrand,
				deleteBrand,
			}}
		>
			{children}
		</BrandContext.Provider>
	);
}
