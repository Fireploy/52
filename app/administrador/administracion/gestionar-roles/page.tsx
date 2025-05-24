'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from '@/public/css/styles.module.scss';

interface roles {
	_id: string,
	name: string
}
export default function RolesAdmin() {
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	//Rol a agregar
	const [nombreRol, setNombreRol] = useState('');
	//Rol para eliminar
	const [rolEliminar, setRolEliminar] = useState('');
	//Mensaje de confirmacion
	const [showConfirmation, setShowConfirmation] = useState(false);
	//Lista de roles
	const [rolesData, setRolesData] = useState<roles[]>([]);
	// Esta repetido
	const [repeat, setRepeat] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNombreRol(e.target.value);
	};

	const handleEliminarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setRolEliminar(e.target.value);
	};

	const crearRol = async (token: string, name:string) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const body = {
				name: name,
			};
			const response = await axios.post(`${apiEndpoint}/role/`, body, { headers: headers });
			return response.data.role;
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
		const nuevoRol = await crearRol(token, nombreRol);
		cargarRoles();
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
				id: rolEliminar
			};

			const response = await axios.delete(`${apiEndpoint}/role/${rolEliminar}`, {
				headers: headers,
				params: params
			});
			cargarRoles();
			setShowConfirmation(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelEliminar = () => {
		setShowConfirmation(false);
	};

	const getRoles = async (token : string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const response = await axios.get(`${apiEndpoint}/role`, {
				headers: headers,
			});
			return response.data.role;
		} catch (error) {
			console.log(error);
		}
	};

	const cargarRoles = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setRolesData(await getRoles(token));
	};

	useEffect(()=>{
		cargarRoles();
	}, [rolesData, repeat]);

	const nombreVacio = () => {
		return nombreRol === '';
	};
	const rolValido = () => {
		return rolEliminar !== '' && rolEliminar !== '-';
	};

	return (
		<>
			<div className="container mx-auto mt-8">
				<h1 className="text-center text-[400%]" id="titulos-grandes">
					ROLES
				</h1>
				<div className="p-4 max-w-5xl mx-auto flex">
					<div className="w-2/3">
						<table className="w-full">
							<thead>
								<tr>
									<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center text-[150%] tracking-widest" id='titulos-grandes'>rol</th>
								</tr>
							</thead>
							<tbody>
								{rolesData && rolesData.map((rol, index) => (
									<tr key={index}>
										<td className="border-[#1e1e1e] border-[8px] p-3 bg-white text-center text-black">{rol.name}</td>
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
										NOMBRE DEL ROL
									</h3>
									<input
										type="text"
										name="nombre"
										required
										value={nombreRol}
										onChange={handleInputChange}
										className={(nombreVacio() ? 'border-[3px] border-red-700 ' : '') + 'bg-white rounded-full w-80 h-10 my-2 pl-4 text-black'}
										id="texto-general"
										placeholder="Ingrese el nombre del rol"
									/>
								</div>
							</div>
							<div className="mt-3 flex justify-center">
								<button
									type="button"
									disabled = {nombreVacio()}
									onClick={handleSubmit}
									className={(nombreVacio() ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' w-80 h-10 text-white py-2 px-4 rounded-lg'}
								>
									Crear rol
								</button>
							</div>
						</form>
						<form onSubmit={handleEliminarSubmit}>
							<div className="flex items-center mt-5">
								<div className="w-full">
									<h3 className="text-center text-[200%]" id="titulos-grandes">
										NOMBRE DEL ROL A ELIMINAR
									</h3>
									<select
										required
										name="nombreRolEliminar"
										value={rolEliminar}
										onChange={handleEliminarChange}
										className="bg-white rounded-full w-80 h-10 my-2 pl-4 text-black"
										id="texto-general"
									>
										<option value="-">
											Seleccione el rol a eliminar
										</option>
										{rolesData && rolesData.map((rol, index) => (
											<option key={index} value={rol._id}>
												{rol.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="mt-3 flex justify-center">
								<button
									type="button"
									onClick={handleEliminarSubmit}
									disabled = {!rolValido()}
									className={(!rolValido() ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' w-80 h-10 text-white py-2 px-4 rounded-lg'}
								>
									Eliminar rol
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{showConfirmation && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-[#141414] p-10 rounded-lg">
						<h3 className="text-white text-center mb-4 text-[175%]" id='titulos-medianos'>
							¿Está seguro de querer eliminar este rol?
						</h3>
						<div className="flex justify-center">
							<button
								onClick={handleConfirmEliminar}
								className="bg-[#cd1919] w-full h-10 text-white py-2 px-4 mx-2 rounded-lg"
								id="titulos-pequenos"
							>
								Eliminar
							</button>
							<button
								onClick={handleCancelEliminar}
								className="bg-[#cd1919] w-full h-10 text-white py-2 px-4 mx-2 rounded-lg"
								id="titulos-pequenos"
							>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}
			{repeat && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-[#141414] p-10 rounded-lg">
						<h3 className="text-white text-center mb-4 text-[175%]" id='titulos-medianos'>
							Este rol se encuentra repetido, intenta con otro
						</h3>
						<div className="flex justify-center">
							<button
								onClick={()=>setRepeat(false)}
								className={styles.button + ' w-full h-10 text-white py-2 px-4 mx-2 rounded-lg'}
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

		</>
	);
}