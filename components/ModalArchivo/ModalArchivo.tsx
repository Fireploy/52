'use client';
import React, { useState, useRef } from 'react';
import { CargaMasiva } from '../../app/lib/basic_request';

export const ModalArchivo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const myInput = useRef<HTMLInputElement>(null);

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);

		const droppedFile = event.dataTransfer.files[0];
		if (droppedFile.name.endsWith('.xlsx')) {
			setFile(droppedFile);
		} else {
			alert('Por favor selecciona un archivo con extensión .xlsx');
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedFile = event.target.files[0];
			if (selectedFile.name.endsWith('.xlsx')) {
				setFile(selectedFile);
			} else {
				alert('Por favor selecciona un archivo con extensión .xlsx');
			}
		}
	};

	const handleInput = () => {
		if (myInput) myInput.current?.click();
	};

	const handleUpload = async () => {
		if (!file) {
			alert('Por favor selecciona un archivo');
			return;
		}

		try {
			console.log('El archivo a enviar es:', file);
			CargaMasiva(file);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
			alert('Ocurrió un error al subir el archivo');
		}
	};

	return (
		<div className={`fixed inset-0 flex justify-center items-center ${isOpen ? 'visible' : 'hidden'}`}>
			<div
				className={'bg-black bg-opacity-40 w-full h-full flex items-center justify-center'}
				onClick={onClose}
			>
				<div className="bg-[#1e1e1e] p-8 rounded-[30PX] w-[800px] h-[550px] text-white flex flex-col justify-center items-center gap-4" onClick={(e) => { e.stopPropagation(); }}>
					<div
						className={`flex border h-full w-full flex-col justify-center align-middle items-center space-y-4 border-dashed rounded-md ${isDragging ? 'border-red-500' : ''}`}
						onDrop={handleDrop}
						onDragOver={(event) => event.preventDefault()}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
							<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
						</svg>
						<h3>Arrastra el archivo o selecciona el archivo desde abajo</h3>
					</div>
					<input type='file' className='hidden' onChange={handleFileChange} ref={myInput} accept='.xlsx'></input>
					<div className='flex space-x-6 align-middle text-center items-center'>
						<button className='bg-gray-200 text-black px-5 py-2' onClick={handleInput}>Seleccionar archivo</button>
						{file && <label>{file.name}</label>}
					</div>
					<button
						className="mt-4 px-4 py-2 bg-[#cd1919] text-white rounded hover:bg-[#cd1919]"
						onClick={handleUpload}
						disabled={!file}
					>
                        Subir archivo
					</button>
				</div>
			</div>
		</div>
	);
};
