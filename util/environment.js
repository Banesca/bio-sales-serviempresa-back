// export const ip = `http://tumenudelivery.com:${localStorage.getItem(
// 	'portURl'
// )}`;
// export const socket = localStorage.getItem('socketUrl');
// export const socket_room = localStorage.getItem('socketUrl');
export const ipBackOffice = 'http://tumenudelivery.com:9009';
export const uriSocket = 'http://tumenudelivery.com:2020';
// export const ip = "http://200.58.105.139:7000";
export const apiKey = 'A9564776733320130718EA02';
export const merchantId = '182323';
export const idClient = '9c9e8b37-5edb-454f-a6a8-b8db16349abe';
export const ServidorFacturacionSeniat = 'http://localhost:8080';
export const urlSeniat = 'http://localhost';
export const ip = 'http://tumenudelivery.com';

export const environment = {
	production: true,
	//apiHost: `${ip}`,
	apiHostBackOffice: `${ipBackOffice}`,
	uriSocket,
	//idRestaurant: `${socket}`,
	deliveryUClave: '123456',
	deliveryUltimaUbicacionLat: '-3455370',
	deliveryUltimaUbicacionLong: '-5848846',
	deliveryUbicacionActulaLat: '-3455370',
	deliveryUbicacionActulaLong: '-5848846',
	//socket_room,
	domin: '',
	merchantId: merchantId,
	idClient: idClient,
	servidorFacturacionSeniat: ServidorFacturacionSeniat,
	urlSeniat: urlSeniat,
	dominIamge: '',
	apiKey: apiKey,
};
