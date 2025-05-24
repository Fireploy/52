'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Form } from '@/components/form';
import { useState } from 'react';
import axios from 'axios';
import imagen from '@/public/images/loginImage.png';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();

	const [information, setInformation] = useState({
		email: '',
		password: '',
	});
	const [incorrectData, setIncorrectData] = useState(false);

	function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
		const value: string = e.target.value;
		setInformation({ ...information, [e.target.name]: value });
		setIncorrectData(false);
	}

	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	async function handleButton(): Promise<void> {
		try {
			const requestBody = {
				email: information.email,
				password: information.password,
			};

			const requestHeaders = {
				'Content-Type': 'application/json',
				// Agrega otros encabezados si son necesarios
			};

			const response = await axios.post(`${apiEndpoint}/login`, requestBody, {
				headers: requestHeaders,
			});

			// Si la solicitud fue exitosa, puedes acceder a los datos de la respuesta
			const user = response.data;
			localStorage.setItem('userData', JSON.stringify(user));
			setIncorrectData(false);

			if(user.role == 'Admin'){
				user.role = 'administrador';
			}

			/* useEffect(() => {
				router.push(`/app/${user.rol}/mi-perfil`);
			}, [user.rol]); */
			router.push(`/${user.role.toLowerCase()}/mi-perfil`);

		} catch (error) {
			setInformation({ email: '', password: '' });
			setIncorrectData(true);
		}
	}

	return (
		<div className='flex justify-center align-center'>
			<Image
				src={imagen}
				alt="Logo Liga de Boxeo de Norte de Santander"
				className="w4/6"
				priority
			/>
			<div className='flex flex-col items-end justify-center m-20'>
				<Form title1='LIGA DE' title2='BOXEO' title3='NORTE' onSubmit={() => { }} description='' className=''>
					<div className='flex flex-col mt-12 mb-5'>
						{incorrectData && (
							<p className='text-red-500 mb-2'>Los datos ingresados son incorrectos</p>
						)}
						{
							(!information.email.includes('@gmail.com') && information.email.length != 0) && (
								<p className='text-red-500 '>El correo debe contener @gmail.com</p>
							)
						}
						<Form.Input
							className='mb-5'
							label=''
							name='email'
							placeholder='usuario@gmail.com'
							onChange={handleInput}
							value={information.email}
							type="text"
						/>
						<Form.Input
							className=''
							label=''
							name='password'
							placeholder='Contraseña...'
							onChange={handleInput}
							value={information.password}
							type="password"
						/>
					</div>

					<div className='flex gap-4 items-center'>
						<Form.SubmitButton disable= {information.password.length == 0 || !information.email.includes('@gmail.com') ? true : false} buttonText='INGRESAR' handleButton={handleButton} />
						<Form.Footer
							description=''
							link='/forget-password'
							textLink='¿Olvidaste la contraseña?'
						/>
					</div>

				</Form>
			</div>
		</div>
	);
}
