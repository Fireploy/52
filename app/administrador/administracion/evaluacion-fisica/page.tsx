
'use client';

import { LoaderContenido } from '@/components/loaderContenido';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from '@/public/css/styles.module.scss';

interface crtierios {
	_id: string,
	name: string
}
export default function EvaluacionFisicaAdmin() {
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	//Criterio a agregar
	const [nombreCriterio, setNombreCriterio] = useState('');
	//Criterio para eliminar
	const [criterioEliminar, setCriterioEliminar] = useState('');
	//Mensaje de confirmacion
	const [showConfirmation, setShowConfirmation] = useState(false);
	//Lista de criterios
	const [criteriosData, setCriteriosData] = useState<crtierios[]>([]);
	// Esta repetido
	const [repeat, setRepeat] = useState (false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNombreCriterio(e.target.value);
	};

	const handleEliminarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCriterioEliminar(e.target.value);
	};

	const crearCriterio = async (token: string, name:string) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const body = {
				name: name,
			};
			const response = await axios.post(`${apiEndpoint}/testCritery`, body, { headers: headers });
			return response.data.critery;
		} catch (error) {
			setRepeat(true);
		}
	};

	const handleSubmit = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		const nuevoCriterio = await crearCriterio(token, nombreCriterio);
		cargarCriterios();
	};

	const handleEliminarSubmit = () => {
		setShowConfirmation(true);
	};

	const handleConfirmEliminar = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		try {
			const headers = {
				sessiontoken: token,
			};
			const params = {
				criteryId: criterioEliminar
			};
			const response = await axios.delete(`${apiEndpoint}/testCritery`, {
				headers: headers,
				params: params
			});
			cargarCriterios();
			setShowConfirmation(false);
			setCriterioEliminar('.');
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelEliminar = () => {
		setShowConfirmation(false);
	};

	const getCriterios = async (token : string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const response = await axios.get(`${apiEndpoint}/testCritery`, {
				headers: headers,
			});
			return response.data.critery;
		} catch (error) {
			console.log(error);
		}
	};

	const cargarCriterios = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setCriteriosData(await getCriterios(token));
	};

	useEffect(()=>{
		cargarCriterios();
	}, [criteriosData, repeat]);

	return (
		<>
			{criteriosData.length == 0 && (
				<LoaderContenido></LoaderContenido>
			)}
			{criteriosData.length != 0 && (
				<div>
					<div className="container mx-auto mt-8">
						<h1 className="text-center text-[400%]" id="titulos-grandes">
					EVALUACIÓN FÍSICA
						</h1>
						<div className="p-4 max-w-5xl mx-auto flex">
							<div className="w-2/3">
								<table className="w-full">
									<thead>
										<tr>
											<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center text-[150%] tracking-widest" id='titulos-grandes'>Criterio</th>
										</tr>
									</thead>
									<tbody>
										{criteriosData.map((criterio, index) => (
											<tr key={index}>
												<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">{criterio.name}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="w-2/3 flex flex-col items-center pl-4">
								<form onSubmit={handleSubmit}>
									<div className="flex items-center">
										<div className="w-full">
											<h3 className="text-center text-[200%]" id="titulos-grandes">
										NOMBRE DEL CRITERIO
											</h3>
											<input
												type="text"
												name="nombre"
												required
												value={nombreCriterio}
												onChange={handleInputChange}
												className={(nombreCriterio === '' ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-full w-80 h-10 my-2 pl-4 text-black'}
												id="texto-general"
												placeholder="Ingrese el nombre del criterio"
											/>
										</div>
									</div>
									<div className="mt-3 flex justify-center">
										<button
											type="button"
											onClick={handleSubmit}
											disabled = {nombreCriterio === ''}
											className={(nombreCriterio === '' ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' w-80 h-10 text-white py-2 px-4 rounded-lg'}
										>
									Crear criterio de evaluación
										</button>
									</div>
								</form>
								<form onSubmit={handleEliminarSubmit}>
									<div className="flex items-center mt-5">
										<div className="w-full">
											<h3 className="text-center text-[200%]" id="titulos-grandes">
										NOMBRE DEL CRITERIO
											</h3>
											<select
												required
												name="nombreCriterioEliminar"
												value={criterioEliminar}
												onChange={handleEliminarChange}
												className="bg-neutral-200 rounded-full w-80 h-10 my-2 pl-4 text-black"
												id="texto-general"
											>
												<option value=".">
											Seleccione el criterio a eliminar
												</option>
												{criteriosData.map((criterio, index) => (
													<option key={index} value={criterio._id}>
														{criterio.name}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="mt-3 flex justify-center">
										<button
											type="button"
											disabled = {criterioEliminar === '' || criterioEliminar === '.'}
											onClick={()=>handleEliminarSubmit()}
											className={(criterioEliminar === '' || criterioEliminar === '.' ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' w-80 h-10 text-white py-2 px-4 rounded-lg'}
										>
									Eliminar criterio de evaluación
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
					{showConfirmation && (
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<div className="bg-[#141414] p-10 rounded-lg">
								<h3 className="text-white text-center mb-4 text-[175%]" id='titulos-grandes'>
							¿ESTÁ SEGURO DE QUERER ELIMINAR ESTE CRITERIO?
								</h3>
								<div className="flex justify-center">
									<button
										onClick={handleConfirmEliminar}
										className={styles.button + ' w-full h-10 text-white py-2 px-4 mx-2 rounded-lg'}
									>
								ELIMINAR
									</button>
									<button
										onClick={handleCancelEliminar}
										className={styles.button + ' w-full h-10 text-white py-2 px-4 mx-2 rounded-lg'}
									>
								CANCELAR
									</button>
								</div>
							</div>
						</div>
					)}
					{repeat && (
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<div className="bg-[#141414] p-10 rounded-lg">
								<h3 className="text-white text-center mb-4 text-[175%]" id='titulos-grandes'>
							Ese criterio se encuentra repetido, intenta con otro
								</h3>
								<div className="flex justify-center">
									<button
										onClick={()=>setRepeat(false)}
										className="bg-[#cd1919] w-full h-10 text-white py-2 px-4 mx-2 rounded-lg"
										id="titulos-pequenos"
									>
								Aceptar
									</button>
								</div>
							</div>
						</div>
					)}

					<div className="flex justify-center mt-8">
						<Link href="../administracion" className={styles.button + ' w-40 h-10 text-white py-2 px-4 rounded-lg flex justify-center'}>
					Volver
						</Link>
					</div>
				</div>
			)}
		</>
	);
}

