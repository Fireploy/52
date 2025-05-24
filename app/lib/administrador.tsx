import { User } from '@/components/tablas/Table';
import axios from 'axios';

const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

export const BorrarUsuario = async (user: User) : Promise<void> => {
	try{
		const datos = localStorage.getItem('userData');
		var arreglo;

		if (datos != null) {
			arreglo = JSON.parse(datos);
		}

		const parametro = {
			userId: user._id,
		};

		const cabeza = {
			sessiontoken: arreglo.token,
		};

		await axios.delete(`${apiEndpoint}/users/Delete`, {
			headers: cabeza,
			params: parametro,
		});
		window.location.reload();
	} catch (error) {
		console.log(error);
		alert('No se puede borrar el usuario.');
	}
};