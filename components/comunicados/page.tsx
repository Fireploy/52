
'use client';
import axios from 'axios';
import router from 'next/router';
import { useState, useEffect } from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';
import Select from 'react-select';

interface User {
    _id: string;
    name: string;
    lastName: string;
    cedula: string;
    email: string
    // ... otras propiedades
  }

export default function Comunicados() {
	const[usuarios, setUsuarios] = useState<User[]>([]);
	const [selectedUsuario, setSelectedUsuario] = useState('');
	const[correos, setCorreos] = useState('');
	const[asunto, setAsunto] = useState('');
	const[cuerpo, setCuerpo] = useState('');
	const [selectedUsuarios, setSelectedUsuarios] = useState<String[]>([]);
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

	const getUsuarios = async (token:string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const response = await axios.get(`${apiEndpoint}/users/List`, {
				headers: headers,
			});
			return response.data.users;
		} catch (error) {
			console.log(error);
		}
	};

	const cargarUsuarios = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		const result = await getUsuarios(token);
		setUsuarios(result);
	};

	function handlerSetParticipantes(eliminar: boolean) {
		let users = [...selectedUsuarios];
		const indice = users.indexOf(selectedUsuario);
		if(eliminar){
			if (indice != -1) {
				users.splice(indice, 1);
			}
		}else{
			if (indice == -1) {
				users.push(selectedUsuario);
			}
		}
		setSelectedUsuarios(users);
	}

	const handleSubmit = async () => {
		let token;
		const datos = localStorage.getItem('userData');
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		const headers = {
			sessiontoken: token,
		};

		const body = {
			emails: selectedUsuarios,
			subject: asunto,
			message: cuerpo,
		};
		try {
			await axios.post(`${apiEndpoint}/users/send-comunicates`, body, { headers: headers });
			setSelectedUsuarios([]);
			setAsunto('');
			setCuerpo('');
		}catch(error){
			console.log(error);
		}
	};

	const handleChangeAsunto = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAsunto(event.target.value);
	};

	const handleChangeCuerpo = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCuerpo(event.target.value);
	};

	useEffect(()=>{
		cargarUsuarios();
	}, []);

	useEffect(()=>{
		console.log(cuerpo);
	}, [cuerpo]);

	useEffect(()=>{
		let nuevosCorreos = '';
		for(const user of selectedUsuarios){
			nuevosCorreos += (user + '\n');
		}
		setCorreos(nuevosCorreos);
		console.log(selectedUsuarios);
	}, [selectedUsuarios]);

	const seleccionInvalida = () => {
		return selectedUsuario === '' || selectedUsuario === '-';
	};
	const asuntoVacio = () => {
		return asunto === '';
	};
	const cuerpoVacio = () => {
		return cuerpo === '';
	};
	const correosVacios = () =>{
		return correos === '';
	};

	return (
		<>
			{usuarios.length == 0 && (<LoaderContenido/>)}
			{usuarios.length != 0 && (
				<div className="container mx-auto mt-8">
					<h1 className='text-center text-[400%]' id='textos-grandes'>COMUNICADOS</h1>
					<form>
						<div className="p-4 max-w-5xl mx-auto flex">
							<div className="w-2/3 pr-4">
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										Buscar usuario:
										</div>
									</div>
									<div className='w-2/3 mx-2'>
										<Select
											className='w-full h-10 mx-3 my-2 pl-4 text-black text-center'
											id='texto-general'
											options={usuarios.map((usuario) => ({
												value: usuario.email,
												label: `${usuario.name} ${usuario.lastName}`
											}))}
											styles={{
												option: (baseStyles, { isFocused, isSelected }) => ({
													...baseStyles,
													backgroundColor: isSelected ? '#E68C8C' : isFocused ? '#F5D1D1' : baseStyles.backgroundColor,
													borderRadius: '10px',
													':active': {
														backgroundColor: '#F5D1D1', // Cambiar color de fondo cuando la opción está activa
													},
												}),
												control: (baseStyles, isFocused) => ({
													...baseStyles,
													borderColor: 'black',
													borderRadius: '20px',
													borderWidth: '3px',
												}),
												input: (baseStyles) => ({
													...baseStyles,
													textAlign: 'center'
												}),
											}}
											onChange={(selectedOption) => {
												if (selectedOption) {
													setSelectedUsuario(selectedOption.value);
												}
											}}
											placeholder='Selecciona un usuario'
										/>
									</div>
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										Asunto del correo:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										<input
											type="text"
											className={(asuntoVacio() ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'} id='texto-general'
											placeholder='Ingresa el asunto'
											value={asunto}
											onChange={handleChangeAsunto}
										/>
									</div>
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										Cuerpo del correo:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										<textarea
											className={(cuerpoVacio() ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-lg w-full h-40 mx-5 my-2 p-2 text-black'} id='texto-general'
											placeholder='Ingresa el cuerpo del correo'
											value={cuerpo}
											onChange={handleChangeCuerpo}
											rows={6}
										/>
									</div>
								</div>
							</div>
							<div className="w-1/3 flex flex-col items-center ml-4 my-2">
								<div className="flex">
									<button type='button' onClick={()=> handlerSetParticipantes(true)} className={(seleccionInvalida() ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' text-white rounded p-2 mr-2'}>
					                Eliminar usuario
									</button>
									<button type='button' onClick={() => handlerSetParticipantes(false)} className={(seleccionInvalida() ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' text-white rounded p-2 ml-2'}>
					                Agregar Usuario
									</button>
								</div>
								<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-4 flex items-center justify-center text-black' id='texto-general'>
								Destinatarios
								</div>
								<div className="flex w-full">
									<textarea
										required
										value={correos}
										readOnly
										className={(correosVacios() ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-lg w-full h-40 p-2 text-black'} id='texto-general'
										placeholder='Participantes del evento'
										rows={6}
									/>
								</div>
								<div className="mt-2 flex justify-end">
									<button
										type="button"
										className={((correosVacios() || asuntoVacio() || cuerpoVacio()) ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button) + ' w-60 h-10 text-white py-2 px-4 rounded-lg'}
										onClick={handleSubmit}
									>
									Enviar correo electrónico
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			)}
		</>
	);
}