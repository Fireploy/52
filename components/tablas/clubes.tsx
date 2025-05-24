'use client';

import clubesData from '@/pruebas/clubes.json';
import { LoaderContenido } from '@/components/loaderContenido';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/public/css/styles.module.scss';

interface club {
	_id: string,
	name: string,
}
export default function TableClubes() {
	const[clubes, setClubes] = useState<club[]>([]);
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

	const getClubes = async (token:string) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const response = await axios.get(`${apiEndpoint}/club/List`, {
				headers: headers,
			});
			return response.data.clubs;
		} catch (error) {
			console.log(error);
		}
	};
	const cargarClubes = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setClubes(await getClubes(token));
	};

	async function handleBorrar(id: string): Promise <void>{
		try{
			const datos = localStorage.getItem('userData');
			var arreglo;

			if (datos != null) {
				arreglo = JSON.parse(datos);
			}

			const parametro = {
				clubId: id,
			};

			const cabeza = {
				sessiontoken: arreglo.token,
			};

			await axios.delete(`${apiEndpoint}/club/Delete`, {
				headers: cabeza,
				params: parametro,
			});
			window.location.reload();
		} catch (error) {
			console.log(error);
			alert('No se puede borrar el usuario.');
		}
	};

	useEffect(()=>{
		cargarClubes();
	}, []);

	return (
		<>
			{clubes.length == 0 && (
				<LoaderContenido></LoaderContenido>
			)}
			{clubes.length != 0 && (
				<div>
					<div className='w-[80%] mx-auto mt-[6%]'>
						<h1 className='text-[300%]' id='textos-grandes'>CLUBES</h1>
					</div>
					<div className='flex justify-center items-center'>
						<table className="w-[80%] mx-auto">
							<thead>
								<tr>
									<th
										className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center text-[150%] tracking-widest"
										id="titulos-grandes"
									>
                                CLUB
									</th>
									<th
										className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center text-[150%] tracking-widest"
										id="titulos-grandes"
									>
                                ACCIONES
									</th>
								</tr>
							</thead>
							<tbody>
								{clubes.map((club) => (
									<tr key={club._id}>
										<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">
											{club.name}
										</td>
										<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">
											<Link href={'/administrador/administracion/gestionar-clubes/info-club?clubId=' + club._id}>
												<button className="bg-[#cd1919] text-white rounded p-2 mr-2">
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
														<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
														<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
													</svg>
												</button>
											</Link>
											<Link href={'/administrador/administracion/gestionar-clubes/editar-club?clubId=' + club._id}>
												<button className="bg-[#cd1919] text-white rounded p-2 mr-2">
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
														<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
														<path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
													</svg>
												</button>
											</Link>

											<button onClick={() => handleBorrar(club._id)} className="bg-[#cd1919] text-white rounded p-2 mr-2">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-dash" viewBox="0 0 16 16">
													<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
												</svg>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className='w-[80%] mx-auto mt-4 flex justify-between items-center'>
						<div>
							<Link href="../administracion">
								<button className={styles.button + ' w-40 h-10 text-white py-2 px-4 rounded-lg flex justify-center'}>
        Volver
								</button>
							</Link>
						</div>
						<div>
							<Link href='/administrador/administracion/gestionar-clubes/crear-club' className={ styles.button + ' text-white rounded p-2'}>
						Crear club
							</Link>
						</div>
					</div>
				</div>
			)}

		</>
	);
}
