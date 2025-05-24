import { throws } from 'assert';
import axios from 'axios';

const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

export interface indexInformation {
    '_id': '',
    'mision': '',
    'vision': '',
    'section': []
};

export const ObtenerLogo = async () : Promise<string> => {
	// const datos = localStorage.getItem('userData');
	// let token;
	// if(datos != null){
	// 	token = JSON.parse(datos).token;
	// }
	try {
		const response = await axios.get(`${apiEndpoint}/indexPag/get-logo`);
		return response.data.image;
	} catch (error: any) {
		console.log(error.message);
		return '';
	}
};

export const cargarInformacionIndex = async () : Promise<indexInformation | null> => {
	// const datos = localStorage.getItem('userData');
	// let token;
	// if(datos != null){
	// 	token = JSON.parse(datos).token;
	// }
	try {
		const response = await axios.get(`${apiEndpoint}/indexPag`);
		return response.data.infoIndex;
	} catch (error) {
		console.log(error);
		return null;
	}
};
/**
 *
 * @param email
 * @returns -1 -> No existe, 0 -> exitoso, 1 -> Código pendiente
 */
export const SolicitarCambioContrasenia = async (email: string): Promise<boolean> => {

	try {
		const body = {
			email: email
		};
		const response = await axios.post(`${apiEndpoint}/users/generate-password-code`, body);

		return true;

	} catch (error) {
		console.log(error);
		return false;
	}
};

/**
 *
 * @param email
 * @returns -1 -> No existe, 0 -> exitoso, 1 -> Código pendiente
 */
export const RealizarCambioContrasenia = async (email: string, codigo: string, contrasenia: string): Promise<boolean> => {

	try {
		const body = {
			email: email,
			code: codigo,
			password: contrasenia
		};
		const response = await axios.patch(`${apiEndpoint}/users/update-password`, body);

		return true;

	} catch (error) {
		console.log(error);
		return false;
	}
};

export const obtenerFotoPerfil = async (id = '') : Promise<string> => {
	const datos = localStorage.getItem('userData');
	let token, userId;
	if(datos != null){
		token = JSON.parse(datos).token;
		if(id == '') userId = JSON.parse(datos).userId;
		else userId = id;
	}
	const headers = {
		sessiontoken: token
	};
	const parametros = {
		userId: userId
	};
	try {
		const response = await axios.get(`${apiEndpoint}/users/${userId}/getUserImage`, {
			params: parametros,
			headers: headers
		});
		if(response.data.image == undefined){
			throw new Error('No Posee Imagen');
		}
		return response.data.image;
	} catch (error) {
		console.log(error);
		return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
	}
};

function base64StringToFile(base64String: string, filename: string) {
	// Extraer los datos base64 de la cadena
	const data = base64String.split(';base64,')[1];
	// Convertir los datos base64 en un ArrayBuffer
	const byteCharacters = atob(data);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
	  byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);
	// Crear un nuevo objeto Blob a partir del ArrayBuffer
	const blob = new Blob([byteArray], { type: 'image/png' });
	// Crear un objeto File a partir del Blob
	const file = new File([blob], filename, { type: 'image/png' });
	return file;
}

export const ActualizarFotoPerfil = async (nImagen: string, id = '') : Promise<void> => {
	const datos = localStorage.getItem('userData');
	let token, userId;
	if(datos != null){
		token = JSON.parse(datos).token;
		if(id == '') userId = JSON.parse(datos).userId;
		else userId = id;
	}
	const headers = {
		sessiontoken: token
	};
	const parametros = {
		userId: userId
	};
	const formData = new FormData();
	const FileImage = base64StringToFile(nImagen, `${userId}.png`);
	formData.append('image', FileImage);

	try {
		const response = await axios.post(`${apiEndpoint}/users/${userId}/uploadImage`, formData, {
			headers: headers,
			params: parametros,
		});
		return response.data;
	} catch (error) {
		console.log(error);
		return;
	}
};

export const ActualizarLogo = async (nImagen: string) : Promise<void> => {
	const datos = localStorage.getItem('userData');
	let token, userId;
	if(datos != null){
		token = JSON.parse(datos).token;
		userId = JSON.parse(datos).userId;
	}
	const headers = {
		sessiontoken: token
	};
	const parametros = {
		userId: userId
	};
	const formData = new FormData();
	const FileImage = base64StringToFile(nImagen, 'Logo.png');
	formData.append('image', FileImage);

	try {
		const response = await axios.post(`${apiEndpoint}/indexPag/upload-logo`, formData, {
			headers: headers,
			params: parametros,
		});
		return response.data;
	} catch (error) {
		console.log(error);
		return;
	}
};

export const CargaMasiva = async (archivo: File): Promise<any> => {
	const datos = localStorage.getItem('userData');
	let token;

	if (datos != null) {
		token = JSON.parse(datos).token;
	}

	const headers = {
		sessiontoken: token
	};

	const formData = new FormData();
	formData.append('excel', archivo);

	try {
		let endpoint = `${apiEndpoint}/users/upload-masive-sportsman`;

		const urlActual = window.location.href;

		if (urlActual.includes('/administrador/lista-usuarios/deportista')) {
			endpoint = 'users/upload-masive-sportsman';
		} else if (urlActual.includes('/administrador/lista-usuarios/entrenador')) {
			endpoint = 'users/upload-masive-trainer';
		}

		const response = await axios.post(`${apiEndpoint}/${endpoint}`, formData, {
			headers: headers,
		});
		window.location.reload();
		return response.data;
	} catch (error) {
		console.error('Error al subir el archivo:', error);
		alert('Ocurrió un error al subir el archivo, verifique que es el correcto e intente de nuevo');
		throw error;
	}
};

