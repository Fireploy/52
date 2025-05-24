'use client';

import OpcionesClubes from '@/components/OpcionesClubes';
import fechaCompleta from '@/app/types/funcionesDate';
import axios from 'axios';
import { useEffect, useState } from 'react';
import OpcionesCategorias from '@/components/OpcionesCategorias';
import router from 'next/router';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';

interface FormData {
  nombre: string;
  apellido: string;
  documento: string;
  direccion: string;
  telefono: string;
  correo: string;
  club: string;
  categoria: string;
  peso: number;
  fecha: Date;
}

export default function CrearDeportista() {

	const [datosNuevoDeportista, setDatosNuevoDeportista] = useState<FormData>({
		nombre: '',
		apellido: '',
		documento: '',
		direccion: '',
		telefono: '',
		correo: '',
		club: '',
		categoria: '',
		peso: 0,
		fecha: new Date(),
	});

	const [loader, setLoader] = useState(true);
	useEffect(() => {
		const timer = setTimeout(() => {
		  setLoader(false);
		}, 500);

		// Limpiar el timeout cuando el componente se desmonte
		return () => clearTimeout(timer);
	  }, []);

	const [botonListo, setBotonListo] = useState(false);

	const handleChange = (field: keyof FormData, value: string) => {
		setDatosNuevoDeportista((prevFormData) => ({
			...prevFormData,
			[field]: value
		}));
	};

	useEffect(() => {
		setBotonListo(botonValido);
	}, [datosNuevoDeportista]);

	const handleChangeFecha = (field: keyof FormData, value: string) => {
		var fecha = new Date(value);
		setDatosNuevoDeportista((prevFormData) => ({
			...prevFormData,
			[field]: fecha
		}));
	};

	async function handleGuardarCambios(): Promise<void> {
		const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
		try{
			const datos = localStorage.getItem('userData');
			var arreglo;

			if (datos != null) {
				arreglo = JSON.parse(datos);
			}

			const cabeza = {
				sessiontoken: arreglo.token,
			};

			const body = {
				name: datosNuevoDeportista.nombre,
				lastName: datosNuevoDeportista.apellido,
				birthDate: fechaCompleta(datosNuevoDeportista.fecha),
				weight: Number(datosNuevoDeportista.peso),
				cedula: datosNuevoDeportista.documento,
				email: datosNuevoDeportista.correo,
				phone: datosNuevoDeportista.telefono,
				club: datosNuevoDeportista.club,
				weightCategory: datosNuevoDeportista.categoria,
				address: datosNuevoDeportista.direccion
			};

			const response = await axios.post(`${apiEndpoint}/users/Deportista`, body, {
				headers: cabeza,
			});
			window.location.href = `/administrador/info-usuario/deportista?id=${response.data.user._id}`;
		} catch (error) {
			console.log(error);
		}

	};

	/////////MÉTODO PARA TRAER LOS CLUBES
	var cargado = false;
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	useEffect(() => {
		const datos = localStorage.getItem('userData');
		var arreglo;

		if (datos != null) {
			arreglo = JSON.parse(datos);
		}

		//carga(arreglo);
		cargado = true;
	}, [!cargado]);

	async function carga(datos: { token: any; userId: any }): Promise<void> {
		try {
			const headers = {
				sessiontoken: datos.token
			};
			const parametros = {
				userId: datos.userId
			};

			const response = await axios.get(`${apiEndpoint}/users`, {
				params: parametros,
				headers: headers
			});

			// Actualizar el estado con los datos recibidos
			/* setDatosPerfil({
				nombre: response.data.user.name,
				apellido: response.data.user.lastName,
				cedula: response.data.user.cedula,
				direccion: response.data.user.address,
				telefono: response.data.user.phone,
				correo: response.data.user.email,
			}); */
		} catch (error) {
			console.log(error);
		}
	}

	const nombreValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
		return soloLetras.test(datosNuevoDeportista.nombre);
	};
	const nombreVacio = () => {
		return datosNuevoDeportista.nombre == '';
	};

	const apellidoValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
		return soloLetras.test(datosNuevoDeportista.apellido);
	};
	const apellidoVacio = () => {
		return datosNuevoDeportista.apellido == '';
	};

	const documentoTamanioValido = () => {
		return datosNuevoDeportista.documento.length >= 7 && datosNuevoDeportista.documento.length <= 10;
	};
	const documentoVacio = () => {
		return datosNuevoDeportista.documento == '';
	};
	const documentoValido = () => {
		const soloNumeros = /^[0-9]+$/;
		return soloNumeros.test(datosNuevoDeportista.documento);
	};

	const direccionVacia = () =>{
		return datosNuevoDeportista.direccion == '';
	};

	const pesoValido = () => {
		return datosNuevoDeportista.peso > 0;
	};

	const telefonoValido = () => {
		const soloNumeros = /^[0-9]+$/;
		return soloNumeros.test(datosNuevoDeportista.telefono);
	};
	const telefonoVacio = () => {
		return datosNuevoDeportista.telefono == '';
	};
	const telefonoCompleto = () =>{
		return datosNuevoDeportista.telefono.length == 10;
	};

	const correoCorrecto = () => {
		return datosNuevoDeportista.correo.includes('@gmail.com');
	};
	const correoVacio = () => {
		return datosNuevoDeportista.correo == '';
	};

	const fechaValida = () => {
		const fechaActual = new Date();
		const fechaLimite = new Date(fechaActual.getFullYear() - 18, fechaActual.getMonth(), fechaActual.getDate());
		return datosNuevoDeportista.fecha <= fechaLimite;
	};

	const botonValido = () => {
		return !nombreVacio() && nombreValido() && !apellidoVacio() && apellidoValido() && documentoTamanioValido() && !documentoVacio() && documentoValido() && !direccionVacia() && pesoValido() && telefonoCompleto() && !telefonoVacio() && telefonoValido() && correoCorrecto() && !correoVacio() && datosNuevoDeportista.club != '' && datosNuevoDeportista.categoria != '' && fechaValida();
	};

	return (
		<>
			<div className="container mx-auto mt-8">
				<h1 className='text-center text-[400%]' id='titulos-grandes'>CREAR DEPORTISTA</h1>
				<div className='flex items-center justify-center'>
					<svg
						className="my-1"
						xmlns="http://www.w3.org/2000/svg"
						height="6em"
						viewBox="0 0 512 512"
						fill="#ffffff"
					>
						<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
					</svg>
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
										value={datosNuevoDeportista.nombre}
										onChange={(e) => handleChange('nombre', e.target.value)}
										className={`${nombreVacio() ? ' border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
										placeholder='Ingrese el nombre'
									/>
								</div>
							</div>
							<div className='flex'>
								<div className='w-1/3 mx-2'></div>
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
										value={datosNuevoDeportista.apellido}
										onChange={(e) => handleChange('apellido', e.target.value)}
										className={`${apellidoVacio() ? ' border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
										placeholder='Ingrese el apellido'
									/>
								</div>
							</div>
							<div className='flex'>
								<div className='w-1/3 mx-2'></div>
								{(!apellidoValido() && !apellidoVacio()) && (
									<label className=' text-red-600 mx-10'>El apellido sólo debe contener letras</label>
								)}
							</div>
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Documento:
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<input
										type="text"
										name="documento"
										value={datosNuevoDeportista.documento}
										onChange={(e) => handleChange('documento', e.target.value)}
										className={`${documentoVacio() ? ' border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
										placeholder='Ingrese el número de documento'
									/>
								</div>
							</div>
							<div className='flex'>
								<div className='w-1/3 mx-2'></div>
								{(!documentoValido() && !documentoVacio()) && (
									<label className=' text-red-600 mx-10'>El documento sólo debe contener números</label>
								)}
								{(documentoValido() && !documentoVacio() && !documentoTamanioValido()) && (
									<label className=' text-red-600 mx-10'>El documento debe tener entre 7 y 10 dígitos</label>
								)}
							</div>
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Dirección
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<input
										type="text"
										name="direccion"
										value={datosNuevoDeportista.direccion}
										onChange={(e) => handleChange('direccion', e.target.value)}
										className={`${direccionVacia() ? ' border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
										placeholder='Ingrese la dirección'
									/>
								</div>
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
										value={datosNuevoDeportista.peso}
										onChange={(e) => handleChange('peso', e.target.value)}
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
										value={datosNuevoDeportista.telefono}
										onChange={(e) => handleChange('telefono', e.target.value)}
										className={`${telefonoVacio() ? ' border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
										placeholder='Ingrese el teléfono'
									/>
								</div>
							</div>
							<div className='flex'>
								<div className="w-1/3 mx-2"></div>
								{(!telefonoValido() && !telefonoVacio()) && (
									<label className='text-red-600 mx-10'>El campo sólo puede contener números</label>
								)}
								{(!telefonoCompleto() && (!telefonoVacio() && telefonoValido())) && (
									<label className='text-red-600 mx-10'>El número debe ser de 10 dígitos</label>
								)}
							</div>
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Correo
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<input
										type="text"
										name="correo"
										value={datosNuevoDeportista.correo}
										onChange={(e) => handleChange('correo', e.target.value)}
										className={`${correoVacio() ? ' border-[3px] border-red-700' : ''} bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black`}
										placeholder='Ingrese el correo'
									/>
								</div>
							</div>
							<div className='flex'>
								<div className="w-1/3 mx-2"></div>
								{(!correoCorrecto() && !correoVacio()) && (
									<label className='text-red-600 mx-10'>El correo sólo puede ser gmail</label>
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
										value={datosNuevoDeportista.club}
										onChange={(e) => handleChange('club', e.target.value)}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
									>
										<option value="">Seleccione un club</option>
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
										value={datosNuevoDeportista.categoria}
										onChange={(e) => handleChange('categoria', e.target.value)}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 px-4 text-black'
									>
										<option value="">Seleccione una categoria</option>
										<OpcionesCategorias/>
									</select>
								</div>
							</div>

							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Fecha de nacimiento
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<input
										type="date"
										name="fecha"
										onChange={(e) => handleChangeFecha('fecha', e.target.value)}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										min="1900-01-01"
										required
									/>
								</div>
							</div>
							<div className='flex'>
								<div className="w-1/3 mx-2"></div>
								{!fechaValida() && (
									<label className='text-red-600 mx-10'>El usuario debe ser mayor de edad</label>
								)}
							</div>

						</div>
					</div>
					<div className="mt-5 flex justify-center">
						<button
							type="button"
							onClick={handleGuardarCambios}
							disabled = {!botonListo}
							className={`${ botonListo ? 'bg-[#cd1919]' : 'bg-[#8b1212] cursor-not-allowed'} mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg`}
						>
                            Guardar cambios
						</button>
						<button
							type="button"
							className={(styles.button) + ' mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg'}
						>
                            Cargar foto de perfil
						</button>
					</div>
				</form>
			</div>
		</>
	);
};