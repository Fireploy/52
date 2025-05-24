'use client';

import Image from 'next/image';
import { LoaderContenido } from '@/components/loaderContenido';
import cambiarLogo from '@/public/images/cambiarLogo.png';
import administrarCategorias from '@/public/images/administrarCategorias.png';
import evaluacionFisica from '@/public/images/evaluacionFisica.png';
import gestionarRoles from '@/public/images/gestionarRoles.png';
import gestionarClubes from '@/public/images/gestionarClubes.png';
import gestionarIndex from '@/public/images/gestionarIndex.png';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ModalImage } from '@/components/imgLoader/ModalImageInput/ModalImage';
import { ObtenerLogo } from '@/app/lib/basic_request';
import styles from '@/public/css/styles.module.scss';

export default function AdministracionAdmin() {
	const [logo, setLogo] = useState('');

	const [viewModal, setViewModal] = useState(false);
	const [temporizador, setTemporizador] = useState(false);

	const handleChangeImage = () => {
		setViewModal(true);
	};

	useEffect(() => {
		const f = async () => {
			setLogo(await ObtenerLogo());
		};
		f();
	}, []);

	return (
		<>
			{logo == '' && <LoaderContenido></LoaderContenido>}
			{logo != '' && (
				<div>
					<div className="container mx-auto mt-8">
						<h1 className="text-center text-[400%]" id="titulos-grandes">
              MENÚ DE ADMINISTRADOR
						</h1>
						<div className="p-4 max-w-5xl mx-auto flex">
							<div className="w-1/3 pr-4 m-0">
								{logo != '' && (
									<div className="m-0 my-5">
										<div className="flex items-center justify-center">
											{' '}
											<Image
												width={200}
												height={200}
												src={logo}
												alt="Logo Liga de Boxeo de Norte de Santander"
											/>
										</div>
										<div className="flex items-center justify-center mt-3 mb-5">
											<button
												onClick={(e) => {
													e.preventDefault;
													handleChangeImage();
												}}
												className={
													styles.button +
                          ' w-60 h-10 text-white py-2 px-4 rounded-lg'
												}
											>
                        Cambiar logo
											</button>
										</div>
									</div>
								)}
								<div className="mx-0 my-5">
									<div className="flex items-center justify-center">
										<Image
											src={administrarCategorias}
											alt="Logo Liga de Boxeo de Norte de Santander"
											width={200}
											priority
										/>
									</div>
									<div className="flex items-center justify-center mt-3">
										<Link href="/administrador/administracion/administrar-categorias">
											<button
												className={
													styles.button +
                          ' w-60 h-10 text-white py-2 px-4 rounded-lg'
												}
											>
                        Administrar categorías
											</button>
										</Link>
									</div>
								</div>
							</div>
							<div className="w-1/3 pr-4 m-0">
								<div className="m-0 my-5">
									<div className="flex items-center justify-center">
										<Image
											src={evaluacionFisica}
											alt="Logo Liga de Boxeo de Norte de Santander"
											width={200}
											priority
										/>
									</div>
									<div className="flex items-center justify-center mt-3">
										<Link href="/administrador/administracion/evaluacion-fisica">
											<button
												className={
													styles.button +
                          ' w-60 h-10 text-white py-2 px-4 rounded-lg'
												}
											>
                        Evaluación física
											</button>
										</Link>
									</div>
								</div>
								<div className="mx-0 my-5">
									<div className="flex items-center justify-center">
										<Image
											src={gestionarRoles}
											alt="Logo Liga de Boxeo de Norte de Santander"
											width={200}
											priority
										/>
									</div>
									<div className="flex items-center justify-center mt-3">
										<Link href="/administrador/administracion/gestionar-roles">
											<button
												className={
													styles.button +
                          ' w-60 h-10 text-white py-2 px-4 rounded-lg'
												}
											>
                        Gestionar roles
											</button>
										</Link>
									</div>
								</div>
							</div>
							<div className="w-1/3 pr-4 m-0">
								<div className="m-0 my-5">
									<div className="flex items-center justify-center">
										<Image
											src={gestionarClubes}
											alt="Logo Liga de Boxeo de Norte de Santander"
											width={200}
											priority
										/>
									</div>
									<div className="flex items-center justify-center mt-3">
										<Link href="/administrador/administracion/gestionar-clubes">
											<button
												className={
													styles.button +
                          ' w-60 h-10 text-white py-2 px-4 rounded-lg'
												}
											>
                        Gestionar clubes
											</button>
										</Link>
									</div>
								</div>
								<div className="mx-0 my-5">
									<div className="flex items-center justify-center">
										<Image
											src={gestionarIndex}
											alt="Logo Liga de Boxeo de Norte de Santander"
											width={200}
											priority
										/>
									</div>
									<div className="flex items-center justify-center mt-3">
										<Link href="/administrador/administracion/gestionar-index">
											<button
												className={
													styles.button +
                          ' w-60 h-10 text-white py-2 px-4 rounded-lg'
												}
											>
                        Gestionar index
											</button>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					{viewModal && (
						<ModalImage setView={setViewModal} type={1}></ModalImage>
					)}
				</div>
			)}
		</>
	);
}
