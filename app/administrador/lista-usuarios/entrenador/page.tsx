'use client';
import React, { useState } from 'react';
import Table from '@/components/tablas/Table';
import Link from 'next/link';
import axios from 'axios';
import { ModalArchivo } from '../../../../components/ModalArchivo/ModalArchivo';
import styles from '@/public/css/styles.module.scss';

const Home: React.FC = () => {

	const [modalOpen, setModalOpen] = useState(false);

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleDownload = async () => {
		const datos = localStorage.getItem('userData');
		let json;

		if (datos !== null) {
			json = JSON.parse(datos);
			console.log(json);
		}

		const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

		try {
			const headers = {
				sessiontoken: json.token
			};

			const response = await axios.get(`${apiEndpoint}/users/download/Entrenador`, {
				headers: headers,
				responseType: 'blob'
			});// Accede a la propiedad 'data' de la respuesta

			if (response.status === 200) {
				// Convertir la respuesta a un blob (archivo)
				const blob = response.data;

				// Crear un objeto URL para el blob
				const url = window.URL.createObjectURL(new Blob([blob]));

				// Crear un enlace temporal y simular el clic para descargar el archivo
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'Reporte_entrenadores.xlsx'); // Nombre del archivo
				document.body.appendChild(link);
				link.click();

				// Liberar el objeto URL creado
				setTimeout(() => {
					window.URL.revokeObjectURL(url);
					document.body.removeChild(link);
				  }, 1000);
			}

		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="w-full max-w-screen-xl mx-auto mt-[6%] p-6">
			<Table rol='Entrenador' linkVer='/administrador/info-usuario/entrenador' linkEditar='/administrador/editar-usuario/entrenador' />
			<div className="flex justify-between items-center mt-4">
				<button
					onClick={handleDownload}
					className={`${styles.button} p-2`}
				>
                    Descargar usuarios
				</button>
				<div className="flex gap-2">
					<button onClick={handleOpenModal} className={`${styles.button} p-2`}>
                        Carga masiva
					</button>
					<Link href='/administrador/crear-usuario/entrenador'>
						<button
							className={`${styles.button} p-2`}
						>
                            +
						</button>
					</Link>
				</div>
			</div>
			<ModalArchivo isOpen={modalOpen} onClose={handleCloseModal} />
		</div>
	);
};

export default Home;
