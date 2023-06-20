import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, Space, ConfigProvider, Form } from 'antd';
import { addKeys } from '../../util/setKeys';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import SubCategoryFilters from './filters';
import SubCategoryModals from './modals';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import Title from '../shared/title';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES } from '../shared/profiles';
import { CustomizeRenderEmpty } from '../common/customizeRenderEmpty';
import {
	AppstoreAddOutlined
} from '@ant-design/icons';



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
	const { setLoading } = useLoadingContext();
	const [query, setQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentBrands, setCurrentBrand] = useState();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const subCategoryList = useMemo(() => {
		let list = subCategories;
		if (query) {
			list = subCategories.filter((b) =>
				b.nameSubFamily.toLowerCase().includes(query.toLocaleLowerCase())
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
	};

	const close = () => {
		setIsEditModalOpen(false);
		createFormTwo.resetFields();
	};

	return (
		<>
			<Title title="Sub Categorías" goBack={false}>
				{log != PROFILES.BILLER && (
					<Button
						type="success"
						style={{ marginRight: '-2.3rem' }}
						onClick={handleOpenCreateModal}
					>
						<AppstoreAddOutlined/> Crear
					</Button>
				)}
			</Title>
			<SubCategoryFilters
				setQuery={setQuery}
				setSelectedCategory={setSelectedCategory}
			/>
			<ConfigProvider
				renderEmpty={
					subCategoryList?.length !== 0 || true ? CustomizeRenderEmpty : ''
				}
			>
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
