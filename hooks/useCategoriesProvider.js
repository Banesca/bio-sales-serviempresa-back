/* eslint-disable indent */
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
	SET_CURRENT_CATEGORIES: 'setCategory',
	SET_CURRENT_SUB_CATEGORIES: 'setSubCategory',
	SET_CURRENT_LINES: 'setLine',
};

export function CategoriesProvider({ children }) {
	const { requestHandler } = useRequest();

	const INITIAL_STATE = {
		categories: [],
		currentCategory: {},
		subCategories: [],
		currentSubCategory: {},
		lines: [],
		currentLine: {},
	};

	const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

	function reducer(state, action) {
		switch (action.type) {
			case ACTIONS.SET_CATEGORIES:
				return {
					...state,
					categories: action.payload,
				};
			case ACTIONS.SET_CURRENT_CATEGORIES:
				return {
					...state,
					currentCategory: action.payload,
				};
			case ACTIONS.SET_SUB_CATEGORIES:
				return {
					...state,
					subCategories: action.payload,
				};
			case ACTIONS.SET_CURRENT_SUB_CATEGORIES:
				return {
					...state,
					currentSubCategory: action.payload,
				};
			case ACTIONS.SET_LINES:
				return {
					...state,
					lines: action.payload,
				};
			case ACTIONS.SET_CURRENT_LINES:
				return {
					...state,
					currentLine: action.payload,
				};
			default:
				return state;
		}
	}

	const getCategories = async (id) => {
		const res = await requestHandler.get(`/api/v2/family/list/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const categories = res.value.getValue().response;
		//console.log(categories)
		dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
	};

	const getCategoryById = async (id) => {
		const res = await requestHandler.get(`/api/v2/family/get/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		dispatch({ type: ACTIONS.SET_CURRENT_CATEGORIES, payload: value });
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

	const editCategories = async (name, idS, idP, id,order) => {
		const data= new FormData()
		data.append('idProductFamily', idP);
		data.append('nameSubFamily',name);
		data.append('idStatusFk', idS);
		data.append('order', order); 


		const res = await requestHandler.put('/api/v2/family/update', data, idP);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getCategories(id);
	};

	const addCategory = async (name, businessId) => {
		const res = await requestHandler.post('/api/v2/family/add', {
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

	const getSubCategories = async (id) => {
		const res = await requestHandler.get(`/api/v2/subFamily/list/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const subCategories = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_SUB_CATEGORIES, payload: subCategories });
	};

	const getSubCategoryById = async (id) => {
		const res = await requestHandler.get(`/api/v2/subfamily/get/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		//console.log(value)
		dispatch({ type: ACTIONS.SET_CURRENT_SUB_CATEGORIES, payload: value });
	};

	const editSubCategories = async (
		idProductFamily,
		nameSubFamily,
		idProductSubFamily,
		id,
		order
	) => {
		const data= new FormData()
		data.append('idProductFamilyFk', idProductFamily);
		data.append('nameSubFamily',nameSubFamily);
		data.append('idProductSubFamily', idProductSubFamily);
		data.append('idSucursalFk', id);
		data.append('order', order); 

		const res = await requestHandler.put('/api/v2/subfamily/update', data, id);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		//console.log(res)
		//console.log(data)
		await getSubCategories(id);
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

	const addSubCategory = async (body, businessId) => {
		const res = await requestHandler.post('/api/v2/subfamily/add', body);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getSubCategories(businessId);
	};
	const getLines = async (id) => {
		const res = await requestHandler.get(`/api/v2/line/list/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const lines = res.value.getValue().response;
		dispatch({ type: ACTIONS.SET_LINES, payload: lines });
	};

	const editLines = async (name, subFamily, lineToDelete, id) => {
		const res = await requestHandler.put('/api/v2/line/update', {
			name,
			idSubFamilyFk: subFamily,
			idSucursalFk: lineToDelete.idSucursalFk,
			idLine: lineToDelete.idLine,
		});
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getLines(id);
	};

	const getLineById = async (id) => {
		const res = await requestHandler.get(`/api/v2/line/get/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		dispatch({ type: ACTIONS.SET_CURRENT_LINES, payload: value });
	};

	const addLine = async (body) => {
		const res = await requestHandler.post('/api/v2/line/add', body);
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

	const getTypesPayment = async (type, maxAttempts = 3) => {
		const res = await requestHandler.get('/api/v2/utils/typepayment');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		if (maxAttempts > 0) {
			await getTypesPayment(type, maxAttempts - 1);
		}
	}; 

	return (
		<CategoryContext.Provider
			value={{
				categories: state.categories,
				currentCategory: state.currentCategory,
				subCategories: state.subCategories,
				currentSubCategory: state.currentSubCategory,
				lines: state.lines,
				currentLine: state.currentLine,
				getCategories,
				getCategoryById,
				addCategory,
				deleteCategory,
				getSubCategories,
				getSubCategoryById,
				addSubCategory,
				deleteSubCategory,
				getLines,
				editLines,
				editSubCategories,
				editCategories,
				getLineById,
				addLine,
				deleteLine,
			    getTypesPayment, 
			}}
		>
			{children}
		</CategoryContext.Provider>
	);
}
