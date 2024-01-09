export const uriSocket = 'http://tumenudelivery.com:2020';
export const apiKey = 'A9564776733320130718EA02';
export const merchantId = '182323';
export const idClient = '9c9e8b37-5edb-454f-a6a8-b8db16349abe';
export const ServidorFacturacionSeniat = 'http://localhost:8080';
export const urlSeniat = 'http://localhost';


/****************************SERVIDOR PROD***********************************/
// export const ipBackOffice = 'https://api.menusoftware.info:8078'
// export const ip = 'http://api.menusoftware.info'; // 'http://72.167.55.26'  

/******************************************************************************/


/******************************SERVIDOR DEMO****************************/
export const ipBackOffice = 'https://api.menusoftware.info:9008';
export const ip = 'https://api.menusoftware.info';  //
export const apiImg = 'https://api.menusoftware.info:8002';
/******************************************************************************/

export const environment = {
	production: true,
	apiHostBackOffice: `${ipBackOffice}`,
	uriSocket,
	deliveryUClave: '123456',
	deliveryUltimaUbicacionLat: '-3455370',
	deliveryUltimaUbicacionLong: '-5848846',
	deliveryUbicacionActulaLat: '-3455370',
	deliveryUbicacionActulaLong: '-5848846',
	domin: '',
	merchantId: merchantId,
	idClient: idClient,
	servidorFacturacionSeniat: ServidorFacturacionSeniat,
	urlSeniat: urlSeniat,
	dominIamge: '',
	apiKey: apiKey,
};
