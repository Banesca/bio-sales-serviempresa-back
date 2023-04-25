import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, Col, Row, Space, ConfigProvider, Empty, Form } from 'antd';
import { addKeys } from '../../util/setKeys';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import SubCategoryFilters from './filters';
import SubCategoryModals from './modals';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Typography } from 'antd';
import Title from '../shared/title';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES } from '../shared/profiles';

export default function SubCategoriesContainer() {

	const [log, setLog] = useState();
	
	useEffect(() => {
	  setLog(localStorage.getItem('userProfile'));
	}, []);
	


	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameSubFamily',
			key: 1,
			render: (text) => text,
		},
		{
			title: 'Acciones',
			width: '20px',
			key: 2,
			render: (_, item) => (
				<Space>
					<Button
						disabled={log == PROFILES.BILLER}
						onClick={() => openEditModal(item)}
					>
						<EditOutlined />
					</Button>
					<Button
						danger
						type="primary"
						disabled={log == PROFILES.BILLER}
						onClick={() => openDeleteModal(item)}
					>
						<DeleteOutlined />
					</Button>
				</Space>

			),
		},
	];

	const { subCategories } = useCategoryContext();
	const { userProfile } = useAuthContext();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// const [loading, setLoading] = useState(false);
	const { setLoading } = useLoadingContext();

	// list and filter
	const [query, setQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState();

	// delete brand
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentBrands, setCurrentBrand] = useState();

	// create
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Filters
	const subCategoryList = useMemo(() => {
		let list = subCategories;
		if (query) {
			list = subCategories.filter((b) =>
				b.nameSubFamily
					.toLowerCase()
					.includes(query.toLocaleLowerCase())
			);
		}
		if (selectedCategory) {
			list = subCategories.filter(
				(b) => b.idProductFamily === selectedCategory
			);
		}
		addKeys(list);
		return list;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, subCategories, selectedCategory]);

	// End Filters

	const [createFormTwo] = Form.useForm();


	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const openDeleteModal = (value) => {
		setCurrentBrand(value);
		setIsDeleteModalOpen(true);
	};

	const openEditModal = (value) => {
		setIsEditModalOpen(true);
		setCurrentBrand(value);
		setTimeout(() => {
			createFormTwo.resetFields();
		}, 100);
	}


	// Modificaciones de Santi para actualizar el modal

	const close = () => {
		setIsEditModalOpen(false);
		createFormTwo.resetFields();
	}


	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>

		</Empty>
	);

	return (
		<>
			{/* <Row style={{ alignItems: 'center' }}>
				<Col
					lg={{ offset: 6, span: 12 }}
					md={{ offset: 6, span: 12 }}
					sm={{ offset: 6, span: 12 }}
					xs={{ span: 12 }}
				>
					<Typography>
						<h1
							style={{
								textAlign: 'center',
								fontSize: '1.5rem',
								margin: '0.5rem 0',
							}}
						>
							Sub Categorías
						</h1>
					</Typography>
				</Col>
				<Col
					lg={{ span: 6 }}
					md={{ span: 6 }}
					sm={{ span: 6 }}
					xs={{ span: 12 }}
					style={{
						justifyContent: 'end',
						display: 'flex',
					}}
				></Col>
			</Row> */}
			<Title title="Sub Categorías" goBack={false}>
				{log != PROFILES.BILLER && (
					<Button type="success" style={{marginRight: '-2.3rem'}} onClick={handleOpenCreateModal}>
						Agregar
					</Button>
				)}
			</Title>
			<SubCategoryFilters
				setQuery={setQuery}
				setSelectedCategory={setSelectedCategory}
			/>
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
				<Table bordered dataSource={subCategoryList} columns={columns} />
			</ConfigProvider>
			<SubCategoryModals
				isCreateModalOpen={isCreateModalOpen}
				isDeleteModalOpen={isDeleteModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				setIsCreateModalOpen={setIsCreateModalOpen}
				setLoading={setLoading}
				currentBrands={currentBrands}
				isEditModalOpen={isEditModalOpen}
				setIsEditModalOpen={setIsEditModalOpen}
				createFormTwo={createFormTwo}
				close={close}
			/>
		</>
	);
}
