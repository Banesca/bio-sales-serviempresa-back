import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';
import { addKeys } from '../../../util/setKeys';

const formatToday = () => {
	const today = new Date();
	return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export function useUser() {
	const [users, setUsers] = useState([]);
	const [sellerClients, setSellerClients] = useState([]);
	const [routes, setRoutes] = useState([]);

	const { requestHandler } = useRequest();

	const getUsers = async () => {
		const res = await requestHandler.get(`/api/v2/user/only/enable`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue();
		setUsers(value.data);
	};

	const getUserById = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		return !!value === true ? value[0] : null;
	};

	const getSellerClients = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/client/${userId}`);
		if (res.isLeft()) {
			return res.value.getErrorValue();
		}
		setSellerClients(res.value.getValue().data);
	};

	const assignClientToSeller = async ({ idUserFk, idClientFk }) => {
		const res = await requestHandler.post(`/api/v2/user/assign/client`, {
			idUserFk,
			idClientFk,
		});
		if (res.isLeft()) {
			return res.value.getErrorValue();
		}
	};

	const removeClientToSeller = async (idRelation) => {
		const res = await requestHandler.delete(
			`/api/v2/user/delete/client/${idRelation}`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const addItemToUserRoute = async (data) => {
		const res = await requestHandler.post(`/api/v2/user/rute/add`, data);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const getUserRouteByDate = async (
		userId,
		data = {
			dateStart: `2023-1-1`,
			dateEnd: formatToday(),
		}
	) => {
		const res = await requestHandler.post(
			`/api/v2/user/rute/bydate/${userId}`,
			data
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		addKeys(value);
		setRoutes(value);
	};

	const removeRouteItem = async ({ idSellerRoute, userId }) => {
		const res = await requestHandler.get(
			`/api/v2/user/delete/rute/${idSellerRoute}`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getUserRouteByDate(userId);
	};

	const addUser = async (data) => {
		const res = await requestHandler.post('/api/v2/user/add/sales', data);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const findUserByEmail = async (email) => {
		const res = await requestHandler.get(`/api/v2/user/bymail/${email}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		return !!value === true ? value[0] : null;
	};

	const updateUser = async (data, id) => {
		const res = await requestHandler.put('/api/v2/user/edit/lite', {
			fullname: data.fullname,
			mail: data.mail,
			idProfileFk: data.idProfileFk,
			idUser: id,
		});
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const deleteUser = async (userId) => {
		const res = await requestHandler.put(
			`/api/v2/user/change/status/${userId}/3`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getUsers();
	};

	return {
		users,
		sellerClients,
		routes,
		getUsers,
		getUserById,
		addUser,
		updateUser,
		findUserByEmail,
		deleteUser,
		getSellerClients,
		assignClientToSeller,
		removeClientToSeller,
		addItemToUserRoute,
		getUserRouteByDate,
		removeRouteItem,
	};
}
