'use client';

import { obtenerFotoPerfil } from '@/app/lib/basic_request';
import OpcionesCategorias from '@/components/OpcionesCategorias';
import OpcionesClubes from '@/components/OpcionesClubes';
import { ModalImage } from '@/components/imgLoader/ModalImageInput/ModalImage';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';

interface FormData {
	_id: string;
	name: string;
	lastName: string;
	phone: string;
	club: string;
	weightCategory: string;
	weight: number;
	image: string
  }

export default function EditarDeportista() {

	//TRAER ID DE USUARIO DE LA URL
	const valor = useSearchParams();
	const id = valor.get('id');
	const [viewModal, setViewModal] = useState(false);
	const [botonListo, setBotonListo] = useState(false);

	const [datosDeportista, setDatosDeportista] = useState<FormData>({
		_id: '',
		name: '',
		lastName: '',
		phone: '',
		club: '',
		weightCategory: '',
		weight: 0,
		image: ''
	});

	const handleChange = (field: keyof FormData, value: string) => {
		setDatosDeportista((prevFormData) => ({
			...prevFormData,
			[field]: value
		}));
	};

	//Método de cargar los usuarios del localStorage
	const cargarUsuarios = async () => {
		const datos = localStorage.getItem('userData');
		var arreglo;

		if (datos != null) {
			arreglo = JSON.parse(datos);
		}
		const dataDeportista = await cargaDeportista(arreglo);
		if(id != null) setDatosDeportista({ ... dataDeportista.data.user, ['image']: await obtenerFotoPerfil(id) });
	};

	//Consumir endpoint
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	async function cargaDeportista(datos: { token: any }): Promise<any> {
		try {
			const headers = {
				sessiontoken: datos.token
			};
			const parametros = {
				userId: id
			};

			const response = await axios.get(`${apiEndpoint}/users`, {
				params: parametros,
				headers: headers
			});

			return response;

			//console.log(response);
		} catch (error) {
			console.log(error);
		}
	}

	const handleChangeImage = () => {
		setViewModal(true);
	};

	//FUNCIÓN PARA GUARDAR LA INFO Y ENVIAR A LA BASE DE DATOS
	async function handleGuardarCambios(): Promise<void> {
		const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
		try{
			const datos = localStorage.getItem('userData');
			var arreglo;

			if (datos != null) {
				arreglo = JSON.parse(datos);
			}

			const parametro = {
				userId: id,
			};

			const cabeza = {
				sessiontoken: arreglo.token,
			};

			const body = {
				name: datosDeportista.name,
				lastName: datosDeportista.lastName,
				weight: Number(datosDeportista.weight),
				phone: datosDeportista.phone,
				club: datosDeportista.club,
				weightCategory: datosDeportista.weightCategory,
			};

			const response = await axios.patch(`${apiEndpoint}/users/Deportista`, body, {
				headers: cabeza,
				params: parametro,
			});
			window.location.href = `/administrador/info-usuario/deportista?id=${response.data.user._id}`;
		} catch (error) {
			console.log(error);
		}

	};

	//UseEffect para pruebas
	var cargado = false;
	useEffect(() => {
		cargarUsuarios();
		cargado = true;
	}, [!cargado]);

	useEffect (() => {
		setBotonListo(botonValido());
	}, [datosDeportista]);

	const nombreValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
		return soloLetras.test(datosDeportista.name);
	};
	const nombreVacio = () => {
		return datosDeportista.name == '';
	};

	const apellidoValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
		return soloLetras.test(datosDeportista.lastName);
	};
	const apellidoVacio = () => {
		return datosDeportista.lastName == '';
	};

	const numeroValido = () => {
		const soloLetras = /^[0-9]*$/;
		return soloLetras.test(datosDeportista.phone);
	};
	const numeroVacio = () => {
		return datosDeportista.phone == '';
	};
	const numeroCompleto = () => {
		return datosDeportista.phone.length == 10;
	};

	const pesoValido = () => {
		return datosDeportista.weight > 0;
	};

	const clubVacio = () => {
		return datosDeportista.club === '' || datosDeportista.club === null || datosDeportista.club === '-';
	};

	const categoriaVacia = () => {
		return datosDeportista.weightCategory === '' || datosDeportista.weightCategory === null || datosDeportista.weightCategory === '-';
	};

	const botonValido = (formData = datosDeportista) => {
		return nombreValido() && !nombreVacio() && apellidoValido() && !apellidoVacio() && numeroValido() && !numeroVacio() && numeroCompleto() && pesoValido() && !categoriaVacia() && !clubVacio();
	};

	const ready = () => {
		return datosDeportista._id != '' ;
	};

	return (
		<>
			{!ready() && (<LoaderContenido/>)}
			{ready() && (
				<div className="container mx-auto mt-8">
					<h1 className='text-center text-[400%]' id='titulos-grandes'>EDITAR DEPORTISTA</h1>
					<div className='flex items-center justify-center'>
						{datosDeportista.image != '' && <img src={datosDeportista.image} className='w-72 h-72'></img>}

					</div>
					<form>
						<div className="p-4 max-w-5xl mx-auto flex">
							<div className="w-2/4 pr-4">
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Nombre:
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<input
											type="text"
											name="nombre"
											value={datosDeportista.name}
											onChange={(e) => handleChange('name', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										/>
									</div>
								</div>
								<div className='flex'>
									<div className='w-1/3 mx-2'></div>
									{nombreVacio() && (
										<label className='text-red-600 mx-10'>El campo no puede estar vacío</label>
									)}
									{(!nombreValido() && !nombreVacio()) && (
										<label className='text-red-600 mx-10'>El nombre sólo debe contener letras</label>
									)}
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Apellido:
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<input
											type="text"
											name="apellido"
											value={datosDeportista.lastName}
											onChange={(e) => handleChange('lastName', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										/>
									</div>
								</div>
								<div className='flex'>
									<div className='w-1/3 mx-2'></div>
									{apellidoVacio() && (
										<label className='text-red-600 mx-10'>El campo no puede estar vacío</label>
									)}
									{(!apellidoValido() && !apellidoVacio()) && (
										<label className=' text-red-600 mx-10'>El apellido sólo debe contener letras</label>
									)}
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Peso
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<input
											type="number"
											name="peso"
											value={datosDeportista.weight}
											onChange={(e) => handleChange('weight', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
											placeholder='Ingresa el peso'
										/>
									</div>
								</div>
								<div className='flex'>
									<div className='w-1/3 mx-2'></div>
									{!pesoValido() && (
										<label className='text-red-600 mx-10'>El peso debe ser un valor positivo</label>
									)}
								</div>
							</div>
							<div className="w-2/4 pr-4">
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Teléfono
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<input
											type="text"
											name="telefono"
											value={datosDeportista.phone}
											onChange={(e) => handleChange('phone', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										/>
									</div>
								</div>
								<div className='flex'>
									<div className="w-1/3 mx-2"></div>
									{numeroVacio() && (
										<label className='text-red-600 mx-10'>El campo no puede estar vacío</label>
									)}
									{(!numeroValido() && !numeroVacio()) && (
										<label className='text-red-600 mx-10'>El campo sólo puede contener números</label>
									)}
									{(!numeroCompleto() && (!numeroVacio() && numeroValido())) && (
										<label className='text-red-600 mx-10'>El número debe ser de 10 dígitos</label>
									)}
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                    Club:
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<select
											name="club"
											value={datosDeportista.club === null ? '-' : datosDeportista.club}
											onChange={(e) => handleChange('club', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										>
											{clubVacio() && (
												<option value='-'>Selecciona un club</option>
											)}
											<OpcionesClubes/>
										</select>
									</div>
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                    Categoria:
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<select
											name="categoria"
											value={datosDeportista.weightCategory === null ? '-' : datosDeportista.weightCategory}
											onChange={(e) => handleChange('weightCategory', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 px-4 text-black'
										>
											{categoriaVacia() && (
												<option value='-'>Selecciona una categoria</option>
											)}
											<OpcionesCategorias/>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-5 flex justify-center items-center">
							<button
								onClick={handleGuardarCambios}
								type="button"
								disabled = {!botonListo}
								className={` ${!botonListo ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button} mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg`}
							>
                            Guardar cambios
							</button>
							<button className={styles.button + ' w-60 h-10 text-white py-2 px-4 rounded-lg'} onClick={(event) => {
								event.preventDefault();
								handleChangeImage();
							}}>
							Cargar nueva foto de perfil
		  				</button>
						</div>
					</form>
					{(viewModal && id) && <ModalImage setView={setViewModal} id={id}></ModalImage>}
				</div>
			)}
		</>
	);
};