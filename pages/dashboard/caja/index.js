import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { Table,	Space, Button,	message } from 'antd';
import {
	DeleteOutlined
} from '@ant-design/icons';
import { useRequest } from '../../../hooks/useRequest';
import moment from 'moment';
const Caja = () => {

    const { requestHandler } = useRequest();
    const [data, setData] = useState([]);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [totalGanancia, setTotalGanancia] = useState(0);
    const [totalEgresos, setTotalEgresos] = useState(0);

    useEffect(() => {
        getMotion()

    }, []);

    
	const handleOpenDeleteModal= async (id)=>{
		console.log(id)

        const res = await requestHandler.delete(`/api/v2/tracking/delete/${id}`);
        if (res.isLeft()) {
            message.error('No se pudo completar la operacion')
			return;
		} else{
            message.success('Operacion realizada con exito')
        }

        console.log(res)
	}

    
    useEffect(() => {
        getMotion()

    }, [handleOpenDeleteModal]);

    const columns = [
        {
            title: 'Estado',
            dataIndex: 'spending',
            render: (text, index) => ( 
                <span style={{ backgroundColor: text===1 ? '#DB9686' : '#92EC80' ,  color: text===1 ? '#9B2910' : '#00861C'  } } className='p-2 text-sm rounded-md font-medium' >{text===1 ? 'Confirmado' : 'No Confirmado'}</span>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Eliminar',
            dataIndex: 'idTracking',
            render: (text, index) => ( 
                <Space>
                    <Button type="primary" danger onClick={() => handleOpenDeleteModal(text)}>
                        <DeleteOutlined />
                    </Button>
                </Space>
            )
        },
    ];

    let selectedBusiness;
    let idSucursal;
    if (typeof window !== 'undefined') {
        selectedBusiness = localStorage.getItem('selectedBusiness');
        if (selectedBusiness) {
            selectedBusiness = JSON.parse(selectedBusiness);
            idSucursal = selectedBusiness.idSucursal;
        } else {
            console.error('selectedBusiness is not defined in localStorage');
        }
    } else {
        console.error('localStorage is not available');
    }
    var idBox = 1;
    var dT = new Date();
    var dateT = dT.getFullYear() + "-" + (dT.getMonth() < 10 ? ('0' + (Number(dT.getMonth()) + Number(1))) : (Number(dT.getMonth()) + Number(1))) + '-' + dT.getDate();
    var dateI = moment(dateT).format('YYYY-MM-DD');


    const body = {
        dateStart: dateI,
        dateEnd: dateI,
        idBranchFk: idSucursal,
        idCurrencyFk: 1,
        idBoxFk: idBox
    };

    

    const getMotion = async () => {
        try {
            const res = await requestHandler.post('/api/v2/tracking/list', body);
            console.log(res);

            if (res && res.value && res.value._value && res.value._value.data) {
                setData(res.value._value.data.map((item, index) => ({
                    key: index,
                    title: item.title,
                    amount: item.amount,
                    idTracking: item.idTracking,
                    spending: item.spending,
                })));

                setTotalIngresos(res.value._value.totalIngresos);
                setTotalGanancia(res.value._value.totalGanancia);
                setTotalEgresos(res.value._value.totalEgresos);
            } else {
                console.error('Unexpected response', res);
            }
        } catch (error) {
            console.error('API request failed', error);
        }
    };



    return (
        <DashboardLayout>
            <div className="p-4 m-4">
                <Title title={'Caja'} goBack={false}>
                </Title>
            </div>
            <div>
                <div className='w-full bg-white shadow mb-3 rounded-md py-4 flex justify-around'>
                    <h2 className='text-blue-700 fs-5 text-lg	font-medium'>Total Ingresos: {totalIngresos}</h2>
                    <h2 className='text-green-500 fs-5 text-lg	font-medium'>Total Ganancia: {totalGanancia}</h2>
                    <h2 className='text-red-500 fs-5 text-lg	font-medium'>Total Egresos: {totalEgresos}</h2>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        </DashboardLayout>
    );
};

export default Caja;
