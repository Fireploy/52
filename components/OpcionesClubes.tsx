
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Option{
    value: string,
    label: string,
}

export default function OpcionesClubes(){
	const [opciones, setOpciones] = useState<Option[]>([]);
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

	var cargado = false;
	useEffect(() => {
		const datos = localStorage.getItem('userData');
		var arreglo;

		if (datos != null) {
			arreglo = JSON.parse(datos);
		}
		carga(arreglo);
		cargado = true;
	}, [!cargado]);

	async function carga(datos: { token: any}): Promise<void> {
		try {
			const headers = {
				sessiontoken: datos.token
			};

			const response = await axios.get(`${apiEndpoint}/club/List`, {
				headers: headers
			});

			const mappedOptions = response.data.clubs.map((item: any) => ({
				value: item._id,
				label: item.name,
			}));
			setOpciones(mappedOptions);

		} catch (error) {
			console.log(error);
		}
	}
	return (
		<>
			{opciones.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</>
	);
}