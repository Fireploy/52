'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ObtenerLogo } from '@/app/lib/basic_request';

export default function NavbarAdministrador() {

	const [logo, setLogo] = useState('');
	const [nombreUsuario, setNombreUsuario] = useState('');
	const [barraDesplegada, setBarraDesplegada] = useState(false);
	const [usuariosDesplegados, setUsuariosDesplegados] = useState(false);
	const [filtro, setFiltro] = useState('');

	useEffect(() => {
		// Verificar que estamos en el cliente
		if (typeof window !== 'undefined') {
			const datosUsuarioJSON = localStorage.getItem('datosUsuario');
			if (datosUsuarioJSON) {
				const datosUsuario = JSON.parse(datosUsuarioJSON);
				setNombreUsuario(`${datosUsuario.nombre} ${datosUsuario.apellido}`);
			}
			const fetchLogo = async () => {
				setLogo(await ObtenerLogo());
			};
			fetchLogo();
		}
	}, []);

	useEffect(() => {
		// UseEffect para manejar el cambio en el filtro y actualizar el localStorage
		if (filtro && typeof window !== 'undefined') {
			localStorage.setItem('filtro', filtro);
		}
	}, [filtro]);

	const abrirBarraDesplegable = () => {
		setBarraDesplegada(true);
	};

	const cerrarBarraDesplegable = () => {
		setBarraDesplegada(false);
	};

	const abrirListaUsuarios = () => {
		setUsuariosDesplegados(true);
	};

	const cerrarListaUsuarios = () => {
		setUsuariosDesplegados(false);
	};

	return (
		<nav className="bg-[#1e1e1e] p-4">
			<div className="container">
				<div className="flex justify-between">
					<div className="flex items-center">
						<div className="text-white font-bold text-xl">
							<div className="flex items-center">
								<div className="w-60 h-60 bg-[#141414] rounded-full flex items-center justify-center mr-4 absolute -top-14 -left-14">
									{logo && <Image
										width={125}
										height={125}
										src={logo}
										alt="Logo Liga de Boxeo de Norte de Santander"
										className="transform translate-x-[10px] translate-y-[20px] h-[125px] w-[125px] rounded-full"
									/>}
								</div>
							</div>
						</div>
					</div>
					<ul className='flex space-x-5 my-4 text-white' id='titulos-pequenos'>
						<li className='cursor-pointer' id='titulos-pequenos' onClick={abrirListaUsuarios}>
							<div>USUARIOS</div>
						</li>
						<li>
							<Link href='/administrador/calendario'>CALENDARIO</Link>
						</li>
						<li>
							<Link href='/administrador/comunicados'>COMUNICADOS</Link>
						</li>
						<li>
							<Link href='/administrador/ranking'>RANKING</Link>
						</li>
					</ul>
					<ul className="flex space-x-4 my-4 cursor-pointer">
						<li className='flex text-white' id='titulos-pequenos' onClick={abrirBarraDesplegable}>
							<div>{nombreUsuario}</div>
						</li>
						<svg
							className="my-1"
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 512 512"
							fill="#ffffff"
							onClick={abrirBarraDesplegable}
						>
							<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
						</svg>
					</ul>
				</div>
			</div>

			{barraDesplegada && (
				<>
					<div className="fixed inset-0">
						<div
							className='w-[14%] absolute right-10 top-16 px-1 bg-[#1e1e1e] border border-gray-500 rounded shadow text-center' id='titulos-pequenos'
						>
							<button
								className="absolute top-0 right-0 mx-1 cursor-pointer"
								onClick={cerrarBarraDesplegable}
							>
                                X
							</button>
							<ul>
								<li className='my-1'>
									<Link href='/administrador/mi-perfil' onClick={cerrarBarraDesplegable}>
                                        Mi perfil
									</Link>
								</li>
								<div className="border-t border-gray-500"></div>
								<li className='my-1'>
									<Link href='/administrador/administracion' onClick={cerrarBarraDesplegable}>
                                        Administración
									</Link>
								</li>
								<div className="border-t border-gray-500"></div>
								<li className='text-[#cd1919] italic my-1'>
									<Link href='/' onClick={cerrarBarraDesplegable}>
                                        Cerrar sesión
									</Link>
								</li>
							</ul>
						</div>
						<div
							className="bg-transparent"
							onClick={cerrarBarraDesplegable}
						/>
					</div>
				</>
			)}

			{usuariosDesplegados && (
				<>
					<div className="fixed inset-0">
						<div
							className='w-[14%] absolute left-[420px] top-16 px-1 bg-[#1e1e1e] border border-gray-500 rounded shadow text-center' id='titulos-pequenos'
						>
							<button
								className="absolute top-0 right-0 mx-1 cursor-pointer"
								onClick={cerrarListaUsuarios}
							>
                                X
							</button>
							<ul>
								<li className='my-1'>
									<Link href='/administrador/lista-usuarios/entrenador' onClick={() => { cerrarListaUsuarios(); setFiltro('Entrenador'); }}>
                                        ENTRENADORES
									</Link>
								</li>
								<div className="border-t border-gray-500"></div>
								<li className='my-1'>
									<Link href='/administrador/lista-usuarios/deportista' onClick={() => { cerrarListaUsuarios(); setFiltro('Deportista'); }}>
                                        DEPORTISTAS
									</Link>
								</li>
								<div className="border-t border-gray-500"></div>
								{/*<li className=' my-1'>
                                    <Link href='/administrador/lista-usuarios/externo' onClick={() => { cerrarListaUsuarios(); setFiltro('Externo'); }}>
                                        EXTERNOS
                                    </Link>
                                </li>*/}
							</ul>
						</div>
						<div
							className="bg-transparent"
							onClick={cerrarListaUsuarios}
						/>
					</div>
				</>
			)}

		</nav>
	);
}
