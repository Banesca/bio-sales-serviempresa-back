import { Button, ConfigProvider, Form, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { useEffect, useMemo, useState } from 'react';
import { addKeys } from '../../util/setKeys';
import LinesFilters from './linesFilters';
import LinesModals from './lineModals';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { useAuthContext } from '../../context/useUserProfileProvider';
import Title from '../shared/title';
import { PROFILES } from '../shared/profiles';
import { CustomizeRenderEmpty } from '../common/customizeRenderEmpty';

export default function LinesContainer() {
	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			key: 1,
			render: (text) => text,
		},
		{
			title: 'Acciones',
			key: 2,
			width: '20px',
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

	const { lines } = useCategoryContext();
	const { loading } = useLoadingContext();
	const { userProfile } = useAuthContext();

	// list and filter
	const [query, setQuery] = useState('');
	const [selectedSubCategory, setSelectedSubCategory] = useState();

	// delete brand
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [lineToDelete, setLineToDelete] = useState();

	// create
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Filters
	const linesList = useMemo(() => {
		let list = lines;
		if (query) {
			list = lines.filter((b) =>
				b.name.toLowerCase().includes(query.toLocaleLowerCase())
			);
		}
		if (selectedSubCategory) {
			list = lines.filter((b) => b.idSubFamilyFk == selectedSubCategory);
		}
		addKeys(list);
		return list;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, lines, selectedSubCategory]);

	// End Filters

	const [createFormTwo] = Form.useForm();

	const openEditModal = (value) => {
		setIsEditModalOpen(true);
		setLineToDelete(value);
		setTimeout(() => {
			createFormTwo.resetFields();
		}, 100);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		createFormTwo.resetFields();
	};

	const openDeleteModal = (value) => {
		setLineToDelete(value);
		setIsDeleteModalOpen(true);
	};

	return (
		<>
			<Title>
				{localStorage.getItem('userProfile') != PROFILES.BILLER && (
					<Button
						type="success"
						style={{ marginRight: '-2.3rem' }}
						onClick={() => setIsCreateModalOpen(true)}
					>
						Agregar
					</Button>
				)}
			</Title>
			<LinesFilters
				setQuery={setQuery}
				setSelectedSubCategory={setSelectedSubCategory}
			/>
			<ConfigProvider
				renderEmpty={
					linesList?.length !== 0 || true ? CustomizeRenderEmpty : ''
				}
			>
				<Table bordered dataSource={linesList} columns={columns} />
			</ConfigProvider>
			<LinesModals
				isCreateModalOpen={isCreateModalOpen}
				isDeleteModalOpen={isDeleteModalOpen}
				isEditModalOpen={isEditModalOpen}
				setIsEditModalOpen={setIsEditModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				setIsCreateModalOpen={setIsCreateModalOpen}
				lineToDelete={lineToDelete}
				createFormTwo={createFormTwo}
				closeEditModal={closeEditModal}
			/>
		</>
	);
}
