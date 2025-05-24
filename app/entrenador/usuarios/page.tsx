// pages.tsx
'use client';
import React, { useState } from 'react';
import TableDeportistas from '@/components/tablas/TableDeportistasEntrenador';
import Link from 'next/link';
import axios from 'axios';

const Home: React.FC = () => {

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

			const response = await axios.get(`${apiEndpoint}/users/download/Deportistas`, {
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
				link.setAttribute('download', 'Reporte_deportistas.xlsx'); // Nombre del archivo
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
			<TableDeportistas rol='Deportista'/>
		</div>
	);
};

export default Home;