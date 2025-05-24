'use client';
import { useEffect, useState } from 'react';
import { ObtenerLogo } from '@/app/lib/basic_request';
import Image from 'next/image';
import Link from 'next/link';

export default function NavbarHome() {
	const [logo, setLogo] = useState('');

	useEffect(() => {
		async function fetchLogo() {
			const logoUrl = await ObtenerLogo();
			setLogo(logoUrl);
		}
		fetchLogo();
	}, []);

	return (
		<nav className="bg-[#1e1e1e] p-4">
			<div className="container">
				<div className="flex justify-between">
					<div className="flex items-center">
						<div className="text-white font-bold text-xl">
							<div className="flex items-center">
								<div className="w-60 h-60 bg-[#141414] rounded-full flex items-center justify-center mr-4 absolute -top-14 -left-14">
									{logo && (
										<img
											src={logo}
											alt="Logo Liga de Boxeo de Norte de Santander"
											className="transform translate-x-[10px] translate-y-[20px] h-[125px] w-[125px] rounded-full"
										/>
									)}
								</div>
							</div>
						</div>
					</div>
					<ul className="flex space-x-4 my-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1.5em"
							viewBox="0 0 500 500"
							fill="#ffffff"
						>
							<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
						</svg>
						<li className='flex text-white' id='titulos-pequenos'>
							<Link href='/login'>Iniciar Sesión</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}