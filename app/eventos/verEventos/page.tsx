'use client';

import { useEffect, useState } from 'react';

export default function VerEvento() {
	const [event, setEvent] = useState(false);
	useEffect(()=>{
		const datos = localStorage.getItem('userData');
		let rol;
		if(datos != null){
			rol = JSON.parse(datos).role;
		}
	}, []);
	return (
		<div className="container mx-auto mt-8">
			<div className="p-4 ">
				<div className='flex'>
					<div className="w-2/3 pr-4">
						<h1 className='text-center text-[400%]' id='titulos-grandes'>Nueva Convocatoria</h1>
						<div className="w-1/3 mx-2">
							<div className='  w-full h-10 mx-5 my-2 flex items-center justify-center text-white ' id='texto-general'>
										Fecha del evento
							</div>
						</div>
						<label
							className='bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black' id='texto-general'
						/>
					</div>

					<div className="flex justify-center items-center mt-4 ">
						<button type='button' className="bg-[#cd1919] text-white rounded p-2 mx-5">
					        Agregar convocatoria
						</button>
						<button className="bg-[#cd1919] text-white rounded p-2">
					        Cancelar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
