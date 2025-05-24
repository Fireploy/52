
import CalendarioEventos from '@/components/calendario/calendario';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/public/css/styles.module.scss';

export default function Calendario() {
	const [crear, setCrear] = useState(false);
	const router = useRouter();

	const handlerCrear = (route:string)=> {
		const datos = localStorage.getItem('userData');
		let rol;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		if(rol == 'Admin') rol = 'administrador';
		if(rol == 'Entrenador') rol = 'entrenador';
		router.push('/' + rol + '/eventos/Crear' + route);
	};
	useEffect(()=>{
		const datos = localStorage.getItem('userData');
		let rol;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
		console.log(rol);
		setCrear(rol == 'Admin' || rol == 'Entrenador');
	}, []);

	return (
		<div>
			<div className="container mx-auto mt-8">
				<div className="p-4 ">
					<CalendarioEventos></CalendarioEventos>
				</div>
			</div>
			{crear && (
				<div className="container flex justify-end items-end mt-4 ">
					<button type='button' onClick={() => handlerCrear('Convocatoria')}className={`${styles.button} p-2 mx-5`}>
										Crear convocatoria
					</button>
					<button onClick={() => handlerCrear('Torneo')} className={`${styles.button} p-2`}>
										Crear Torneo
					</button>
				</div>
			)}
		</div>
	);
}