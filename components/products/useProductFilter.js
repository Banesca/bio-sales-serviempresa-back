import { useCallback, useReducer } from 'react';
import { addKeys } from '../../util/setKeys';

export const INITIAL_QUERY_VALUES = {
	nameProduct: '',
	barCode: '',
	minPrice: 0,
	maxPrice: 0,
	nameFamily: '',
	nameSubFamily: '',
	idLineFk: '',
	idBrandFk: '',
};



const FILTER_ACTIONS = {
	SEARCH: 'search',
	CLEAR: 'clear',
	GET_PRODUCTS: 'get',
	SET_QUERY: 'query',
};

export function useProductFilter() {
	const [productsFilterState, dispatch] = useReducer(reducer, {
		filtered: () => [],
		products: [],
		query: INITIAL_QUERY_VALUES,
	});

	const filterProducts = useCallback((state) => {
		let list = state.products;
		if (state.query.nameProduct) {
			list = list.filter((p) =>
				p.nameProduct
					.toLowerCase()
					.includes(state.query.nameProduct.toLowerCase())
			);
		}
		if (state.query.barCode) {
			list = list.filter((p) => {
				if (!p.barCode) {
					return;
				}
				return p.barCode.includes(state.query.barCode);
			});
		}
		if (state.query.minPrice) {
			list = list.filter(
				(p) => p.priceSale > Number(state.query.minPrice)
			);
		}
		if (state.query.maxPrice) {
			list = list.filter(
				(p) => p.priceSale < Number(state.query.maxPrice)
			);
		}
		if (state.query.nameFamily) {
			list = list.filter(
				(p) => p.idProductFamily === state.query.nameFamily
			);
		}
		if (state.query.nameSubFamily) {
			list = list.filter(
				(p) => p.idProductSubFamily === state.query.nameSubFamily
			);
		}
		if (state.query.idBrandFk) {
			list = list.filter((p) => p.idBrandFk == state.query.idBrandFk);
		}
		if (state.query.idLineFk) {
			list = list.filter((p) => p.idLineFk == state.query.idLineFk);
		}
		addKeys(list);
		return list;
	}, []);

	function reducer(state, action) {
		switch (action.type) {
		case FILTER_ACTIONS.CLEAR:
			return {
				...state,
				query: INITIAL_QUERY_VALUES,
				filtered: () => state.products
			};
		case FILTER_ACTIONS.GET_PRODUCTS:
			return {
				...state,
				products: action.payload,
				filtered: () => action.payload,
			};
		case FILTER_ACTIONS.SEARCH:
			return {
				...state,
				filtered: () => filterProducts(state),
			};

		case FILTER_ACTIONS.SET_QUERY:
			return {
				...state,
				query: action.payload,
			};
		}
	}

	const { filtered } = productsFilterState;

	const setQuery = (query) => {
		dispatch({ type: FILTER_ACTIONS.SET_QUERY, payload: query });
		dispatch({ type: FILTER_ACTIONS.SEARCH });
	};

	const setProduct = (products) => {
		dispatch({ type: FILTER_ACTIONS.GET_PRODUCTS, payload: products });
	};

	const clean = () => {
		dispatch({ type: FILTER_ACTIONS.CLEAR });
		// setQuery(INITIAL_QUERY_VALUES);
	};

	return { setQuery, setProduct, clean, filtered };
}
