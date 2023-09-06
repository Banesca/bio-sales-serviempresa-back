import { useContext, useEffect, useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import axios from 'axios';
import { ip } from '../../util/environment';
import { Form, message } from 'antd';
import { GeneralContext } from '../../pages/_app';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export const useTdc = () => {
	const { requestHandler } = useRequest();
	const [actualTdc, setActualTdc] = useState(0);
	const [tdc, setTdc] = useState({});
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { generalContext } = useContext(GeneralContext);
	const token2 =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI1NWE1NDAwOGFkMWJhNTg5YWEyMTBkMjYyOWMxZGY0MSIsImlhdCI6MTU5MDk0NTY4NH0.V-9GPQoET85cHM3YGSOLNYEKOw_ajQ7xn8bA6h_Xv60';

	const getTdc = async () => {
		try {
			const res = await requestHandler.get(`/api/v2/param`);
			if (res.isLeft()) {
				return;
			}
			const tdc = res.value.getValue().response[52];
			setActualTdc(tdc.param);
			setTdc(tdc);
			form.setFieldValue('param', tdc.param);
		} catch (error) {
			console.log({ error });
			message.error('No fue posible cargar la tasa de cambio');
		}
		return tdc;
	};

	const updateTdc = async (result) => {
		try {
			setLoading(true);
			const body = {
				param: result.param,
				idParam: tdc.idParam,
			};
			const data = await requestHandler.put(`/api/v2/param/update`, body);
			getTdc();
			setLoading(false);
		} catch (error) {
			message.error('No fue posible guardar la tasa de cambio');
			setLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		getTdc();
	}, []);

	return {
		getTdc,
		actualTdc,
		updateTdc,
		updateTdc,
		form,
		loading,
	};
};
