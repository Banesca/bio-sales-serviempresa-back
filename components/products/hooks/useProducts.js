import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';

export const MEASURE_UNITS = {
	Kilogramo: 3,
	Unidad:17
};

const PRODUCT_INITIAL_STATE = {
	pricePurchase: 0,
	idUnitMeasurePurchaseFk: 17,
	idTypeProductFk: '1',
	idAdicionalCategoryFk: '0',
	idRestaurantFk: 1,
	is5050: '0',
	Obsequio: '0',
	efectivo: '0',
	linkPago: '0',
	minStock: '0',
	isheavy: '0',
	maxProducVenta: '0',
	maxAditionals: '0',
	minAditionals: '0',
	nameKitchen: '0',
	nameKitchen: '0',
	nameKitchen: '',
	tax: '',
	starts: '5',
	adicionals:'',
	listpromo:'',
};



const setData = (data) => {
	const body = {
		...PRODUCT_INITIAL_STATE,
		nameProduct: data.nameProduct,
		barCode: data.barCode,
		idProductFamilyFk: data.idProductFamilyFk,
		idProductSubFamilyFk: data.idProductSubFamilyFk,
		priceSale: data.priceSale,
		isPromo: data.isPromo,
		marketPrice: data.marketPrice,
		idSucursalFk: data.idSucursalFk,
		idBrandFk: data.idBrandFk,
		idLineFk: data.idLineFk,
		idUnitMeasureSaleFk: data.idUnitMeasureSaleFk,
		unitByBox: data.unitByBox,
		unitweight: data.unitweight,
		observation: data.observation || '',
		cpe: data.cpe,
		ean: data.ean,
		healthRegister: data.healthRegister,
		idProduct: data.idProduct,
		isheavy: data.isheavy,
		maxProducVenta: data.maxProducVenta,
		is5050: data.is5050,
		listpromo:data.listpromo,
		adicionals:data.adicionals,
		idUnitMeasurePurchaseFk:data.idUnitMeasurePurchaseFk
	};

	return body;
};

const setFormData = (product, file = null, update = false) => {
	const formData = new FormData();
	for (const field of Object.entries(product)) {
		if (!update && field[0] == 'idProduct') {
			continue;
		}
		formData.append(field[0], field[1]);
	}
	if (file) {
		if (file) {
			const imgName = file.name.replace(' ', '-');
			formData.append('image', file, imgName);
		}
	}
	return formData;
};

export function useProducts() {
	const { requestHandler } = useRequest();

	const [products, setProducts] = useState([]);
	const [productsInv, setProductsInv] = useState([]);

	const [currentProduct, setCurrentProduct] = useState({});

	const getProducts = async (businessId = 1) => {
		const response = await requestHandler.get(
			`/api/v2/product/list/0/0/${businessId}`
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		const value = response.value.getValue().data;
		setProducts(value);
	};

	const getProductsInv = async (businessId) => {
		const response = await requestHandler.get(
			`/api/v2/product/listint/lite/${businessId}`
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		const value = response.value.getValue().data;
		setProductsInv(value);
		console.log(value)
	};

	const validateBarCode = async (barCode, idSucursalFk) => {
		const res = await requestHandler.post('/api/v2/product/find/bybarcode', {
			barCode,
			idSucursalFk,
		});
		const value = res.value.getValue();
		return !!value.data;
	};

	const validateProductName = async (nameProduct, idSucursalFk) => {
		const res = await requestHandler.post('/api/v2/product/find/name', {
			nameProduct,
			idSucursalFk,
		});
		const value = res.value.getValue();
		return !!value.data;
	};

	const addProduct = async (data, file) => {
		const body = setData(data);
		if (!validateProductName(data.nameProduct, data.idSucursalFk)) {
			throw new Error('El nombre ya se encuentra en uso');
		}
		if (!validateBarCode(data.barCode, data.idSucursalFk)) {
			throw new Error('El código ya se encuentra en uso');
		}
		const formData = setFormData(body, file);
		const res = await requestHandler.post(
			'/api/v2/product/add/sales',

			formData
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getProducts(data.idSucursalFk);
	};

	const getProductById = async (id) => {
		const res = await requestHandler.get(`/api/v2/product/get/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		setCurrentProduct(value);
	};

	const updateProduct = async (data, file) => {
		const body = setData(data);
		const formData = setFormData(body, file, true);
		const res = await requestHandler.put(
			'/api/v2/product/update/sales',
			formData
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const updateProductInv = async (idP, quantity, reference, id) => {
		const res = await requestHandler.post('/api/v2/inventary/adjustment', {
			idProductFk: idP,
			quantity,
			reference,
		});
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		getProductsInv(id);
	};

	const deleteProduct = async (productId, businessId) => {
		const res = await requestHandler.delete(
			`/api/v2/product/delete/${productId}`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getProducts(businessId);
	};

	return {
		products,
		productsInv,
		updateProductInv,
		currentProduct,
		getProducts,
		getProductsInv,
		addProduct,
		getProductById,
		updateProduct,
		deleteProduct,
	};
}
