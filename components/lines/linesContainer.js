import { Button, Col, Row, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
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
			title: 'Acción',
			key: 2,
			width: '20px',
			render: (_, item) => (
				<Button
					danger
					type="primary"
					disabled={userProfile == PROFILES.BILLER}
					onClick={() => openDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
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

	const openDeleteModal = (value) => {
		setLineToDelete(value);
		setIsDeleteModalOpen(true);
	};

	return (
		<>
			<Title>
				{userProfile != PROFILES.BILLER && (
					<Button
						type="success"
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
			<Table bordered dataSource={linesList} columns={columns} />
			<LinesModals
				isCreateModalOpen={isCreateModalOpen}
				isDeleteModalOpen={isDeleteModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				setIsCreateModalOpen={setIsCreateModalOpen}
				lineToDelete={lineToDelete}
			/>
		</>
	);
}
