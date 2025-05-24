'use client';

import RankingTable from '@/components/tablas/ranking';
import axios from 'axios';
import { LoaderContenido } from '@/components/loaderContenido';
import {
	useCallback,
	useEffect,
	useState
} from 'react';

export default function Ranking() {

	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const [info, setInfo] = useState<tablaRanking[]>([]);

	const carga = useCallback(async (datos: { token: any }) => {
		try {
			const headers = {
				sessiontoken: datos.token
			};

			const parametros = {
				role: 'Deportista'
			};

			const response = await axios.get(`${apiEndpoint}/users/List`, {
				params: parametros,
				headers: headers
			});

			const data: tablaRanking[] = [];

			for (const user of response.data.users) {
				const ranking: ranking = {
					win: user.ranking.win,
					lose: user.ranking.lose,
					draw: user.ranking.draw,
				};
				const dato: tablaRanking = {
					nombre: user.name,
					apellido: user.lastName,
					id: user._id,
					ranking
				};
				data.push(dato);
			}

			// Actualizar el estado con los datos recibidos
			setInfo(data);
		} catch (error) {
			console.log(error);
		}
	}, [apiEndpoint, setInfo]);

	useEffect(() => {
		const datos = localStorage.getItem('userData');
		var json;

		if (datos != null) {
			json = JSON.parse(datos);
			carga(json);
		}
	}, [carga]);

	return (
		<>
			{info.length == 0 && (<LoaderContenido/>)}
			{info.length != 0 && (
				<RankingTable data={info} />
			)}
		</>
	);
}