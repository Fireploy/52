import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import { read } from 'fs';
import styles from '@/public/css/styles.module.scss';

export default function FinalizarEvento() {
  interface user {
    _id: string;
    name: string;
    lastName: string;
    birthDate: string;
    cedula: string;
    email: string;
    phone: string;
    address: string;
  }

  interface combats {
    boxer1: user;
    boxer2: user;
    winner: string;
    status: string;
    _id: string;
  }

  interface event {
    _id: string;
    name: string;
    combats: combats[];
  }
  interface Combat{
    battleId: string;
    status: string;
    winner: string;
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
  const router = useRouter();
  const EventId = useSearchParams().get('EventId');

  const [eventInfo, setEventInfo] = useState<event>({
  	_id: '',
  	name: '',
  	combats: [],
  });

  const [selectedWinners, setSelectedWinners] = useState<{ [key: string]: string }>({});
  const [combatesSeleccionados, setCombatesSeleccionados] = useState<Combat[]>([]);
  const [disable, setDisable] = useState(true);

  const handleSelection = (combatId: string, boxerId: string) => {
  	setSelectedWinners((prev) => ({
  		...prev,
  		[combatId]: boxerId,
  	}));
  	setDisable(eventInfo.combats.length > (Object.keys(selectedWinners).length + 1));
  };

  useEffect(() => {
  	console.log(selectedWinners);
  }, [selectedWinners]);

  const getEvent = async (token: string, eventId: string) => {
  	try {
  		const headers = {
  			sessiontoken: token,
  		};

  		const parametros = {
  			eventId: eventId,
  		};

  		const response = await axios.get(`${apiEndpoint}/event/Info`, {
  			headers: headers,
  			params: parametros,
  		});
  		return response.data.evento;
  	} catch (error) {
  		console.log(error);
  	}
  };

  const cargarEvento = async () => {
  	const datos = localStorage.getItem('userData');
  	let token;
  	if (datos != null) {
  		token = JSON.parse(datos).token;
  	}
  	setEventInfo(await getEvent(token, EventId as string));
  };

  const handlerSubmit = async () => {
  	let token;
  	const datos = localStorage.getItem('userData');
  	if (datos !== null) {
  		token = JSON.parse(datos).token;
  	}
  	const headers = {
  		sessiontoken: token,
  	};

  	const combats = eventInfo.combats.map((combat) => ({
  		battleId: combat._id,
  		status: 'winner',
  		winner: selectedWinners[combat._id]
  	})).filter((combat) => combat.winner);

  	const body = {
  		eventId: eventInfo._id,
  		combats: combats,
  	};

  	let route;
  	let rol;
	  if (datos !== null) {
  		rol = JSON.parse(datos).role;
  	}
  	if (rol === 'Entrenador') route = 'entrenador';
  	else route = 'administrador';

  	try {
  		await axios.patch(`${apiEndpoint}/event/result`, body, { headers });
  		router.push('/' + route + '/eventos/VerEvento?EventId=' + eventInfo._id);
  	} catch (error) {
  		console.log('Error:', error);
  	}
  };

  const volver = () => {
  	let token;
  	const datos = localStorage.getItem('userData');
  	if (datos !== null) {
  		token = JSON.parse(datos).token;
  	}
  	let rol;
	  if (datos !== null) {
  		rol = JSON.parse(datos).role;
  	}
	  let route;
	  if (rol === 'Entrenador') route = 'entrenador';
  	else route = 'administrador';

	  router.push('/' + route + '/eventos/VerEvento?EventId=' + eventInfo._id);
  };

  useEffect(() => {
  	cargarEvento();
  }, []);

  const ready = () => {
  	return eventInfo._id != '';
  };

  return (
  	<>
  		{!ready() && (<LoaderContenido/>)}
  		{ready() && (
  			<div className=' flex flex-col min-h-[600px] justify-center'>
  				<div className="p-2 m-3 mb-11">
  					<h1 className="text-white text-center">{eventInfo.name}</h1>
  				</div>
  				<div>
  					{eventInfo.combats.map((combat, index) => (
  						<div key={index} className="flex items-center justify-center mb-4">
  							<button
  								onClick={() => handleSelection(combat._id, combat.boxer1._id)}
  								className={`border border-white rounded-lg text-center w-[300px] p-2 ${
  									selectedWinners[combat._id] === combat.boxer1._id ? 'border-yellow-400 text-yellow-200' : 'border-white'
  								} hover:border-yellow-400`}
  							>
  								{combat.boxer1 ? combat.boxer1.name : 'Unknown'} {combat.boxer1 ? combat.boxer1.lastName : 'Unknown'}
  							</button>
  							<h1 className="p-4">VS</h1>
  							<button
  								onClick={() => handleSelection(combat._id, combat.boxer2._id)}
  								className={`border border-white rounded-lg text-center w-[300px] p-2 ${
  									selectedWinners[combat._id] === combat.boxer2._id ? 'border-yellow-400 text-yellow-200' : 'border-white'
  								} hover:border-yellow-400`}
  							>
  								{combat.boxer2 ? combat.boxer2.name : 'Unknown'} {combat.boxer2 ? combat.boxer2.lastName : 'Unknown'}
  							</button>
  						</div>
  					))}
  				</div>
  				<div className="flex justify-center">
				  <button type="button" onClick={volver} className={`${styles.button}  text-white rounded p-2 text-center w-[200px] m-11`}>
		Volver
  					</button>
  					<button type="button" onClick={handlerSubmit} disabled={disable} className={`${disable ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button}  text-white rounded p-2 text-center w-[200px] m-11`}>
		Cargar resultados
  					</button>
  				</div>
  				<div className='flex justify-end'>
  					<label className='border border-yellow-400 text-yellow-200 p-2 mx-3 rounded-lg'>Ganador seleccionado</label>
  				</div>
  			</div>
  		)}
  	</>
  );
}
