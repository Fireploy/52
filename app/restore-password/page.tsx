'use client';

import loginData from '@/pruebas/login.json';
import { Modal } from '@/components/Modal';
import { Form } from '@/components/form';
import { useState, useEffect } from 'react';

export default function RestorePassword() {
	const [information, setInformation] = useState({
		password1: '',
		password2: '',
	});

	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [emptyFields, setEmptyFields] = useState({
		password1: false,
		password2: false,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState({ title: '', message: '', imagen: '' });

	function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setInformation((prev) => ({ ...prev, [name]: value }));
		setEmptyFields((prev) => ({ ...prev, [name]: false }));
	}

	function handleModalClose() {
		setIsModalOpen(false);
	  }

	  function handleSubmit(): void {
		// Verificar campos vacíos
		const fieldsToCheck = ['password1', 'password2'];
		const areFieldsEmpty = fieldsToCheck.some(
		  (field) => (information as Record<string, string>)[field].trim() === ''
		);

		if (areFieldsEmpty) {
		  // Campos vacíos, establece el estado de campos vacíos y devuelve
		  setEmptyFields({
				password1: information.password1.trim() === '',
				password2: information.password2.trim() === '',
		  });
		  return;
		}

		// Limpiar el estado de campos vacíos si no están vacíos
		setEmptyFields({ password1: false, password2: false });

		if (information.password1 === information.password2) {
		  // Contraseñas coinciden
		  const userIndex = loginData.findIndex((userData: any) => {
				return userData.Nombre === 'Kevin Tarazona';
		  });

		  if (userIndex !== -1) {
			// Cambiar la contraseña en el JSON para el usuario con el nombre "Kevin Tarazona"
				alert('indice' + userIndex + '\n' + 'Contraseña antigua: ' + loginData[userIndex].password + '\n' + 'Nueva contraseña: ' + information.password1);
				loginData[userIndex].password = information.password1;

				// Muestra el modal con el mensaje de éxito
				setModalContent({
			  title: 'Contraseña cambiada correctamente',
			  message: 'Has cambiado correctamente la contraseña.',
			  imagen: 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z',
				});

				setIsModalOpen(true);
		  }
		} else {
		  // Contraseñas no coinciden, muestra el mensaje de error
		  setPasswordsMatch(false);

		  // Después de 2 segundos, limpia los mensajes de error y los inputs
		  setTimeout(() => {
				setPasswordsMatch(true);
				setInformation({ password1: '', password2: '' });
		  }, 2000);
		}
	  }

	  return (
		<>
		  <Form
				className='flex justify-center flex-col space-y-4'
				title1=""
				title2=""
				title3="Cambia tu contraseña"
				description=""
				onSubmit={handleSubmit}
		  >
				{emptyFields.password1 && (
			  <p className="text-red-600 text-center mb-2">
				El campo no puede estar vacío
			  </p>
				)}
				<Form.Input
			  className={emptyFields.password1 ? 'border-red-500' : ''}
			  label=""
			  name="password1"
			  placeholder="Ingresa tu nueva contraseña..."
			  onChange={handleInput}
			  value={information.password1}
			  type="password"
				/>
				{emptyFields.password2 && (
			  <p className="text-red-600 text-center mb-2">
				El campo no puede estar vacío
			  </p>
				)}
				<Form.Input
			  className={emptyFields.password2 ? 'border-red-500' : ''}
			  label=""
			  name="password2"
			  placeholder="Confirma tu contraseña..."
			  onChange={handleInput}
			  value={information.password2}
			  type="password"
				/>
				{!passwordsMatch && (
			  <p className="text-red-600 text-center mt-2">
				Las contraseñas no coinciden
			  </p>
				)}
				<div className="flex justify-center mt-4">
			  <Form.SubmitButton
			  disable={false}
						buttonText="Cambiar contraseña"
						handleButton={handleSubmit}
			  />
				</div>
		  </Form>

		  {/* Modal para mensajes */}
		  <Modal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				title={modalContent.title}
				imagen={modalContent.imagen}
		  >
				<p>{modalContent.message}</p>
		  </Modal>
		</>
	  );
}
