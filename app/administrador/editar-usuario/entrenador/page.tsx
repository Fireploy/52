'use client';

import { obtenerFotoPerfil } from '@/app/lib/basic_request';
import { ModalImage } from '@/components/imgLoader/ModalImageInput/ModalImage';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import {
	ChangeEvent,
	useEffect,
	useState
} from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';

interface FormData {
	_id : string;
	name: string;
	lastName: string;
	phone: string;
	address: string;
	image: string;
  }

export default function EditarEntrenador() {

	const [viewModal, setViewModal] = useState(false);
	const [botonListo, setBotonListo] = useState(true);

	//TRAER ID DE USUARIO DE LA URL
	const valor = useSearchParams();
	let id = valor.get('id');
	if(id == null) id = '';

	const [datosEntrenador, setDatosEntrenador] = useState<FormData>({
		_id: '',
		name: '',
		lastName: '',
		phone: '',
		address: '',
		image: ''
	});

	const handleChange = (field: keyof FormData, value: string) => {
		setDatosEntrenador((prevFormData) => ({
			...prevFormData,
			[field]: value
		}));
	};

	useEffect(()=>{
		setBotonListo(botonValido());
	}, [datosEntrenador]);

	const handleChangeImage = () => {
		setViewModal(true);
	};

	//Método de cargar los usuarios del localStorage
	const cargarUsuarios = async () => {
		const datos = localStorage.getItem('userData');
		var arreglo;

		if (datos != null) {
			arreglo = JSON.parse(datos);
		}
		const dataDeportista = await cargaEntrenador(arreglo);
		if(id) setDatosEntrenador({ ...dataDeportista.data.user, ['image']: await obtenerFotoPerfil(id) });
	};

	//Consumir endpoint
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	async function cargaEntrenador(datos: { token: any }): Promise<any> {
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
				name: datosEntrenador.name,
				lastName: datosEntrenador.lastName,
				address: datosEntrenador.address,
				phone: datosEntrenador.phone,
			};

			const response = await axios.patch(`${apiEndpoint}/users`, body, {
				headers: cabeza,
				params: parametro,
			});
			window.location.href = `/administrador/info-usuario/entrenador?id=${response.data.user._id}`;
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

	const nombreValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
		return soloLetras.test(datosEntrenador.name);
	};
	const nombreVacio = () => {
		return datosEntrenador.name == '';
	};

	const apellidoValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;;
		return soloLetras.test(datosEntrenador.lastName);
	};
	const apellidoVacio = () => {
		return datosEntrenador.lastName == '';
	};
	const direccionVacia = () => {
		return datosEntrenador.address == '';
	};
	const numeroValido = () => {
		const soloLetras = /^[0-9]*$/;
		return soloLetras.test(datosEntrenador.phone);
	};
	const numeroVacio = () => {
		return datosEntrenador.phone == '';
	};
	const numeroCompleto = () => {
		return datosEntrenador.phone.length == 10;
	};

	const botonValido = (formData = datosEntrenador) => {
		return nombreValido() && !nombreVacio() && apellidoValido() && !apellidoVacio() && !direccionVacia() && numeroValido() && !numeroVacio() && numeroCompleto();
	};

	const ready = () =>{
		return datosEntrenador._id != '';
	};

	return (
		<>
			{!ready() && (<LoaderContenido/>)}
			{ready() && (
				<div className="container mx-auto mt-8">
					<h1 className='text-center text-[400%]' id='titulos-grandes'>EDITAR ENTRENADOR</h1>
					<div className='flex items-center justify-center'>
						{datosEntrenador.image != '' && <img src={datosEntrenador.image} className='w-72 h-72'></img>}
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
											value={datosEntrenador.name}
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
											value={datosEntrenador.lastName}
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
							</div>
							<div className="w-2/4 pr-4">
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
											value={datosEntrenador.address}
											onChange={(e) => handleChange('address', e.target.value)}
											className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										/>
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
									Teléfono
										</div>
									</div>
									<div className="w-2/3 mx-2" id='texto-general'>
										<input
											type="text"
											name="telefono"
											value={datosEntrenador.phone}
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
							</div>
						</div>
						<div className="mt-5 flex justify-center items-center">
							<button
								onClick={handleGuardarCambios}
								type="button"
								disabled = {!botonListo}
								className={`${!botonListo ? styles.buttonDisabled + ' cursor-not-allowed' : styles.button} mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg`}
							>
						Guardar cambios
							</button>
							<button className={(styles.button) + ' w-60 h-10 text-white py-2 px-4 rounded-lg'} onClick={(event) => {
								event.preventDefault();
								handleChangeImage();
							}}>
						Cargar nueva foto de perfil
					  </button>
						</div>
					</form>
					{viewModal && <ModalImage setView={setViewModal} id={id}></ModalImage>}
				</div>
			)}
		</>
	);
};

