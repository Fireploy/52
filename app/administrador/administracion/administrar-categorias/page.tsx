'use client';

import React, {
	FormEvent,
	useEffect,
	useState
} from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import Tabla from '@/components/tablas/categorias';
import axios from 'axios';
import sharp from 'sharp';
import Link from 'next/link';
import styles from '@/public/css/styles.module.scss';

type InputName = 'min' | 'max';
interface categoria {
	_id: string,
	name: string,
	maxWeight: number,
	minWeight: number,
}

export default function AdministrarCategorias() {
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const [categoria, setCategoria] = useState('');
	const [categorias, setCategorias] = useState<categoria[]>([]);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(1);
	const [checkPeso, setCheckPeso] = useState(false);
	const [checkData, setCheckData] = useState(false);
	const [repetido, setRepetido] = useState(false);

	const increment = (inputName: InputName): void => {
		if (inputName === 'min') {
			setMin(min + 1);
		} else if (inputName === 'max') {
			setMax(max + 1);
		}
	};

	const decrement = (inputName: InputName): void => {
		if (inputName === 'min' && min > 0) {
			setMin(min - 1);
		} else if (inputName === 'max' && max > 0) {
			setMax(max - 1);
		}
	};

	const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setCategoria(e.target.value);
	};

	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newValue = parseInt(e.target.value, 10);
		setMin(isNaN(newValue) ? 0 : newValue);
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newValue = parseInt(e.target.value, 10);
		setMax(isNaN(newValue) ? 0 : newValue);
	};
	const getCategorias = async (token:string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const response = await axios.get(`${apiEndpoint}/weightCategory/List`, {
				headers: headers,
			});
			return response.data.weightCategory;
		} catch (error) {
			console.log(error);
		}
	};
	const cargarCategorias = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if(datos != null){
			token = JSON.parse(datos).token;
		}
		setCategorias(await getCategorias(token));
	};

	const crearCategoria = async (token: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};
			const body = {
				name: categoria,
				maxWeight: max,
				minWeight: min
			};

			const response = await axios.post(`${apiEndpoint}/weightCategory`, body, {
				headers: headers,
			});
			cargarCategorias();
		} catch (error) {
			setRepetido(true);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if(checkPeso){
			setCheckData(true);
		}else{
			const datos = localStorage.getItem('userData');
			let token;
			if(datos != null){
				token = JSON.parse(datos).token;
			}
			crearCategoria(token);
		}
	};

	useEffect(()=>{
		cargarCategorias();
	}, []);

	useEffect(()=>{
		setCheckPeso(min >= max);
	}, [min, max]);

	const nombreValido = () => {
		const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
		return soloLetras.test(categoria);
	};
	const nombreRepetido = () => {
		let i = 0;
		while(i < categorias.length){
			if(categoria.toLocaleLowerCase() === categorias[i].name.toLocaleLowerCase()){
				return true;
			}
			i++;
		}
		return false;
	};
	const pesoInvalido = () => {
		let i = 0;
		while(i < categorias.length){
			if(((min >= categorias[i].minWeight && min <= categorias[i].maxWeight) || (max >= categorias[i].minWeight && max <= categorias[i].maxWeight)) || ((categorias[i].minWeight >= min && categorias[i].minWeight <= max) || (categorias[i].maxWeight >= min && categorias[i].maxWeight <= max))){
				return true;
			}
			i++;
		}
		return false;
	};

	const botonValido = () => {
		return !checkPeso && categoria !== '' && nombreValido() && !nombreRepetido() && !pesoInvalido();
	};
	return (
		<>
			{categorias.length == 0 && (<LoaderContenido></LoaderContenido>)}
			{categorias.length != 0 && (<div><div className='w-[80%] mx-auto mt-[6%]'>
				<h1 className='text-[300%]' id='textos-grandes'>
					CATEGORÍAS
				</h1>
			</div>
			<Tabla categorias={categorias} cargarCategorias={()=>cargarCategorias()}/>
			<div className='w-[80%] mx-auto mt-5'>
				<form className='flex col' onSubmit={handleSubmit}>
					<div className='w-2/4'>
						<div className='flex items-center justify-center'>
							<label className='block mb-2 tex-center text-[150%]' id='titulos-grandes'>NOMBRE DE LA CATEGORÍA</label>
						</div>
						<input
							type='text'
							value={categoria}
							required
							onChange={handleCategoriaChange}
							className={(categoria === '' ? 'border-[3px] border-red-700 ' : '') + 'bg-neutral-200 rounded-full w-full h-10 pl-5 text-black'}
							id="texto-general"
							placeholder="Ingrese el nombre de la categoría de peso que desea agregar"
						/>
					</div>
					<div className='w-1/4 mx-4'>
						<div className='flex items-center justify-center'>
							<label className='block mb-2 tex-center text-[150%]' id='titulos-grandes'>MIN</label>
						</div>
						<div className='flex items-center'>
							<button
								type='button'
								onClick={() => decrement('min')}
								className='p-2'
							>
								-
							</button>
							<input
								type='text'
								value={min}
								required
								onChange={handleMinChange}
								className="bg-neutral-200 rounded-full w-full h-10 text-black text-center"
								id="texto-general"
							/>
							<button
								type='button'
								onClick={() => increment('min')}
								className='p-2'
							>
								+
							</button>
						</div>
					</div>
					<div className='w-1/4'>
						<div className='flex items-center justify-center'>
							<label className='block mb-2 tex-center text-[150%]' id='titulos-grandes'>MAX</label>
						</div>
						<div className='flex items-center'>
							<button
								type='button'
								onClick={() => decrement('max')}
								className='p-2'
							>
								-
							</button>
							<input
								type='text'
								value={max}
								required
								onChange={handleMaxChange}
								className="bg-neutral-200 rounded-full w-full h-10 text-black text-center"
								id="texto-general"
							/>
							<button
								type='button'
								onClick={() => increment('max')}
								className='p-2'
							>
								+
							</button>
						</div>
					</div>
					<div className='flex-col items-center justify-center'>
						<div className='flex items-center justify-center'>
							<label className='block mb-2 tex-center text-[150%] text-transparent' id='titulos-grandes'>-</label>
						</div>
						<button
							type="submit"
							className={(botonValido() ? styles.button : styles.buttonDisabled + ' cursor-not-allowed') + ' mx-5 w-60 h-10 text-white py-2 px-4 rounded-lg'}
							disabled = {!botonValido()}
						>
					Agregar categoría de peso
						</button>
					</div>
				</form>
				{(checkPeso && !nombreRepetido()) && (
					<div className='mt-5'>
						<p className="text-[#cd1919] text-center mb-4 text-[110%]">
								El peso máximo no puede ser menor al peso minimo
						</p>
					</div>
				)}
			</div>
			<div className='w-[80%] mx-auto mt-2'>
				{(categoria !== '' && !nombreValido()) && (
					<div className='text-red-600'>El nombre sólo debe contener letras</div>
				)}
				{(nombreRepetido() && categoria !== '' && nombreValido()) && (
					<div className='text-red-600'>Ya existe una categoría con este nombre</div>
				)}
				{(pesoInvalido() && !nombreRepetido() && categoria !== '' && nombreValido() && !checkPeso) && (
					<div className='text-red-600 text-center'>Ya existe una categoría con ese rango de pesos</div>
				)}
			</div>
			<div className="flex justify-center mt-8">
				<Link href="../administracion" className={styles.button + ' w-40 h-10 text-white py-2 px-4 rounded-lg flex justify-center'}>
					Volver
				</Link>
			</div></div>)}
		</>
	);
}
