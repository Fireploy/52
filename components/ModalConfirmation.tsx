// Modal.tsx
import React, { ReactNode, useState } from 'react';
import { User } from './tablas/Table';
import { BorrarUsuario } from '@/app/lib/administrador';

interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}

export function ModalUltraBasic({ setIsOpen, user }: ModalProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isHovered_2, setIsHovered_2] = useState(false);

	async function handleConfirmarBorrado(){
		if(user) await BorrarUsuario(user);

	}

	return (
		<div className='flex fle'>
			<div className="fixed inset-0 flex justify-center items-center">
				<div className="bg-opacity-40 w-full h-full flex items-center justify-center">
					<div className="bg-[#1e1e1e] bg-opacity-80 p-8 rounded-[30PX] w-[600px] h-[350px] text-white flex flex-col justify-center items-center gap-4 space-y-10">
						<div id='texto-general' className='font-extrabold text-2xl'>{`¿Está seguro de querer deshabilitar al usuario ${user.lastName} ${user.name}?`.toUpperCase()}</div>
						<div className='flex space-x-5 items-center justify-center'>
							<button
								className={`mt-4 ${isHovered_2 ? 'bg-white text-[#cd1919]' : 'bg-[#cd1919] text-white'} px-4 py-2 rounded transition-all duration-300 ease-in-out`}
								onMouseEnter={() => setIsHovered_2(true)}
								onMouseLeave={() => setIsHovered_2(false)}
								onClick={handleConfirmarBorrado}
							>
                        Eliminar
							</button>
							<button
								className={`mt-4 ${isHovered ? 'bg-white text-[#cd1919]' : 'bg-[#cd1919] text-white'} px-4 py-2 rounded transition-all duration-300 ease-in-out`}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
								onClick={() => setIsOpen(false)}
							>
                    Cancelar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
