'use client';

import loginData from '@/pruebas/login.json';
import { Modal } from '@/components/Modal';
import { Form } from '@/components/form';
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { log } from 'winston';
import { RealizarCambioContrasenia, SolicitarCambioContrasenia } from '../lib/basic_request';

export default function RecoveryPassword() {
	const [information, setInformation] = useState({
	  email: '',
	  contrasenia: '',
	  _contrasenia: '',
	  codigo: ''
	});

	const [isEmpty, setIsEmpty] = useState(false);
	const [isInvalidEmail, setIsInvalidEmail] = useState(false);
	const [status, setStatus] = useState(false);
	const [mode, setMode] = React.useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState({ title: '', message: '', imagen: '' });
	const [noEquals, setNoEquals] = useState(false);

	function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
	  const { name, value } = e.target;
	  setInformation((prev) => ({ ...prev, [name]: value }));
	  setIsEmpty(false);
	  setIsInvalidEmail(false);
	}

	function handleModalClose() {
		if(status){
			setMode(2);
		}
	  	setIsModalOpen(false);
	}

	async function handleSubmit(){

	  if (information.email.trim() === '') {
			setIsEmpty(true);
			return;
	  }

	  if (!isValidEmail(information.email)) {
			setIsInvalidEmail(true);
			return;
	  }

	  // Verifica si el correo está registrado
	  const successful = await SolicitarCambioContrasenia(information.email);

	  if (successful == false) {
		// El correo no está registrado, muestra modal de usuario no registrado
			setModalContent({
		  title: 'Usuario no registrado o el código de confirmación ya fue enviado',
		  message: 'En caso de estar registrado en la plataforma, contacta con el administrador.',
		  imagen: 'M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2'
			});
			setIsModalOpen(true);
	  }
	  else {
		// El correo está registrado, muestra modal de éxito
			setModalContent({
		  title: 'Código de recuperación enviado exitosamente',
		  message: 'Revisa la bandeja de entrada e ingresa el correo.',
		  imagen: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z'
			});
			setIsModalOpen(true);
			setStatus(true);
	  }

	}

	const [emptyCode, setEmptyCode] = useState(false);

	async function handleChangePassword(){
		if (information.email.trim() === '') {
			  setIsEmpty(true);
			  return;
		}

		if (!isValidEmail(information.email)) {
			  setIsInvalidEmail(true);
			  return;
		}

		if(information._contrasenia == '' || information._contrasenia != information.contrasenia){
			setNoEquals(true);
			return;
		}

		if(information.codigo == ''){
			setEmptyCode(true);
			return;
		}

		// Verifica si el correo está registrado
		const successful = await RealizarCambioContrasenia(information.email, information.codigo, information.contrasenia);

		  // El correo no está registrado, muestra modal de usuario no registrado
		if(successful){
			setModalContent({
				title: 'Contraseña Cambiada con éxito',
				message: 'Ya puedes ingresar con tu nueva contraseña.',
				imagen: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z'
			});
			setIsModalOpen(true);
		}
		else{
			setModalContent({
				title: 'Fallo al realizar el cambio de contraseña',
				message: 'El código y/o correo ingresados pueden estar errados.',
				imagen: 'M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2'
				  });
			setIsModalOpen(true);
		}

	  }

	function isValidEmail(email: string): boolean {
	  return email.includes('@');
	}

	return (
	  <div className='w-full h-screen flex justify-center align-middle items-center'>

			{mode == 0 && <Form
		  className='w-full space-y-7'
		  title1=""
		  title2=""
		  title3="Recuperar contraseña"
		  onSubmit={()=>{}}
		  description=""
			>
				<div className='flex justify-center space-x-12 w-full px-40 py-12'>
					<Option setMode={setMode} value={1}>
						<h1>Solicitar</h1>
						<h1>Código</h1>
					</Option>
					<Option setMode={setMode} value={2}>
						<h1>Ingresar Código</h1>
					</Option>
				</div>
			</Form>}

			{mode == 1 && <Form className='w-full space-y-7'
				title1=""
				title2=""
				title3="Recuperar contraseña"
				onSubmit={() => {}}
				description=""
			  >
				<div className="my-[10px] flex flex-col gap-4">
					  <Form.Input
						className={isEmpty ? 'border-red-500' : ''}
						label=""
						name="email"
						placeholder="Ingresa tu correo..."
						onChange={handleInput}
						value={information.email}
						type="text"
					  />
					  {isEmpty && (
						<p className="text-red-600">El campo de correo no puede estar vacío</p>
					  )}
					  {isInvalidEmail && (
						<p className="text-red-600">Por favor, ingresa un correo válido</p>
					  )}
				</div>

				<div className="flex gap-4 justify-center items-center">
					  <Form.SubmitButton
					  disable={false}
						buttonText="ENVIAR CORREO"
						handleButton={handleSubmit}
					  />
					  <Link className='font-bold text-[18px] text-center mt-4 mx-10'
						href="../login">
				  Volver a inicio
					</Link>
				</div>
			  </Form>
			}

			{mode == 2 && <Form className='w-full space-y-7'
				title1=""
				title2=""
				title3="Recuperar contraseña"
				onSubmit={() => {}}
				description=""
			  >
				<div className="my-[10px] flex flex-col gap-4">
					<label>Correo</label>
					<Form.Input
						className={isEmpty ? 'border-red-500' : ''}
						label=""
						name="email"
						placeholder="Ingresa tu correo..."
						onChange={handleInput}
						value={information.email}
						type="text"
					  />
					  {isEmpty && (
						<p className="text-red-600">El campo de correo no puede estar vacío</p>
					  )}
					  {isInvalidEmail && (
						<p className="text-red-600">Por favor, ingresa un correo válido</p>
					  )}
					  <label>Código</label>
					  <Form.Input
						label=""
						name="codigo"
						placeholder="Ingresa el código que recibiste"
						onChange={handleInput}
						value={information.codigo}
						type="text"
					  />
					  {emptyCode && (
						<p className="text-red-600">El campo de código no puede estar vacío</p>
					  )}
					  <label>Contraseña Nueva</label>
					  <Form.Input
					  className={noEquals ? 'border-red-500' : ''}
						label=""
						name="contrasenia"
						placeholder="Ingresa la contraseña nueva"
						onChange={handleInput}
						value={information.contrasenia}
						type="text"
					  />
					  <label>Confirmar Contraseña</label>
					  <Form.Input
					  className={noEquals ? 'border-red-500' : ''}
						label=""
						name="_contrasenia"
						placeholder="Ingresa nuevamente la contraseña"
						onChange={handleInput}
						value={information._contrasenia}
						type="text"
					  />
					  {noEquals && (
						<p className="text-red-600">Ambas contraseñas deben coincidir</p>
					  )}
				</div>

				<div className="flex gap-4 justify-center items-center">
					  <Form.SubmitButton
					  disable={false}
						buttonText="Continuar"
						handleButton={handleChangePassword}
					  />
					  <Link className='font-bold text-[18px] text-center mt-4 mx-10'
						href="../login">
				  Volver a inicio
					</Link>
				</div>
			  </Form>
			}

			  <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalContent.title} imagen={modalContent.imagen}>
				<p>{modalContent.message}</p>
			  </Modal>

	  </div>
	);
}

const Option = ({ setMode, value, children }: { setMode: React.Dispatch<React.SetStateAction<number>>, value: number, children?: ReactNode }) => {
	return <div className='cursor-pointer w-full border border-white text-center text-3xl p-10 hover:bg-red-950' onClick={() => setMode(value)}>
		{children}
	</div>;
};
