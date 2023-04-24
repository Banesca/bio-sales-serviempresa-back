import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest'

export default function useClients() {
	const [clients, setClients] = useState([])

	const { requestHandler } = useRequest()

	const listClients = async () => {
		const res = await requestHandler.get('/api/v2/client/list');
		if (res.isLeft()) {
			console.log(res);
			throw res.value.getErrorValue()
		}
		setClients(res.value.getValue().response);
	}

	const deleteClient = async (idClient) => {
		const res = await requestHandler.delete(`/api/v2/client/delete/${idClient}`)
		if (res.isLeft()) {
			throw res.value.getErrorValue()
		}
		await listClients()
	}

	return {
		clients,
		listClients,
		deleteClient
	}
}