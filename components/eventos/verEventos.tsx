
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderContenido } from '@/components/loaderContenido';
import { parse } from 'path';
import styles from '@/public/css/styles.module.scss';

interface user {
    _id: string,
    name: string,
    lastName: string,
    birthDate: string,
    cedula: string,
    email: string,
    phone: string,
    address: string,
}

interface combats {
    boxer1: user,
    boxer2: user,
    winner: String,
    status: String,
    _id: String,
}

interface event {
    _id: String,
    type: String,
    trainer: String,
    name: String,
    description: String,
    startsAt: String,
    endsAt: String,
    participants: user[],
    combats: combats[]
}
export default function VerEvento() {
	const [eventInfo, setEventInfo] = useState<event>({
		_id: '',
		type: '',
		trainer: '',
		name: '',
		description: '',
		startsAt: '',
		endsAt: '',
		participants: [],
		combats: [],
	  });
	const [fechaEvento, setFechaEvento] = useState<String>();
	const [entrenador, setEntrenador] = useState<user>({
		_id: '',
		name: '',
		lastName: '',
		birthDate: '',
		cedula: '',
		email: '',
		phone: '',
		address: '',
	  });
	const [horaI, sethoraI] = useState<String>();
	const [horaF, sethoraF] = useState<String>();
	const[correos, setCorreos] = useState('');
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const router = useRouter();
	const EventId = useSearchParams().get('EventId');
	const dia = new Date();

	const getEvent = async (token:string, eventId: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const parametros = {
				eventId: eventId,
			};

			const response = await axios.get(`${apiEndpoint}/event/Info`, {
				headers: headers,
				params: parametros
			});
			//console.log(response.data.evento);
			return response.data.evento;
		} catch (error) {
			console.log(error);
		}
	};

	const puedeFinalizar = () => {
		const datos = localStorage.getItem('userData');
		let rol;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		return rol === 'Admin';
	};

	useEffect (()=>{puedeFinalizar();}, []);

	const getEntrenador = async (token:string, entrenadorId: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const parametros = {
				userId: entrenadorId,
			};

			const response = await axios.get(`${apiEndpoint}/users`, {
				headers: headers,
				params: parametros
			});
			return response.data.user;
		} catch (error) {
			console.log(error);
		}
	};

	const cargarEvento = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setEventInfo(await getEvent(token, EventId as string));
	};

	const cargarEntrenador = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setEntrenador(await getEntrenador(token, eventInfo.trainer as string));
	};

	const cargarTiempos = () => {
		const fecha = eventInfo.startsAt.split('T')[0];
		setFechaEvento(fecha);
		const horaI = eventInfo.startsAt.split('T')[1].split(':');
		const hI = horaI[0] + ':' + horaI[1];
		const horaF = eventInfo.endsAt.split('T')[1].split(':');
		const hF = horaF[0] + ':' + horaF[1];
		sethoraI(hI);
		sethoraF(hF);
	};

	const cargarParticipantes = () => {
		let nuevosCorreos = '';
		for(const user of eventInfo.participants){
			nuevosCorreos += (user.email + '\n');
		}
		setCorreos(nuevosCorreos);
	};

	useEffect(()=>{
		cargarEvento();
	}, []);

	useEffect(()=>{
		if(eventInfo._id != ''){
			cargarTiempos();
			cargarEntrenador();
			if(eventInfo.type == 'Reunion'){
				cargarParticipantes();
			}

		}
	}, [eventInfo]);

	const handleClick = () => {
		const datos = localStorage.getItem('userData');
		let rol;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		if(rol == 'Admin') rol = 'administrador';
		rol = (rol as string).toLowerCase();
		router.push('/' + rol + '/calendario');
	};
	const handleClickFinalizar = () => {
		const datos = localStorage.getItem('userData');
		let rol;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		if(rol == 'Admin') rol = 'administrador';
		rol = (rol as string).toLowerCase();
		router.push('/' + rol + '/eventos/finalizarEvento?EventId=' + EventId);
	};

	const fechaPermitida = () => {
		let comparador = eventInfo.startsAt.split('-');
		return ((dia.getFullYear() >= parseInt(comparador[0])) && (dia.getMonth() + 1 >= parseInt(comparador[1])) && (dia.getDate() >= parseInt(comparador[2])));
	};

	return (
		<>
			{eventInfo._id == '' && (<LoaderContenido/>)}
			{eventInfo._id != '' && (
				<div className="container mx-auto mt-8">
					<div className="p-4 ">

						<div className='flex w-full'>
							<div className="w-2/3 pr-4">
								<h1 className='text-center text-[400%]' id='titulos-grandes'>Información del evento</h1>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className=' w-full h-10 mx-5 my-2 flex items-center justify-center text-white text-end' id='texto-general'>
										Nombre del evento
										</div>
									</div>
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										{eventInfo?.name}
									</div>
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className=' w-full h-10 mx-5 my-2 flex items-center justify-center text-white text-end' id='texto-general'>
										Tipo de evento
										</div>
									</div>
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										{eventInfo.type}
									</div>
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='w-full h-10 mx-5 my-2 flex items-center justify-center text-white text-end' id='texto-general'>
										Entrenador a cargo
										</div>
									</div>
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										{(entrenador && entrenador.name && entrenador.lastName && entrenador.cedula) ? (entrenador.name + ' ' + entrenador.lastName + ' - ' + entrenador.cedula) : 'Entrenador no asignado'}
									</div>
								</div>

								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white text-end' id='texto-general'>
										Fecha del evento
										</div>
									</div>
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										{fechaEvento}
									</div>
								</div>
								<div className='flex'>
									<div className="flex w-full">
										<div className="w-1/3 mx-2">
											<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white text-end' id='texto-general'>
										Descripcion del evento
											</div>
										</div>
										<textarea readOnly defaultValue={eventInfo?.description as string} className='bg-neutral-200  h-[100px] rounded-lg w-2/3 ms-[35px] my-2 p-4 flex items-center justify-center text-black' id='texto-general'>

										</textarea>
									</div>
									<div>
										<div className="flex w-full justify-items-end justify-end">
											<div className=' h-10 ms-5 me-3 my-2 flex w-[70px] items-center justify-center text-white ' id='texto-general'>
										Hora inicio
											</div>
											<div className='bg-neutral-200 rounded-full w-[100px] h-10 me-5 my-2 flex items-center justify-center text-black' id='texto-general'>
												{horaI}
											</div>
										</div>
										<div className="flex w-full justify-items-end justify-end">
											<div className='h-10 ms-5 me-3 my-2 flex  w-[70px] items-center justify-center text-white ' id='texto-general'>
										Hora fin
											</div>
											<div className='bg-neutral-200 rounded-full w-[100px] h-10 me-5 my-2 flex items-center justify-center text-black' id='texto-general'>
												{horaF}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="w-1/3 pr-4">
								{(eventInfo.type == 'Reunion') && (
									<div className=" w-full  pr-4">
										<div className='flex justify-center'>
											<h1 className='text-center text-[400%]' id='titulos-grandes'>Participantes</h1>
										</div>
										<div className="flex items-center justify-center h-[250px]">
											<textarea
												required
												value={correos}
												readOnly
												className='bg-neutral-200 rounded-lg h-full w-full mx-5 my-2 p-4 text-black' id='texto-general'
												placeholder='Participantes del evento'
											/>
										</div>
									</div>
								)}
								{(eventInfo.type == 'Combate' && eventInfo.combats[0].status == 'En espera de resultados') && (
									<div className=" w-full  pr-4">
										<div className='flex justify-center'>
											<h1 className='text-center text-[400%]' id='titulos-grandes'>Combatientes</h1>
										</div>
										{eventInfo.combats.map((combat, index) => (
											<div key={index} className="flex items-center justify-center mb-4">
												<label className='border border-white rounded-lg text-center w-56'>
													{combat.boxer1 ? combat.boxer1.name : 'Unknown'}  {' '} {combat.boxer1 ? combat.boxer1.lastName : 'Unknown'}
												</label>
												<h1 className='p-4'>VS</h1>
												<label className='border border-white rounded-lg text-center w-56'>
													{combat.boxer2 ? combat.boxer2.name : 'Unknown'} {' '} {combat.boxer1 ? combat.boxer1.lastName : 'Unknown'}
												</label>
											</div>
										))}

										{puedeFinalizar() && (
											<div className='flex items-center justify-center'>
												<button type='button' onClick={() => handleClickFinalizar()} disabled={!fechaPermitida()} className={`${fechaPermitida() ? styles.button : styles.buttonDisabled + ' cursor-not-allowed '} text-white rounded p-2 text-center w-[200px]`}>
					        				Finalizar torneo
												</button>
											</div>
										)}

									</div>
								)}
								{(eventInfo.type == 'Combate' && eventInfo.combats[0].status == 'Finalizado') && (
									<div className=" w-full  pr-4">
										<div className='flex justify-center'>
											<h1 className='text-center text-[400%]' id='titulos-grandes'>Combatientes</h1>
										</div>
										{eventInfo.combats.map((combat, index) => (
											<div key={index} className="flex items-center justify-center mb-4">
												<label className={`border ${combat.winner === combat.boxer1._id ? 'border-yellow-400 text-yellow-200' : 'border-white'} rounded-lg text-center w-56`}>
													{combat.boxer1 ? combat.boxer1.name : 'Unknown'}  {' '} {combat.boxer1 ? combat.boxer1.lastName : 'Unknown'}
												</label>
												<h1 className='p-4'>VS</h1>
												<label className={`border ${combat.winner === combat.boxer2._id ? 'border-yellow-400 text-yellow-200' : 'border-white '} rounded-lg text-center w-56`}>
													{combat.boxer2 ? combat.boxer2.name : 'Unknown'} {' '} {combat.boxer1 ? combat.boxer1.lastName : 'Unknown'}
												</label>
											</div>
										))}

									</div>
								)}
							</div>
						</div>
						<div className="flex  justify-center items-center mt-4 ">
							<button type='button' onClick={() => handleClick()} className={styles.button + '  text-white rounded p-2 mx-5 w-[300px]'}>
					        volver
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
