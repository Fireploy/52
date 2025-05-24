'use client';
import { useState } from 'react';

interface FormData {
    id: string;
    titulo: string;
    descripcion: string;
}

export default function GestionarIndex() {
	const [secciones, setSecciones] = useState([] as FormData[]);
	const [contadorId, setContadorId] = useState(0);

	const agregarSeccion = () => {
		const nuevaSeccion = {
			id: `seccion-${contadorId}`,
			titulo: '',
			descripcion: '',
		};

		setSecciones((prevSecciones) => [...prevSecciones, nuevaSeccion]);
		setContadorId((prevContadorId) => prevContadorId + 1);
	};

	const borrarSeccion = (id: string) => {
		setSecciones((prevSecciones) => prevSecciones.filter((seccion) => seccion.id !== id));
	};

	const handleChange = (id: string, field: keyof FormData, value: string) => {
		setSecciones((prevSecciones) => {
			return prevSecciones.map((seccion) => {
				if (seccion.id === id) {
					return { ...seccion, [field]: value };
				}
				return seccion;
			});
		});
	};

	return (
		<>
			<h1 className="text-center text-[400%]" id="titulos-grandes">
                SECCIONES
			</h1>
			<form>
				{secciones.map((seccion) => (
					<div key={seccion.id} className="bg-[#cd1919] rounded-lg p-5 max-w-5xl mx-auto mb-5">
						<div className="flex col">
							<div className="w-2/4 mx-4">
								<h3 className="text-[200%]" id="titulos-grandes">
                                    TÍTULO DE LA SECCIÓN
								</h3>
								<input
									type="text"
									name="titulo"
									className="bg-neutral-200 rounded-lg w-full h-10 my-2 pl-4 text-black"
									id="texto-general"
									value={seccion.titulo}
									onChange={(e) => handleChange(seccion.id, 'titulo', e.target.value)}
								/>
							</div>
							<div className="w-2/4 mx-4">
								<h3 className="text-[200%]" id="titulos-grandes">
                                    DESCRIPCIÓN DE LA SECCIÓN
								</h3>
								<textarea
									name="descripcion"
									className="bg-neutral-200 rounded-lg w-full h-40 my-2 pl-4 text-black"
									id="texto-general"
									value={seccion.descripcion}
									onChange={(e) => handleChange(seccion.id, 'descripcion', e.target.value)}
								/>
							</div>
						</div>
						<div className="flex justify-end">
							<button onClick={() => borrarSeccion(seccion.id)}>
								<svg xmlns="http://www.w3.org/2000/svg" height="1.4em" viewBox="0 0 640 512" fill="#ffffff">
									<path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
								</svg>
							</button>
						</div>
					</div>
				))}

				<div className="bg-[#cd1919] rounded-lg p-5 max-w-5xl mx-auto mb-5">
					<div className="flex col">
						<div className="w-2/4 mx-4">
							<h3 className="text-[200%]" id="titulos-grandes">
                                TÍTULO DE LA SECCIÓN
							</h3>
							<input
								type="text"
								name="titulo"
								className="bg-neutral-200 rounded-lg w-full h-10 my-2 pl-4 text-black"
								id="texto-general"
								value={secciones[secciones.length - 1]?.titulo || ''}
								onChange={(e) => handleChange(secciones[secciones.length - 1]?.id || '', 'titulo', e.target.value)}
							/>
						</div>
						<div className="w-2/4 mx-4">
							<h3 className="text-[200%]" id="titulos-grandes">
                                DESCRIPCIÓN DE LA SECCIÓN
							</h3>
							<textarea
								name="descripcion"
								className="bg-neutral-200 rounded-lg w-full h-40 my-2 pl-4 text-black"
								id="texto-general"
								value={secciones[secciones.length - 1]?.descripcion || ''}
								onChange={(e) => handleChange(secciones[secciones.length - 1]?.id || '', 'descripcion', e.target.value)}
							/>
						</div>
					</div>
					<div className="flex justify-end">
						<button type="button" onClick={agregarSeccion}>
							<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512" fill="#ffffff">
								<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
							</svg>
						</button>
					</div>
				</div>

				<div className="mt-5 flex justify-center">
					<button
						type="button"
						className="bg-[#cd1919] mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg"
						id="titulos-pequenos"
					>
                        Guardar secciones
					</button>
				</div>
			</form>
		</>
	);
}
