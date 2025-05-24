'use client';
import { obtenerFotoPerfil } from '@/app/lib/basic_request';
import { ModalImage } from '@/components/imgLoader/ModalImageInput/ModalImage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';

interface FormData {
	nombre: string;
	apellido: string;
	cedula: string;
	direccion: string;
	telefono: string;
	correo: string;
	contrasenia: string;
	imagen: string;
  }

export default function Home() {

	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const [datosPerfil, setDatosPerfil] = useState({
		nombre: 'Texto',
		apellido: 'Texto',
		cedula: 'Texto',
		direccion: 'Texto',
		telefono: 'Texto',
		correo: 'Texto',
		imagen: ''
	});
	const [esEditable, setEsEditable] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [botonListo, setBotonListo] = useState(true);
	const [cargado, setCargado] = useState(false);

	useEffect(() => {
		const datos = localStorage.getItem('userData');
		var json;

		if (datos != null) {
			json = JSON.parse(datos);
		}

		carga(json);

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
			const tmp_user = ({
				nombre: response.data.user.name,
				apellido: response.data.user.lastName,
				cedula: response.data.user.cedula,
				direccion: response.data.user.address,
				telefono: response.data.user.phone,
				correo: response.data.user.email,
			});

			setDatosPerfil({ ...tmp_user, ['imagen']: await obtenerFotoPerfil() });

			// Obtén los datos de nombre y apellido de tu variable "response"
			const nombre = response.data.user.name;
			const apellido = response.data.user.lastName;

			// Define un objeto con los datos que deseas guardar
			const datosUsuario = {
				nombre: nombre,
				apellido: apellido
			};

			// Convierte el objeto a una cadena JSON
			const datosUsuarioJSON = JSON.stringify(datosUsuario);

			// Guarda la cadena JSON en localStorage
			localStorage.setItem('datosUsuario', datosUsuarioJSON);
			setCargado(true);
		} catch (error) {
			console.log(error);
		}
	}

	//método para poder realizar cambio de datos:
	async function cambiar(datos: { token: any; userId: any}, info: { nombre: any; apellido: any; direccion: any; telefono: any }): Promise<void> {
		try {
			const headers = {
				sessiontoken: datos.token
			};
			const parametros = {
				userId: datos.userId
			};
			const cuerpo = {
				name: info.nombre,
				lastName: info.apellido,
				phone: info.telefono,
				address: info.direccion
			};

			const response = await axios.patch(`${apiEndpoint}/users`, cuerpo, {
				params: parametros,
				headers: headers
			});

			// Actualizar el estado con los datos recibidos
		} catch (error) {
			console.log(error);
		}
	}

	const handleChange = (field: keyof FormData, value: string) => {
		setDatosPerfil((prevFormData) => ({
			...prevFormData,
			[field]: value
		}));
	};

	const handleChangeImage = () => {
		setModalVisible(true);
	};

	const handleToggleEdit = async () => {
		if (!esEditable) {
			console.log(datosPerfil);
		}
		else{
			const datos = localStorage.getItem('userData');
			var arreglo;

			if (datos != null) {
				arreglo = JSON.parse(datos);
			}
			cambiar(arreglo, datosPerfil);
		}
		setEsEditable((prevEsEditable) => !prevEsEditable);
	};

	const nombreValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
		return soloLetras.test(datosPerfil.nombre);
	};
	const nombreVacio = () => {
		return datosPerfil.nombre == '';
	};

	const apellidoValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
		return soloLetras.test(datosPerfil.apellido);
	};
	const apellidoVacio = () => {
		return datosPerfil.apellido == '';
	};
	const direccionVacia = () => {
		return datosPerfil.direccion == '';
	};
	const numeroValido = () => {
		const soloLetras = /^[0-9]*$/;
		return soloLetras.test(datosPerfil.telefono);
	};
	const numeroVacio = () => {
		return datosPerfil.telefono == '';
	};
	const numeroCompleto = () => {
		return datosPerfil.telefono.length == 10;
	};

	const botonValido = (formData = datosPerfil) => {
		return nombreValido() && !nombreVacio() && apellidoValido() && !apellidoVacio() && !direccionVacia() && numeroValido() && !numeroVacio() && numeroCompleto();
	};

	useEffect(() => {
		setBotonListo(botonValido());
	}, [datosPerfil]);

	return (
		<>
			{!cargado && <LoaderContenido />}
			{cargado && (
				<div className="container mx-auto mt-8">
					<h1 className='text-center text-[400%]' id='titulos-grandes'>MI PERFIL</h1>
					<div className="p-4 max-w-5xl mx-auto flex">
						<div className="w-2/3 pr-4">
							<form>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
									Nombre:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										{esEditable ? (
											<input
												type="text"
												className='bg-white rounded-full w-full h-10 mx-5 my-2 text-center text-black' id='texto-general'
												value={datosPerfil.nombre}
												onChange={(e) => handleChange('nombre', e.target.value)}
											/>
										) : (
											<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
												{datosPerfil.nombre}
											</div>
										)}
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
									<div className="w-2/3 mx-2">
										{esEditable ? (
											<input
												type="text"
												className='bg-white rounded-full w-full h-10 mx-5 my-2 text-center text-black' id='texto-general'
												value={datosPerfil.apellido}
												onChange={(e) => handleChange('apellido', e.target.value)}
											/>
										) : (
											<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
												{datosPerfil.apellido}
											</div>
										)}
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
									Cedula:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
											{datosPerfil.cedula}
										</div>
									</div>
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
									Dirección:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										{esEditable ? (
											<input
												type="text"
												className='bg-white rounded-full w-full h-10 mx-5 my-2 text-center text-black' id='texto-general'
												value={datosPerfil.direccion}
												onChange={(e) => handleChange('direccion', e.target.value)}
											/>
										) : (
											<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
												{datosPerfil.direccion}
											</div>
										)}
									</div>
								</div>
								<div className='flex'>
									<div className="w-1/3 mx-2"></div>
									{direccionVacia() && (
										<label className='text-red-600 mx-10'>El campo no puede estar vacío</label>
									)}
								</div>
								<div className="flex">
									<div className="w-1/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
									Teléfono:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										{esEditable ? (
											<input
												type="text"
												className='bg-white rounded-full w-full h-10 mx-5 my-2 text-center text-black' id='texto-general'
												value={datosPerfil.telefono}
												onChange={(e) => handleChange('telefono', e.target.value)}
											/>
										) : (
											<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
												{datosPerfil.telefono}
											</div>
										)}
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
									Correo:
										</div>
									</div>
									<div className="w-2/3 mx-2">
										<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
											{datosPerfil.correo}
										</div>
									</div>
								</div>
								<div className="mt-5 flex justify-center">
									<button
										type="button"
										onClick={handleToggleEdit}
										className={`${botonListo ? styles.button : styles.buttonDisabled + ' cursor-not-allowed'} w-60 h-10 text-white py-2 px-4 rounded-lg`}
										disabled = {botonListo ? false : true}
									>
										{esEditable ? 'Guardar cambios' : 'Editar información'}
									</button>
								</div>
							</form>
						</div>
						<div className="w-1/3 flex flex-col justify-center items-center">
							{datosPerfil.imagen != '' && <img src={datosPerfil.imagen} className='w-64 h-64'/>}
							<button className={`${styles.button} w-60 h-10  py-2 px-4 mt-7`} onClick={handleChangeImage}>
						Cargar nueva foto de perfil
					  </button>
						</div>
						{modalVisible && <ModalImage setView={setModalVisible}></ModalImage>}
					</div>
				</div>
			)}
		</>
	);
}
