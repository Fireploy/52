'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
export default function CrearConvocatoria() {
	const[entrenadores, setEntrenadores] = useState<User[]>([]);
	const[usuarios, setUsuarios] = useState<User[]>([]);
	const[correos, setCorreos] = useState('');
	const [selectedEntrenador, setSelectedEntrenador] = useState('');
	const [fechaEvento, setFechaEvento] = useState('');
	const [horaInicio, setHoraInicio] = useState('');
	const [horaFin, setHoraFin] = useState('');
	const [nombreEvento, setNombreEvento] = useState('');
	const [descripcionEvento, setDescripcionEvento] = useState('');
	const [fechainvalida, setFechainvalida] = useState(false);
	const [horaInvalida, setHoraInvalida] = useState(false);
	const [nuevoParticipante, setNuevoParticipante] = useState('');
	const [selectedUsuarios, setSelectedUsuarios] = useState<String[]>([]);
	const [eliminar, setEliminar] = useState(true);
	const [botonListo, setBotonListo] = useState(true);
	const [fechaRepetida, setFechaRepetida] = useState (false);
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const router = useRouter();
	const getEntrenadores = async (token:string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const parametros = {
				role: 'Entrenador',
			};

			const response = await axios.get(`${apiEndpoint}/users/List`, {
				headers: headers,
				params: parametros
			});
			return response.data.users;
		} catch (error) {
			console.log(error);
		}
	};

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
	const cargaEntrenadores = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		const result = await getEntrenadores(token);
		setEntrenadores(result);
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

	useEffect(() => {
		cargaEntrenadores();
		cargarUsuarios();
	}, []);

	useEffect(() => {
		setBotonListo(botonValido);
	}, [fechaEvento, nombreEvento, selectedEntrenador, horaFin, horaInicio, descripcionEvento, correos]);

	function handlerCancelar() {
		const datos = localStorage.getItem('userData');
		let rol;
		let route;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		if(rol == 'Entrenador') route = 'entrenador';
		else route = 'administrador';
		router.push('/' + route + '/calendario');
	}

	useEffect(()=>{
		if(typeof horaInicio == typeof horaFin){
			if(horaInicio.length > 1){
				const horaI = horaInicio.split(':');
				const horaF = horaFin.split(':');
				if(parseInt(horaI[0]) > parseInt(horaF[0])){
					setHoraInvalida(true);
				}else{
					if(parseInt(horaI[0]) == parseInt(horaF[0])){
						if(parseInt(horaI[1]) < parseInt(horaF[1])){
							setHoraInvalida(false);
						}else{
							setHoraInvalida(true);
						}
					}else{
						setHoraInvalida(false);
					}
				}
			}
		}else{
			setHoraInvalida(true);
		}
	}, [horaFin, horaInicio]);

	function handlerSetParticipantes(eliminar: boolean) {
		let users = [...selectedUsuarios];
		const indice = users.indexOf(nuevoParticipante);
		if(nuevoParticipante !== '' && nuevoParticipante !== ' '){
			if(eliminar){
				if (indice != -1) {
					users.splice(indice, 1);
				}
			}else{
				if (indice == -1) {
					users.push(nuevoParticipante);
				}
			}
			setSelectedUsuarios(users);
		}
	}

	useEffect(()=>{
		let nuevosCorreos = '';
		for(const user of selectedUsuarios){
			nuevosCorreos += (user + '\n');
		}
		setCorreos(nuevosCorreos);
	}, [selectedUsuarios]);

	async function handlerSubmit() {
		let token;
		const datos = localStorage.getItem('userData');
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		const headers = {
			sessiontoken: token,
		};

		const body = {
			trainer: selectedEntrenador,
			date: fechaEvento,
			startsAt: horaInicio,
			endsAt: horaFin,
			name: nombreEvento,
			description: descripcionEvento,
			participants: selectedUsuarios,
		};
		let rol;
		let route;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		if(rol == 'Entrenador') route = 'entrenador';
		else route = 'administrador';
		try {
			await axios.post(`${apiEndpoint}/event/meet`, body, { headers: headers });
			router.push('/' + route + '/calendario');
		}catch(error){
			setFechaRepetida(true);
			console.log(error);
		}
	}

	const ready = () => {
		return entrenadores.length != 0 && usuarios.length != 0;
	};

	const nombreValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
		return soloLetras.test(nombreEvento);
	};
	const nombreVacio = () => {
		return nombreEvento == '';
	};

	const botonValido = () =>{
		return (selectedEntrenador !== '' && selectedEntrenador !== 'Selecciona un entrenador') && (fechaEvento !== '' && !fechainvalida) && (horaInicio !== '' && horaFin !== '' && !horaInvalida) && nombreEvento !== '' && descripcionEvento !== '' && (correos !== '');
	};

	const opcionesEntrenadores = entrenadores.map((entrenador) => ({
		value: entrenador._id,
		label: `${entrenador.name} ${entrenador.lastName}`
	  }));

	  const opcionesCombatientes = usuarios.map((usuario) => ({
		value: usuario.email,
		label: usuario.name + ' ' + usuario.lastName + ' (' + usuario.email + ')'
	}));

	return (
		<>
			{!ready() && (<LoaderContenido/>)}
			{ready() && (
				<div className="container mx-auto mt-8">
					<div className="p-4 ">
						<form onSubmit={handlerSubmit}>
							<div className='flex'>
								<div className="w-2/3 pr-4">
									<h1 className='text-center text-[400%]' id='titulos-grandes'>Nueva Convocatoria</h1>
									<div className="flex">
										<div className="w-1/3 mx-2">
											<div className='w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Entrenador encargado
											</div>
										</div>
										<Select
											className='"bg-white text-black w-full h-10 mx-5 my-2 pl-1 text-black"'
											id="texto-general"
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
											placeholder='Selecciona un entrenador'
											options={opcionesEntrenadores}
											value={opcionesEntrenadores.find((opcion) => opcion.value === selectedEntrenador)}
											onChange={(selectedOption) => setSelectedEntrenador(selectedOption?.value || '')}
										/>
									</div>
									<div className="flex">
										<div className="w-1/3 mx-2">

											<div className='w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Fecha del evento
											</div>
										</div>
										<input
											required
											type="date"
											onChange={(event)=>{setFechaEvento(event.target.value); if(new Date(event.target.value) < new Date()) setFechainvalida(true); else setFechainvalida(false);}}
											className={`${fechaEvento === '' ? 'border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`} id='texto-general'
										/>
									</div>
									{fechainvalida && (
										<div className='flex ps-[28%]'>
											<p className='text-red-500 mb-2'>La fecha no puede ser en un día anterior a la fecha de hoy</p>
										</div>

									)}

									<div className="flex items-center justify-center">
										<div className="flex">
											<div className="w-1/3 mx-4">
												<div className='w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Hora inicio
												</div>
											</div>
											<input
												required
												type="time"
												onChange={(event)=>{setHoraInicio(event.target.value);}}
												className={`${horaInicio === '' ? 'border-[3px] border-red-700 ' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`} id='texto-general'
												placeholder='Descripcion general del evento'
											/>
										</div>
										<div className="flex">
											<div className="w-1/3 mx-2">
												<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Hora fin
												</div>
											</div>
											<input
												required
												type="time"
												onChange={(event)=>{setHoraFin(event.target.value);}}
												className={`${horaFin === '' ? 'border-[3px] border-red-700 ' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
												id='texto-general'
												placeholder='Descripcion general del evento'
											/>
										</div>
									</div>
									{horaInvalida && (
										<div className='flex justify-center'>
											<p className='text-red-500 mb-2'>La hora de fin no puede corresponder a una hora anterior a la hora de inicio</p>
										</div>

									)}
									<div className="flex">
										<input
											required
											placeholder='Nombre del evento'
											onChange={(event)=>{setNombreEvento(event.target.value);}}
											type="text"
											className={(nombreEvento === '' ? 'border-[3px] border-red-700 ' : '') + ' bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'} id='texto-general'
										/>
									</div>
									<div className="flex items-center justify-center">
										<input
											required
											type="text"
											onChange={(event)=>{setDescripcionEvento(event.target.value);}}
											className={(descripcionEvento === '' ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-lg w-full h-20 mx-5 my-2 pl-4 text-black'} id='texto-general'
											placeholder='Descripcion general del evento'
										/>
									</div>
								</div>
								<div className="w-1/2 pr-4">
									<div className='flex justify-center'>
										<h1 className='text-center text-[400%]' id='titulos-grandes'>Participantes</h1>
									</div>
									<div className="flex">
										<Select
											className="text-black w-full h-10 mx-5 my-2 pl-1"
											id="texto-general"
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
												menu: (baseStyles) => ({
													...baseStyles,
													borderRadius: '12px'
												}),
											}}
											placeholder='Selecciona un deportista'
											options={opcionesCombatientes}
											value={opcionesCombatientes.find((opcion) => opcion.value === nuevoParticipante)}
											onChange={(selectedOption) => setNuevoParticipante(selectedOption?.value || '')}
										/>
									</div>
									<div className="flex items-center justify-center">
										<textarea
											required
											value={correos}
											readOnly
											className={(correos === '' ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-lg w-full h-20 mx-5 my-2 p-4 text-black'} id='texto-general'
											placeholder='Participantes del evento'
										/>
									</div>
									<div className="flex justify-center items-center mt-4 ">
										<button type='button' onClick={()=> handlerSetParticipantes(true)} className={`${correos !== '' ? styles.button : styles.buttonDisabled + ' cursor-not-allowed'} p-2 mx-5`}>
					                Eliminar usuario
										</button>
										<button type='button' onClick={() => handlerSetParticipantes(false)} className={`${styles.button} p-2 mx-5`}>
					                Agregar Usuario
										</button>
									</div>
								</div>
							</div>
							<>
								{fechaRepetida && (
									<p className='text-center p-4 text-[125%] text-red-600'>Ya hay un evento programado para esa fecha</p>
								)}
							</>
							<div className="flex justify-center items-center mt-4 ">
								<button type='button' onClick={() => handlerSubmit()}className={`${botonListo ? styles.button : styles.buttonDisabled + ' cursor-not-allowed'} p-2 mx-5`}>
					        Agregar convocatoria
								</button>
								<button onClick={() => handlerCancelar()} className={`${styles.button} p-2 mx-5`}>
					        Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
