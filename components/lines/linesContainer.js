import { Button, Col, ConfigProvider, Empty, Row, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { useEffect, useMemo, useState } from 'react';
import { addKeys } from '../../util/setKeys';
import LinesFilters from './linesFilters';
import LinesModals from './lineModals';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Typography } from 'antd';
import { useAuthContext } from '../../context/useUserProfileProvider';
import Title from '../shared/title';
import { PROFILES } from '../shared/profiles';

export default function LinesContainer() {
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
						disabled={userProfile == PROFILES.BILLER}
						onClick={() => openEditModal(item)}
					>
						<EditOutlined />
					</Button>
					<Button
						danger
						type="primary"
						disabled={userProfile == PROFILES.BILLER}
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

	const openEditModal = (value) => {
		setIsEditModalOpen(true);
		setLineToDelete(value)

	}

	const openDeleteModal = (value) => {
		setLineToDelete(value);
		setIsDeleteModalOpen(true);
	};

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
			<Title>
				{userProfile != PROFILES.BILLER && (
					<Button
						type="success"
						style={{marginRight: '-2.3rem'}}
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
			<ConfigProvider renderEmpty={customizeRenderEmpty}>
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
			/>
		</>
	);
}
