'use client';
import React, {
	useState,
	useEffect,
	useRef
} from 'react';
import { InputImageArea } from './InputImageArea';
import { ActualizarFotoPerfil, ActualizarLogo } from '@/app/lib/basic_request';

export interface fileImageFormat {
	'nombre': string;
	'valor': string;
};

export const noAllowed = { 'nombre': 'No se eligió ningún archivo válido', 'valor': '' };

/**
 *
 * @param setView, id -> id del usuario de la imagen a cargar, type -> 0 o vacío si para usuarios, 1 si es para logos
 * @returns
 */
export function ModalImage({ setView, id, type }: { setView: React.Dispatch<React.SetStateAction<boolean>>, id?: string, type?: number}) {
	const [isHovered, setIsHovered] = useState(false);
	const [file, setFile] = useState(noAllowed);

	const myInput = useRef<HTMLInputElement>(null);

	const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event && event.target){
			const file = event.target.files?.[0];
			const fileName = file?.name.toLocaleLowerCase();
			if (file && fileName && (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.jpge'))) {
				const reader = new FileReader();
				reader.onload = () => {
					const imageDataURL = reader.result as string;
					let aux: fileImageFormat = { 'nombre': '', 'valor': '' };
					aux.nombre = file.name;
					aux.valor = imageDataURL;
					setFile(aux);
					// Hacer algo con la imagen si es necesario
				};
				reader.readAsDataURL(file);
			}
			else{
				setFile(noAllowed);
			}
		}
	};

	const handleInput = () => {
		if(myInput) myInput.current?.click();
	};

	const handleButton = async () => {
		if(type != null && type == 1){
			await ActualizarLogo(file.valor);
		}
		else await ActualizarFotoPerfil(file.valor, id);
		window.location.reload();
	};

	return (
		<div className='flex'>
			<div className="fixed inset-0 flex justify-center items-center">
				<div className="bg-black bg-opacity-40 w-full h-full flex items-center justify-center" onClick={()=> setView(false)}>
					<div className="bg-[#1e1e1e] p-8 rounded-[30PX] w-[800px] h-[550px] text-white flex flex-col justify-center items-center gap-4" onClick={(e) => {e.stopPropagation();}}>
						<InputImageArea setFile={setFile}/>
						<input type='file' className='hidden' onChange={handleFile} ref={myInput} accept='.png, .jpg, .jpge'></input>
						<div className='flex space-x-6 align-middle text-center items-center'>
							<button className='bg-gray-200 text-black px-5 py-2' onClick={handleInput}>Seleccionar archivo</button>
							<label>{file.nombre}</label>
						</div>
						<h3>Solo se admiten imagenes en formato .jpg y .png</h3>
						{file.valor != '' &&
							<button
								className={`mt-4 ${isHovered ? 'bg-white text-[#cd1919]' : 'bg-[#cd1919] text-white'} px-4 py-2 rounded transition-all duration-300 ease-in-out`}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
								onClick={handleButton}
							>
                      Cargar Archivo
							</button>}
					</div>
				</div>
			</div>
		</div>
	);
}
