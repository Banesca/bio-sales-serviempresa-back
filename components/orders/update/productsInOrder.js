import { DeleteOutlined,CheckOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input, Table } from 'antd';
import { Space } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useMemo } from 'react';
import { addKeys } from '../../../util/setKeys';
import { message } from 'antd';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function ProductsInOrder({
    order,
    openDeleteModal,
    setProductsQuantity,
    confirmProductQuantity,
    isCreditOrder,
}) {
    const orderColumns = [
        {
            title: (
                <div className='text-white' style={{FontSize:'15px'}}>Orden Nro.  {order?.numberOrden}</div>
            ),
            children: [
                {
                    title: 'Nombre',
                    dataIndex: 'nameProduct',
                    width: '120px',
                    key: 1,
                    render: (text) => <p>{text}</p>,
                },

                {
                    title: 'Cantidad',
                    dataIndex: 'weight',
                    align: 'center',
                    key: 3,
                    render: (number, record, index) => (
                        <Space className="flex flex-wrap justify-center">
                            {isCreditOrder ? (
                                <p>{number}</p>
                            ) : (
                                <>
                                    <span className='px-2'>{order?.body[index].weight}</span>
                                    <Button
                                        type="primary"
                                        className="bg-blue-500"
                                        onClick={() => handleUpdateProduct(record)}
                                    >
                                        <CheckOutlined />
                                    </Button>
                                </>
                            )}
                        </Space>
                    ),
                },
                {
                    title: 'Precio',
                    dataIndex: 'priceSale',
                    width: '100px',
                    key: 2,
                    render: (text, record) => (
                        <p>$ {record.isPromo == '1' ? record.marketPrice : text}</p>
                    ),
                },
                {
                    title: 'Acciones',
                    width: '100px',
                    key: 3,
                    render: (record) => (
                        !isCreditOrder && (
                            <Space>
                                <Button
                                    onClick={() => openDeleteModal(record)}
                                    type="primary"
                                    danger
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Space>
                        )
                    ),
                }
            ],
        },
    ];

    const { setLoading } = useLoadingContext();

    const handleUpdateProduct = async (record) => {
        setLoading(true);
        try {
            await confirmProductQuantity(record.idOrderB, Number(record.weight));
            message.success('Cantidad actualizada');
        } catch (error) {
            message.error('Error al actualizar cantidad');
        } finally {
            setLoading(false);
        }
    };

    const productList = useMemo(() => {
        const list = order?.body;
        addKeys(list);
        return list;
    }, [order]);

    const { loading } = useLoadingContext();

    return (
        <ConfigProvider
            renderEmpty={
                productList?.length !== 0 || true ? CustomizeRenderEmpty : ''
            }
        >
            <Table
                columns={orderColumns}
                loading={loading}
                dataSource={productList}
                className="ordens"
                pagination={{
                    pageSize: 6,
                }}
                scroll={{
                    y: 290,
                }}
            />
        </ConfigProvider>
    );
}