import { DeleteOutlined,CheckOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, ConfigProvider, Input, Table } from 'antd';
import { Space } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useEffect, useMemo } from 'react';
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

    const handleOpen = () =>{
        message.info(order?.comments)
    }


    const orderColumns = [
        {
            title: (
                <div className='text-white flex justify-center items-center w-full gap-3' style={{FontSize:'15px'}}>Orden Nro.  {order?.numberOrden} {order?.comments ? <button className='bg-slate-50 border-0 flex justify-center items-center rounded-md px-2 py-1.5' onClick={handleOpen}> <EyeTwoTone twoToneColor="#012258" /></button> : null}  </div>
            ),
            children: [
                {
                    title: 'Nombre',
                    dataIndex: 'nameProduct',
                    width: '220px',
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
                    dataIndex: 'priceProductOrder',

                    key: 2,
                    render: (text, record) => (
                        <p>$ {record.priceProductOrder}</p>
                    ),
                },

                {
                    title: 'Acciones',

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

    useEffect(() =>{
        console.log(order?.body)
    },[])

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
                    pageSize: 8,
                }}
                scroll={{
                    y: 290,
                }}
            />
        </ConfigProvider>
    );
}