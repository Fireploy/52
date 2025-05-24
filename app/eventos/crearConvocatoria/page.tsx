'use client';
import Calendario from '@/components/calendario/calendario';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import {
	FormEvent,
	useEffect,
	useState
} from 'react';
import styles from '@/public/css/styles.module.scss';
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
	const [datosInvalido, setDatosInvalido] = useState(false);
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

	useEffect(()=>{
		let nuevosCorreos = '';
		for(const user of selectedUsuarios){
			nuevosCorreos += (user + '\n');
		}
		setCorreos(nuevosCorreos);
	}, [selectedUsuarios]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const check = fechainvalida || horaInvalida || (correos.length == 0);
		console.log(check);
		alert(1);
		if(check){
			setDatosInvalido(true);
		}else{
			alert(1);
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
			alert(1);
			try {
				await axios.post(`${apiEndpoint}/event/meet`, body, { headers: headers });
				router.push('/' + route + '/calendario');
			}catch(error){
				console.log(error);
			}
		}
	}

	return (
		<div className="container mx-auto mt-8">
			<div className="p-4 ">
				<form onSubmit={handleSubmit}>
					<div className='flex'>
						<div className="w-2/3 pr-4">
							<h1 className='text-center text-[400%]' id='titulos-grandes'>Nueva Convocatoria</h1>
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Entrenador encargado:
									</div>
								</div>
								<select onChange={(event)=>{setSelectedEntrenador(event.target.value);}}required className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general' placeholder='Entrenador encargado'>
									{entrenadores.map((entrenador) => (
										<option key={entrenador._id} value={entrenador._id} placeholder='Entrenador encargado'>
											{entrenador.name + entrenador.lastName + ' - ' + entrenador.cedula}
										</option>
									))}
								</select>
							</div>
							<div className="flex">
								<div className="w-1/3 mx-2">

									<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Fecha del evento
									</div>
								</div>
								<input
									required
									type="date"
									onChange={(event)=>{setFechaEvento(event.target.value); if(new Date(event.target.value) < new Date()) setFechainvalida(true); else setFechainvalida(false);}}
									className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general'
								/>
							</div>
							{fechainvalida && (
								<div className='flex justify-center'>
									<p className='text-red-500 mb-2'>La fecha no puede ser en un dia pasado</p>
								</div>

							)}

							<div className="flex items-center justify-center">
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Hora inicio
										</div>
									</div>
									<input
										required
										type="time"
										onChange={(event)=>{setHoraInicio(event.target.value);}}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general'
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
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general'
										placeholder='Descripcion general del evento'
									/>
								</div>
							</div>
							{horaInvalida && (
								<div className='flex justify-center'>
									<p className='text-red-500 mb-2'>La hora de inicio no puede ser antes que la de fin</p>
								</div>

							)}
							<div className="flex">
								<input
									required
									placeholder='Nombre del evento'
									onChange={(event)=>{setNombreEvento(event.target.value);}}
									type="text"
									className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general'
								/>
							</div>
							<div className="flex items-center justify-center">
								<input
									required
									type="text"
									onChange={(event)=>{setDescripcionEvento(event.target.value);}}
									className='bg-neutral-200 rounded-full w-full h-20 mx-5 my-2 pl-4 text-black' id='texto-general'
									placeholder='Descripcion general del evento'
								/>
							</div>
						</div>
						<div className="w-1/2 pr-4">
							<div className='flex justify-center'>
								<h1 className='text-center text-[400%]' id='titulos-grandes'>Participantes</h1>
							</div>
							<div className="flex">
								<select onChange={(event)=>{setNuevoParticipante((event.target.value));}} required className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general' placeholder='Entrenador encargado'>
									{usuarios.map((usuario) => (
										<option key={usuario.email} value={usuario.email} placeholder='Entrenador encargado'>
											{usuario.email}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-center justify-center">
								<textarea
									required
									value={correos}
									readOnly
									className='bg-neutral-200 h-full w-full h-20 mx-5 my-2 pl-4 text-black' id='texto-general'
									placeholder='Participantes del evento'
								/>
							</div>
							<div className="flex justify-center items-center mt-4 ">
								<button type='button' onClick={()=> handlerSetParticipantes(true)} className="bg-[#cd1919] text-white rounded p-2 mx-5">
					                Eliminar usuario
								</button>
								<button type='button' onClick={() => handlerSetParticipantes(false)} className={`${styles.button} p-2`}>
					                Agregar Usuarios
								</button>
							</div>
						</div>
					</div>
					<div className="flex justify-center items-center mt-4 ">
						<button
							type="submit"
							className='bg-[#cd1919] mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg' id='titulos-pequenos'
						>
                            Agregar Convocatoria
						</button>
						<button onClick={() => handlerCancelar()} className="bg-[#cd1919] text-white rounded p-2">
					        Cancelar
						</button>
					</div>
				</form>
			</div>
			{datosInvalido && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-[#141414] p-10 rounded-lg">
						<h3 className="text-white text-center mb-4 text-[175%]" id='titulos-grandes'>
								Los datos ingresados no son válidos, porfavor proporciona datos válidos
						</h3>
						<div className="flex justify-center">
							<button
								onClick={()=>setDatosInvalido(false)}
								className="bg-[#cd1919] w-full h-10 text-white py-2 px-4 mx-2 rounded-lg"
								id="titulos-pequenos"
							>
								Aceptar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
