import { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/loading';
import { Tabs } from 'antd';
import { message } from 'antd';
import CategoryContainer from '../../../components/categories/categoryContainer';
import { useCategoryContext } from '../../../hooks/useCategoriesProvider';
import SubCategoriesContainer from '../../../components/sub-categories/subCategoriesContainer';

const CategoriesPage = () => {
	const [loading, setLoading] = useState(true);

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();

	const { getCategories, getSubCategories } = useCategoryContext();

	const handleGetCategories = async (id) => {
		try {
			await getCategories(id);
			setLoading(false);
		} catch (error) {
			console.log(error);
			return message.error('Error al cargar las categorías');
		}
	};

	const handleGetSubCategories = async (id) => {
		try {
			await getSubCategories(id);
			setLoading(false);
		} catch (error) {
			console.log(error);
			return message.error('Error al cargar las sub-categorías');
		}
	};

	const handleGetLines = async (id) => {
		try {
			await getSubCategories(id);
			setLoading(false);
		} catch (error) {
			console.log(error);
			return message.error('Error al cargar las lineas');
		}
	};

	useEffect(() => {
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			// getCategoriesRequest(selectedBusiness.idSucursal);
			// getSubCategoriesRequest(selectedBusiness.idSucursal);
			handleGetCategories(selectedBusiness.idSucursal);
			handleGetSubCategories(selectedBusiness.idSucursal);
			//handleGetLines(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const tabItems = [
		{
			key: '1',
			label: 'Categorías',
			children: <CategoryContainer />,
		},
		{
			key: '2',
			label: 'Sub Categorías',
			children: <SubCategoriesContainer />,
		},
		{
			key: '3',
			label: 'Lineas',
			children: <p>Lineas</p>,
		},
	];

	if (loading) {
		return (
			<DashboardLayout>
				<Loading isLoading={true} />
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Tabs items={tabItems} defaultActiveKey="1" />
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default CategoriesPage;
