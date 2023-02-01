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
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const categories = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
	};

	const deleteCategory = async (categoryId, businessId) => {
		const res = await requestHandler.delete(
			`/api/v2/family/delete/${categoryId}`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getCategories(businessId);
	};

	const addCategory = async (name, businessId) => {
		const res = await requestHandler.post(`/api/v2/family/add`, {
			name: name,
			order: 0,
			image: null,
			idSucursalFk: businessId,
		});
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getCategories(businessId);
	};
	// End Categories

	// Sub Categories
	const getSubCategories = async (id) => {
		const res = await requestHandler.get(`/api/v2/subFamily/list/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const subCategories = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_SUB_CATEGORIES, payload: subCategories });
	};

	const addSubCategory = async (body, businessId) => {
		const res = await requestHandler.post(`/api/v2/subfamily/add`, body);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getSubCategories(businessId);
	};

	const deleteSubCategory = async (subCategoryId, businessId) => {
		const res = await requestHandler.delete(
			`/api/v2/subfamily/delete/${subCategoryId}`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getCategories(businessId);
	};
	// End Sub Categories

	// Lines
	const getLines = async (id) => {
		const res = await requestHandler.get(`/api/v2/line/list/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const lines = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_LINES, payload: lines });
	};

	const addLine = async (body) => {
		const res = await requestHandler.post(`/api/v2/line/add`, body);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getLines(body.idSucursalFk);
	};

	const deleteLine = async (id, businessId) => {
		const res = await requestHandler.delete(`/api/v2/line/delete/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getLines(businessId);
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
				addLine,
				deleteLine,
			}}
		>
			{children}
		</CategoryContext.Provider>
	);
}
