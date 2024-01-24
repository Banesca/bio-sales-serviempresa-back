import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { Table } from 'antd';
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


    const columns = [
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
                <h2>Total Ingresos: {totalIngresos}</h2>
                <h2>Total Ganancia: {totalGanancia}</h2>
                <h2>Total Egresos: {totalEgresos}</h2>
                <Table columns={columns} dataSource={data} />
            </div>
        </DashboardLayout>
    );
};

export default Caja;
