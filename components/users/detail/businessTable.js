import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Empty, Table } from 'antd';
import { useAuthContext } from '../../../context/useUserProfileProvider';

export default function UserBusinessTable({
	business,
	setConfirmDelete,
	setBusinessToRemove,
}) {
	const columns = [
		{
			title: 'Empresas',
			dataIndex: 'nombre',
			key: '1',
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			key: '2',
			width: 20,
			render: (item) => (
				<Button
					type="primary"
					danger
					disabled={userProfile == 1 ? false : true}
					onClick={() => openConfirmDelete(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const openConfirmDelete = (item) => {
		setBusinessToRemove(item);
		setConfirmDelete(true);
	};

	const { userProfile } = useAuthContext();


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
		<ConfigProvider renderEmpty={customizeRenderEmpty}>


			<Table
				columns={columns}
				style={{ width: '100%' }}
				dataSource={business}
			/>
		</ConfigProvider>

	);
}
