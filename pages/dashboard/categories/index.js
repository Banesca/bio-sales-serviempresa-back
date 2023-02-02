import { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import { Tabs } from 'antd';
import { message } from 'antd';
import CategoryContainer from '../../../components/categories/categoryContainer';
import { useCategoryContext } from '../../../hooks/useCategoriesProvider';
import SubCategoriesContainer from '../../../components/sub-categories/subCategoriesContainer';
import LinesContainer from '../../../components/lines/linesContainer';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';

const CategoriesPage = () => {
	// const [loading, setLoading] = useState(true);
	const { loading, setLoading } = useLoadingContext();

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();

	const { getCategories, getSubCategories, getLines } = useCategoryContext();

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
			await getLines(id);
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
			handleGetLines(selectedBusiness.idSucursal);
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
			children: <LinesContainer />,
		},
	];

	// if (loading) {
	// 	return (
	// 		<>
	// 			<DashboardLayout></DashboardLayout>
	// 			<Loading isLoading={true} />
	// 		</>
	// 	);
	// }

	return (
		<>
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
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default CategoriesPage;
