'use client';

import { ChangeEvent, useState } from 'react';

interface FormData {
  nombre: string;
  apellido: string;
  cedula: string;
  direccion: string;
  telefono: string;
  correo: string;
}

export default function CrearExterno() {

	const [datosExterno, setDatosExterno] = useState<FormData>({
		nombre: '',
		apellido: '',
		cedula: '',
		direccion: '',
		telefono: '',
		correo: '',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

		setDatosExterno((prevData) => ({
			...prevData,
		}));
	};

	return (
		<>
			<div className="container mx-auto mt-8">
				<h1 className='text-center text-[400%]' id='titulos-grandes'>CREAR USUARIO</h1>
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
										value={datosExterno.nombre}
										onChange={handleInputChange}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										placeholder='Ingrese el nombre'
									/>
								</div>
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
										value={datosExterno.apellido}
										onChange={handleInputChange}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										placeholder='Ingrese el apellido'
									/>
								</div>
							</div>
							<div className="flex">
								<div className="w-1/3 mx-2">
									<div className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 flex items-center justify-center text-black' id='texto-general'>
                                        Cédula:
									</div>
								</div>
								<div className="w-2/3 mx-2" id='texto-general'>
									<input
										type="text"
										name="cedula"
										value={datosExterno.cedula}
										onChange={handleInputChange}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										placeholder='Ingrese el número de cedula'
									/>
								</div>
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
										value={datosExterno.direccion}
										onChange={handleInputChange}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										placeholder='Ingrese la dirección'
									/>
								</div>
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
										value={datosExterno.telefono}
										onChange={handleInputChange}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										placeholder='Ingrese el teléfono'
									/>
								</div>
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
										value={datosExterno.correo}
										onChange={handleInputChange}
										className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
										placeholder='Ingrese el correo'
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-5 flex justify-center">
						<button
							type="button"
							className='bg-[#cd1919] mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg' id='titulos-pequenos'
						>
                            Crear usuario
						</button>
						<button
							type="button"
							className='bg-[#cd1919] mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg' id='titulos-pequenos'
						>
                            Cargar foto de perfil
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

