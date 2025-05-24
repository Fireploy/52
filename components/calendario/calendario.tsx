
import { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';
import { LoaderContenido } from '@/components/loaderContenido';

interface formatedEvents {
    id: string,
    title: string,
    start: Date,
    end: Date,
    backgroundColor: string,
    extendedProps: any
}
export default function CalendarioEventos() {

	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const[events, setEvents] = useState<formatedEvents[]>([]);
	const router = useRouter();

	const cargaEventos = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		const events = await getEvents(token);

		let formatedEvents = getFormatedEvents(events);
		setEvents(formatedEvents);
	};

	const getEvents = async (token: any): Promise<any> => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const response = await axios.get(`${apiEndpoint}/event`, {
				headers: headers,
			});
			console.log(response.data.eventos);
			return response.data.eventos;
		} catch (error) {
			console.log(error);
		}
	};

	const getFormatedEvents = (events: any) => {
		let result: formatedEvents[] = [];
		for(const event of events){
			const e:formatedEvents = { id: '1', title: '1', start: new Date, end: new Date, backgroundColor: '000', extendedProps: {} };
			e.id = event._id;
			e.title = event.name;
			e.start = new Date(event.startsAt);
			e.start.setHours(e.start.getHours() + 5);
			e.end = new Date(event.endsAt);
			e.end.setHours(e.end.getHours() + 5);
			let color = '#cd1919';
			if(event.type == 'Reunion') color = '#cd1919';
			e.backgroundColor = color;
			e.extendedProps.description = event.description;
			result.push(e);
		}
		return result;
	};

	useEffect(() => {
		cargaEventos();
	}, []);

	return (
		<>
			{events.length == 0 && (<LoaderContenido/>)}
			{events.length != 0 && (
				<div>
					<div>
						<h1 className="text-5xl text-white mb-4 mt-[5%]">CALENDARIO DE EVENTOS</h1>
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							locales={[esLocale]}
							initialView={'dayGridMonth'}
							headerToolbar={{
								start: 'today prev,next',
								center: 'title',
								end: 'dayGridMonth,timeGridWeek,timeGridDay',
							}}
							events={events}
							eventClick={(info) => {
								const e = info.event;
								const datos = localStorage.getItem('userData');
								let role;
								if(datos != null){
									role = JSON.parse(datos).role;
								}
								if(role == 'Admin') role = 'administrador';
								router.push('/' + (role as string).toLowerCase() + '/eventos/VerEvento?EventId=' + info.event.id as string);
							}}
							height={'90vh'}
						/>
					</div>
				</div>
			)}
		</>
	);
}