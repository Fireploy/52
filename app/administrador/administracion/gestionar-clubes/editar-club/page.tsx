'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	FormEvent,
	useEffect,
	useState
} from 'react';
import { LoaderContenido } from '@/components/loaderContenido';

interface FormData {
  name: string;
  description: string;
}
import styles from '@/public/css/styles.module.scss';

export default function EditarClub() {
	const [repetido, setRepetido] = useState(false);
	const [actualizado, setActualizado] = useState(false);
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const clubId = useSearchParams().get('clubId');
	const [nuevosDatosClub, setNuevosDatosClub] = useState<FormData>({
		name: '',
		description: '',
	});
	const [cargado, setCargado] = useState(false);

	const getClub = async (token: string, clubId: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const params = {
				clubId: clubId,
			};
			const response = await axios.get(`${apiEndpoint}/club`, {
				headers: headers,
				params: params,
			});
			return response.data.club;
		} catch (error) {
			console.log(error);
		}
	};
	const cargarClub = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if (datos != null) {
			token = JSON.parse(datos).token;
		}
		setNuevosDatosClub(await getClub(token, clubId as string));
		setCargado(true);
	};
	useEffect(() => {
		cargarClub();
	}, []);
	const router = useRouter();

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setNuevosDatosClub((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const actualizarClub = async (
		token: string,
		clubId: string,
		club: FormData
	) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const params = {
				clubId: clubId,
			};
			const body = {
				name: club.name,
				description: club.description,
			};
			const response = await axios.patch(`${apiEndpoint}/club`, body, {
				headers: headers,
				params: params,
			});
			setActualizado(true);
		} catch (error) {
			setRepetido(true);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const datos = localStorage.getItem('userData');
		let token;
		if (datos != null) {
			token = JSON.parse(datos).token;
		}
		await actualizarClub(token, clubId as string, nuevosDatosClub);
	};

	const datosCargados = () => {
		return nuevosDatosClub.name != '' && nuevosDatosClub.description != '';
	};

	const nombreVacio = () => {
		return nuevosDatosClub.name === '';
	};

	const descripcionVacio = () => {
		return nuevosDatosClub.description === '';
	};

	return (
		<>
			{!cargado && <LoaderContenido></LoaderContenido>}
			{cargado && (
				<div className="container mx-auto mt-8">
					<h1 className="text-center text-[400%]" id="titulos-grandes">
            EDITAR CLUB
					</h1>
					<div className="flex items-center justify-center">
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
					<form onSubmit={handleSubmit}>
						<div className="max-w-xl mx-auto my-5">
							<div className="flex">
								<div className="w-1/3 m-0">
									<div
										className="bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black"
										id="texto-general"
									>
                    Nombre:
									</div>
								</div>
								<div className="w-2/3 mx-2" id="texto-general">
									<input
										required
										type="text"
										name="name"
										value={nuevosDatosClub.name}
										onChange={handleInputChange}
										className={
											(nombreVacio() ? 'border-[3px] border-red-700 ' : '') +
                      'bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										}
										placeholder="Ingrese el nombre"
									/>
								</div>
							</div>
							<div className="flex">
								<div className="w-1/3 m-0">
									<div
										className="bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black"
										id="texto-general"
									>
                    Descripción:
									</div>
								</div>
								<div className="w-2/3 mx-2" id="texto-general">
									<textarea
										name="description"
										required
										value={nuevosDatosClub.description}
										onChange={handleInputChange}
										className={
											(descripcionVacio()
												? 'border-[3px] border-red-700 '
												: '') +
                      'bg-neutral-200 rounded-lg w-full mx-5 my-2 p-2 text-black'
										}
										rows={6} // Esto define el número de filas visibles del textarea
										placeholder="Ingrese la descripción"
									/>
								</div>
							</div>
						</div>
						<div className="mt-5 flex justify-center">
							<button
								type="submit"
								disabled={nombreVacio() || descripcionVacio()}
								className={
									(nombreVacio() || descripcionVacio()
										? styles.buttonDisabled + ' cursor-not-allowed'
										: styles.button) +
                  ' mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg'
								}
							>
                Guardar cambios
							</button>
						</div>
					</form>
					{repetido && (
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<div className="bg-[#141414] p-10 rounded-lg">
								<h3
									className="text-white text-center mb-4 text-[175%]"
									id="titulos-grandes"
								>
                  Existe un club que posee alguno de los nuevos datos
								</h3>
								<div className="flex justify-center">
									<button
										onClick={() => setRepetido(false)}
										className="bg-[#cd1919] w-full h-10 text-white py-2 px-4 mx-2 rounded-lg"
									>
                    Aceptar
									</button>
								</div>
							</div>
						</div>
					)}
					{actualizado && (
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<div className="bg-[#141414] p-10 rounded-lg">
								<h3
									className="text-white text-center mb-4 text-[175%]"
									id="titulos-grandes"
								>
                  Club actualizado con exito
								</h3>
								<button
									onClick={() => {setActualizado(false);}}
									className={styles.button + ' w-full h-10 text-white py-2 px-4 mx-2 rounded-lg'}
								>
                    Aceptar
								</button>
							</div>
						</div>
					)}
					<div className="flex justify-center">
						<button
							onClick={() =>
								router.push('/administrador/administracion/gestionar-clubes')
							}
							className={styles.button + ' h-10 text-white py-2 px-4 mx-2 rounded-lg w-[10%] mt-4'}
						>
              Volver
						</button>
					</div>
				</div>
			)}
		</>
	);
}
