import NavbarHome from '@/components/navbar/navbarHome';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import Mision from '@/public/images/mision.png';
import Vision from '@/public/images/vision.png';
import { useState } from 'react';
import { cargarInformacionIndex, indexInformation } from './lib/basic_request';
import axios from 'axios';

interface HomeProps {
	information: indexInformation | null;
}

export default async function Home() {
	const information = await cargarInformacionIndex();
	return (
		<>
			<NavbarHome />
			<div className="container mx-auto mt-8">
				<h1 className='text-center text-[500%]' id='titulos-grandes' style={{ textShadow: '3px 3px 0 #cd1919' }}>LIGA DE BOXEO NORTE</h1>

				<div className="p-4 max-w-5xl mx-auto my-5">
					<div className="flex">
						<div className="w-2/3 pr-4">
							<h2 className='text-[380%]' id='titulos-grandes'>MISIÓN</h2>
							<div className='bg-neutral-200 rounded-lg w-full p-5 flex items-center justify-center text-black' id='texto-general'>
								{information?.mision}
							</div>
						</div>
						<div className="w-1/3 flex justify-center items-center">
							<Image
								src={Mision}
								alt=" Logo Liga de Boxeo de Norte de Santander"
								className="transform translate-x-[10px] translate-y-[20px]"
								width={250}
								priority
							/>
						</div>
					</div>
				</div>
				<div className="p-4 max-w-5xl mx-auto my-5">
					<div className="flex">
						<div className="w-1/3 flex justify-center items-center">
							<Image
								src={Vision}
								alt="Logo Liga de Boxeo de Norte de Santander"
								className="transform translate-x-[10px] translate-y-[20px]"
								width={250}
								priority
							/>
						</div>
						<div className="w-2/3 pr-4">
							<h2 className='text-[380%]' id='titulos-grandes'>VISIÓN</h2>
							<div className='bg-neutral-200 rounded-lg w-full p-5 flex items-center justify-center text-black' id='texto-general'>
								{information?.vision}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}