import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../components/layout';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/loading';
import {
	Button,
	Col,
	Collapse,
	Row,
	Table,
	Form,
	Input,
	Modal,
	message,
} from 'antd';
import { Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const BrandsPage = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameSubFamily',
			key: 1,
			render: (text) => text,
		},
		{
			title: 'Acciones',
			key: 2,
			render: (_, item) => (
				<Button
					danger
					type="primary"
					onClick={() => handleOpenDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];


	const getCategoriesRequest = async (id) => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/family/list/${id}`);
		if (res.isLeft()) {
			return;
		}
		setCategories(res.value.getValue().response);
		setLoading(false);
	};

	const getBrandsRequest = async (id) => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/subFamily/list/${id}`);
		if (res.isLeft()) {
			return;
		}
		let value = res.value.getValue().response;
		value = value.filter((b) => b.idStatus === 1);
		setBrands(value);
		setLoading(false);
	};

	const brandsList = useMemo(() => {
		let list = brands;
		if (query) {
			list = brands.filter((b) =>
				b.nameSubFamily
					.toLowerCase()
					.includes(query.toLocaleLowerCase())
			);
		}
		if (selectedCategory) {
			list = brands.filter((b) => b.idProductFamily === selectedCategory);
		}
		return list;
	}, [brands, query, selectedCategory]);

	useEffect(() => {
		console.log(query);
		console.log(selectedCategory);
		console.log(brandsList);
	}, [query, selectedCategory, brandsList]);

	useEffect(() => {
		if (generalContext && selectedBusiness) {
			getBrandsRequest(selectedBusiness.idSucursal);
			getCategoriesRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);


	return (
		<DashboardLayout>
		</DashboardLayout>
	);
};

export default BrandsPage;
