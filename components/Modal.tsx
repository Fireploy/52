// Modal.tsx
import React, { ReactNode, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  imagen: string;
}

export function Modal({ isOpen, onClose, title, children, imagen }: ModalProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className='flex fle'>
			{isOpen && (
				<div className="fixed inset-0 flex justify-center items-center">
					<div className="bg-black bg-opacity-40 w-full h-full flex items-center justify-center">
						<div className="bg-[#1e1e1e] bg-opacity-80 p-8 rounded-[30PX] w-[600px] h-[350px] text-white flex flex-col justify-center items-center gap-4">
							<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className=" bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
								<path d={imagen} />
							</svg>
							<h2 className="text-2xl font-bold mb-4">{title}</h2>
							{children}
							<button
								className={`mt-4 ${isHovered ? 'bg-white text-[#cd1919]' : 'bg-[#cd1919] text-white'} px-4 py-2 rounded transition-all duration-300 ease-in-out`}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
								onClick={onClose}
							>
                      Aceptar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
