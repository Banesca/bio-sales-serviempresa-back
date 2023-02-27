import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest'

export default function useClients() {
	const [clients, setClients] = useState([])

	const { requestHandler } = useRequest()

	const listClients = async () => {
		const res = await requestHandler.get('/api/v2/client/list');
		if (res.isLeft()) {
			throw res.value.getErrorValue()
		}
		setClients(res.value.getValue().response);
	}

	return {
		clients,
		listClients
	}
}