import { createContext, useContext, useEffect, useReducer } from 'react';
import { useRequest } from './useRequest';

const CategoryContext = createContext();

export function useCategoryContext() {
	return useContext(CategoryContext);
}

const ACTIONS = {
	SET_CATEGORIES: 'getCategories',
	SET_SUB_CATEGORIES: 'getSubCategories',
	SET_LINES: 'getLines',
};

export function CategoriesProvider({ children }) {
	const { requestHandler } = useRequest();

	const INITIAL_STATE = {
		categories: [],
		subCategories: [],
		lines: [],
	};

	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	function reducer(state, action) {
		switch (action.type) {
			case ACTIONS.SET_CATEGORIES:
				return {
					...state,
					categories: action.payload,
				};
			case ACTIONS.SET_SUB_CATEGORIES:
				return {
					...state,
					subCategories: action.payload,
				};
			case ACTIONS.SET_LINES:
				return {
					...state,
					lines: action.payload,
				};
			default:
				return state;
		}
	}

	// Categories
	const getCategories = async (id) => {
		const res = await requestHandler.get(`/api/v2/family/list/${id}`);
		const categories = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
	};

	const deleteCategory = async (categoryId, businessId) => {
		await requestHandler.delete(`/api/v2/family/delete/${categoryId}`);
		await getCategories(businessId);
	};

	const addCategory = async (name, businessId) => {
		await requestHandler.post(`/api/v2/family/add`, {
			name: name,
			order: 0,
			image: null,
			idSucursalFk: businessId,
		});
		await getCategories(businessId);
	};
	// End Categories

	// Sub Categories
	const getSubCategories = async (id) => {
		const res = await requestHandler.get(`/api/v2/subFamily/list/${id}`);
		const subCategories = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_SUB_CATEGORIES, payload: subCategories });
	};

	const addSubCategory = async (body, businessId) => {
		await requestHandler.post(`/api/v2/subfamily/add`, body);
		await getSubCategories(businessId);
	};

	const deleteSubCategory = async (subCategoryId, businessId) => {
		await requestHandler.delete(
			`/api/v2/subfamily/delete/${subCategoryId}`
		);
		await getCategories(businessId);
	};
	// End Sub Categories

	// Lines
	const getLines = async (id) => {
		const res = await requestHandler.get(`/api/v2/line/list/${id}`);
		const lines = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_LINES, payload: lines });
	};
	// End Lines

	return (
		<CategoryContext.Provider
			value={{
				categories: state.categories,
				subCategories: state.subCategories,
				lines: state.lines,
				getCategories,
				addCategory,
				deleteCategory,
				getSubCategories,
				addSubCategory,
				deleteSubCategory,
				getLines,
			}}
		>
			{children}
		</CategoryContext.Provider>
	);
}
