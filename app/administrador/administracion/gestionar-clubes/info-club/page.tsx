'use client';

import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	useEffect,
	useState
} from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';

interface FormData {
    name: string;
    description: string;
}

export default function InfoClub() {
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const clubId = useSearchParams().get('clubId');
	const [datosClub, setDatosClub] = useState<FormData>({
		name: '',
		description: ''
	});

	const getClub = async (token:string, clubId: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const params = {
				clubId: clubId,
			};
			const response = await axios.get(`${apiEndpoint}/club`, {
				headers: headers,
				params: params
			});
			console.log(response.data.club);
			return response.data.club;
		} catch (error) {
			console.log(error);
		}
	};
	const cargarClub = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setDatosClub(await getClub(token, clubId as string));
	};
	useEffect(()=>{
		cargarClub();
	}, []);

	const datosCargados = () => {
		return datosClub.name != '' && datosClub.description != '';
	};
	return (
		<>
			{!datosCargados() && (
				<LoaderContenido/>
			)}
			{datosCargados() && (
				<div className="container mx-auto mt-8">
					<h1 className='text-center text-[400%]' id='titulos-grandes'>INFORMACIÓN CLUB</h1>
					<div className='flex items-center justify-center'>
						<svg
							className="my-1"
							xmlns="http://www.w3.org/2000/svg"
							height="6em"
							viewBox="0 0 640 512"
							fill="#ffffff"
						>
							<path d="M0 24C0 10.7 10.7 0 24 0H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 48 0 37.3 0 24zM0 488c0-13.3 10.7-24 24-24H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zM83.2 160a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM32 320c0-35.3 28.7-64 64-64h96c12.2 0 23.7 3.4 33.4 9.4c-37.2 15.1-65.6 47.2-75.8 86.6H64c-17.7 0-32-14.3-32-32zm461.6 32c-10.3-40.1-39.6-72.6-77.7-87.4c9.4-5.5 20.4-8.6 32.1-8.6h96c35.3 0 64 28.7 64 64c0 17.7-14.3 32-32 32H493.6zM391.2 290.4c32.1 7.4 58.1 30.9 68.9 61.6c3.5 10 5.5 20.8 5.5 32c0 17.7-14.3 32-32 32h-224c-17.7 0-32-14.3-32-32c0-11.2 1.9-22 5.5-32c10.5-29.7 35.3-52.8 66.1-60.9c7.8-2.1 16-3.1 24.5-3.1h96c7.4 0 14.7 .8 21.6 2.4zm44-130.4a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM321.6 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
						</svg>
					</div>
					<form>
						<div className="max-w-xl mx-auto my-5">
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                    Nombre:
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
										{datosClub.name}
									</div>
								</div>
							</div>
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                    Descripción:
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<textarea className='bg-neutral-200 rounded-lg w-full h-40 mx-5 my-2 flex items-center justify-center text-black p-2' id='texto-general' disabled rows={6}>
										{datosClub.description}
									</textarea>
								</div>
							</div>
						</div>
						<div className="mt-5 flex justify-center">
							<Link href='/administrador/administracion/gestionar-clubes'>
								<button
									type="button"
									className={styles.button + ' mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg'}
								>
                                Volver
								</button>
							</Link>
						</div>
					</form>
				</div>
			)}
		</>
	);
};