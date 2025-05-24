import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';
import Select from 'react-select';

interface User {
  _id: string;
  name: string;
  lastName: string;
  // ... otras propiedades
}

interface UserDeportista {
  _id: string;
  name: string;
  lastName: string;
  cedula: string;
  email: string;
  weight: number;
  // ... otras propiedades
}

interface Category {
  _id: string;
  name: string;
  maxWeight: number;
  minWeight: number;
}

interface Combat {
  boxer1: string;
  boxer2: string;
}

export default function CrearTorneo() {
	const [entrenadores, setEntrenadores] = useState<User[]>([]);
	const [usuarios, setUsuarios] = useState<UserDeportista[]>([]);
	const [categorias, setCategorias] = useState<Category[]>([]);
	const [correos, setCorreos] = useState('');
	const [selectedEntrenador, setSelectedEntrenador] = useState('');
	const [fechaEvento, setFechaEvento] = useState('');
	const [horaInicio, setHoraInicio] = useState('');
	const [horaFin, setHoraFin] = useState('');
	const [nombreEvento, setNombreEvento] = useState('');
	const [descripcionEvento, setDescripcionEvento] = useState('');
	const [fechainvalida, setFechainvalida] = useState(false);
	const [horaInvalida, setHoraInvalida] = useState(false);
	const [nuevoParticipante1, setNuevoParticipante1] = useState('');
	const [nuevoParticipante2, setNuevoParticipante2] = useState('');
	const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>([]);
	const [selectedCategoria, setSelectedCategoria] = useState<string>('');
	const [filteredUsuarios, setFilteredUsuarios] = useState<UserDeportista[]>([]);
	const [combates, setCombates] = useState<Combat[]>([]);
	const [fechaRepetida, setFechaRepetida] = useState(false);
	const [misDatos, setMisDatos] = useState<User>();

	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;
	const router = useRouter();

	const getEntrenadores = async (token: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const parametros = {
				role: 'Entrenador',
			};

			const response = await axios.get(`${apiEndpoint}/users/List`, {
				headers: headers,
				params: parametros,
			});
			return response.data.users;
		} catch (error) {
			console.log(error);
		}
	};

	const getUsuarios = async (token: string) => {
		try {
			const headers = {
				sessiontoken: token,
			};

			const parametros = {
				role: 'Deportista',
			};

			const response = await axios.get(`${apiEndpoint}/users/List`, {
				headers: headers,
				params: parametros,
			});
			return response.data.users;
		} catch (error) {
			console.log(error);
		}
	};

	const cargarEntrenadores = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if (datos != null) {
			token = JSON.parse(datos).token;
		}
		const result = await getEntrenadores(token);
		setEntrenadores(result);
	};

	const cargarUsuarios = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if (datos != null) {
			token = JSON.parse(datos).token;
		}
		const result = await getUsuarios(token);
		setUsuarios(result);
	};

	const cargarCategorias = async () => {
		const datos = localStorage.getItem('userData');
		let token;
		if (datos != null) {
			token = JSON.parse(datos).token;
		}
		try {
			const headers = {
				sessiontoken: token,
			};

			const response = await axios.get(`${apiEndpoint}/weightCategory/List`, {
				headers: headers,
			});
			setCategorias(response.data.weightCategory);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		cargarEntrenadores();
		cargarUsuarios();
		cargarCategorias();
	}, []);

	useEffect(()=>{
		//console.log(selectedEntrenador);
		//console.log(fechaEvento);
		//console.log(combates);
	}, [combates]);

	useEffect(() => {
		if (selectedCategoria) {
			const categoriaSeleccionada = categorias.find((categoria) => categoria._id === selectedCategoria);
			if (categoriaSeleccionada) {
				const { minWeight, maxWeight } = categoriaSeleccionada;
				setFilteredUsuarios(usuarios.filter((usuario) => usuario.weight >= minWeight && usuario.weight <= maxWeight));
			}
		}
	}, [selectedCategoria, categorias, usuarios]);

	useEffect(() => {
		let nuevosCorreos = '';
		for (const user of selectedUsuarios) {
			nuevosCorreos += user + '\n';
		}
		setCorreos(nuevosCorreos);
	}, [selectedUsuarios]);

	useEffect(() => {
		if (typeof horaInicio === typeof horaFin) {
			if (horaInicio.length > 1) {
				const horaI = horaInicio.split(':');
				const horaF = horaFin.split(':');
				if (parseInt(horaI[0]) > parseInt(horaF[0])) {
					setHoraInvalida(true);
				} else {
					if (parseInt(horaI[0]) === parseInt(horaF[0])) {
						if (parseInt(horaI[1]) < parseInt(horaF[1])) {
							setHoraInvalida(false);
						} else {
							setHoraInvalida(true);
						}
					} else {
						setHoraInvalida(false);
					}
				}
			}
		} else {
			setHoraInvalida(true);
		}
	}, [horaFin, horaInicio]);

	const handlerSetParticipantes = (eliminar: boolean) => {
		let users = [...selectedUsuarios];
		const indice = users.indexOf(nuevoParticipante1);

		// Verificar si el participante ya está en algún combate como boxer1 o boxer2
		const participanteYaEnCombate = combates.some((combat) =>
			combat.boxer1 === nuevoParticipante1 || combat.boxer2 === nuevoParticipante1 ||
			combat.boxer1 === nuevoParticipante2 || combat.boxer2 === nuevoParticipante2
		);

		if (eliminar) {
			if (indice !== -1) {
				users.splice(indice, 1);
			}
		} else {
			if (indice === -1 && !participanteYaEnCombate) {
				users.push(nuevoParticipante1);
			}
		}

		setSelectedUsuarios(users);

		// Guardar el combate en el estado de combates si no existe aún
		if (!participanteYaEnCombate) {
			const nuevoCombate: Combat = {
				boxer1: nuevoParticipante1,
				boxer2: nuevoParticipante2,
			};
			setCombates([...combates, nuevoCombate]);
		}

		// Imprimir el arreglo de combates en la consola
	};

	const handlerCancelar = () => {
		const datos = localStorage.getItem('userData');
		let rol;
		let route;
		if (datos !== null) {
			rol = JSON.parse(datos).role;
		}
		if (rol === 'Entrenador') route = 'entrenador';
		else route = 'administrador';
		router.push('/' + route + '/calendario');
	};

	const handlerSubmit = async () => {
		let token;
		const datos = localStorage.getItem('userData');
		if (datos !== null) {
			token = JSON.parse(datos).token;
		}
		const headers = {
			sessiontoken: token,
		};

		const body = {
			name: nombreEvento,
			description: descripcionEvento,
			trainer: selectedEntrenador,
			date: fechaEvento,
			startsAt: horaInicio,
			endsAt: horaFin,
			combats: combates
		};
		let rol;
		let route;
		if (datos !== null) {
			rol = JSON.parse(datos).role;
		}
		if (rol === 'Entrenador') route = 'entrenador';
		else route = 'administrador';
		try {
			let response = await axios.post(`${apiEndpoint}/event/battle`, body, { headers: headers });
			//console.log(response);
			router.push('/' + route + '/calendario');
		} catch (error) {
			setFechaRepetida(true);
			console.log(error);
		}
	};

	const ready = () => {
		return usuarios.length != 0 && entrenadores.length != 0 && categorias.length != 0;
	};

	const entrenadorSeleccionadoValido = () => {
		return selectedEntrenador !== '' && selectedEntrenador !== '-';
	};
	const fechaEventoVacio = () => {
		return fechaEvento === '';
	};
	const horaInicioVacia = () =>{
		return horaInicio === '';
	};
	const horaFinVacia = () => {
		return horaFin === '';
	};
	const nombreEventoVacio = () => {
		return nombreEvento === '';
	};
	const descripcionEventoVacio = () => {
		return descripcionEvento === '';
	};
	const categoriaVacia = () => {
		return selectedCategoria === '-' || selectedCategoria === '';
	};
	const nuevoParticipante1Vacio = () => {
		return nuevoParticipante1 === '' || nuevoParticipante1 === '-';
	};
	const nuevoParticipante2Vacio = () => {
		return nuevoParticipante2 === '' || nuevoParticipante2 === '-';
	};
	const combatesVacios = () => {
		return combates.length === 0;
	};

	const botonValido = () => {
		return entrenadorSeleccionadoValido() && !fechaEventoVacio() && !fechainvalida && !horaInicioVacia() && !horaFinVacia() && !nombreEventoVacio() && !descripcionEventoVacio() && !combatesVacios();
	};

	const opcionesEntrenadores = entrenadores.map((entrenador) => ({
		value: entrenador._id,
		label: `${entrenador.name} ${entrenador.lastName}`
	  }));

	  const opcionesCategorias = categorias.map((categoria) => ({
		value: categoria._id,
		label: categoria.name
	}));

	const opcionesCombatientes1 = filteredUsuarios.map((usuario) => ({
		value: usuario._id,
		label: usuario.name + ' ' + usuario.lastName
	}));

	const opcionesCombatientes2 = filteredUsuarios.map((usuario) => ({
		value: usuario._id,
		label: usuario.name + ' ' + usuario.lastName
	}));

	const opcionesFiltradas1 = opcionesCombatientes1.filter(
		(opcion) => opcion.value !== nuevoParticipante2
	);

	const opcionesFiltradas2 = opcionesCombatientes2.filter(
		(opcion) => opcion.value !== nuevoParticipante1
	);

	const esAdmin = () => {
		const datos = localStorage.getItem('userData');
		let rol;
		if (datos != null) {
			rol = JSON.parse(datos).role;
		}
		if (rol === 'Admin') {
			return true;
		} else {
			return false;
		}
	};

	const guessFechaInvalida = (fhoy: Date, fteclado: Date) => {
		console.log(fteclado.getUTCDate());
		console.log(fhoy.getUTCDate());
		if(fteclado.getFullYear() > fhoy.getFullYear()){
			setFechainvalida(false);
		}
		else if(fteclado.getFullYear() === fhoy.getFullYear()){
			if(fteclado.getMonth() > fhoy.getMonth()){
				setFechainvalida(false);
			}
			else if(fteclado.getMonth() === fhoy.getMonth()){
				if(fteclado.getUTCDate() >= fhoy.getUTCDate()){
					setFechainvalida(false);
				}
				else{
					setFechainvalida(true);
				}
			}
			else{
				setFechainvalida(true);
			}
		}
		else{setFechainvalida(true);}
	};

	return (
		<>
			{!ready() && <LoaderContenido />}
			{ready() && (
				<div className="container mx-auto mt-8">
					<div className="p-4 ">
						<form onSubmit={handlerSubmit}>
							<div className="flex">
								<div className="w-2/3 pr-4">
									<h1 className="text-center text-[400%]" id="titulos-grandes">
                    Nuevo torneo
									</h1>
									<div className="flex">
										<div className="w-1/3 mx-2">
											<div
												className="w-full h-10 mx-5 my-2 flex items-center justify-center text-white"
												id="texto-general"
											>
                        Entrenador encargado
											</div>
										</div>
										{esAdmin() && (
											<Select
												className='"bg-white text-black w-full h-10 mx-5 my-2 pl-1 text-black"'
												id="texto-general"
												placeholder = 'Selecciona un entrenador'
												styles={{
													option: (baseStyles, { isFocused, isSelected }) => ({
														...baseStyles,
														backgroundColor: isSelected ? '#E68C8C' : isFocused ? '#F5D1D1' : baseStyles.backgroundColor,
														borderRadius: '10px',
														':active': {
															backgroundColor: '#F5D1D1', // Cambiar color de fondo cuando la opción está activa
														},
													}),
													control: (baseStyles, isFocused) => ({
														...baseStyles,
														borderColor: 'black',
														borderRadius: '20px',
														borderWidth: '3px',
													}),
													input: (baseStyles) => ({
														...baseStyles,
														textAlign: 'center'
													}),
												}}
												options={opcionesEntrenadores}
												value={opcionesEntrenadores.find((opcion) => opcion.value === selectedEntrenador)}
												onChange={(selectedOption) => setSelectedEntrenador(selectedOption?.value || '')}
											/>
										)}
										{!esAdmin() && (
											<label
												className="bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 p-2 pl-3 text-black"
												id="texto-general"
											>
												{misDatos?.name}
											</label>
										)}
									</div>
									<div className="flex">
										<div className="w-1/3 mx-2">
											<div
												className="w-full h-10 mx-5 my-2 flex items-center justify-center text-white"
												id="texto-general"
											>
                        Fecha del evento
											</div>
										</div>
										<input
											required
											type="date"
											onChange={(event) => {
												setFechaEvento(event.target.value);
												guessFechaInvalida(new Date(), new Date(event.target.value));
											}}
											className={
												(fechaEventoVacio()
													? ' border-[3px] border-red-700 '
													: '') +
                        'bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
											}
											id="texto-general"
										/>
									</div>
									{fechainvalida && (
										<div className="flex justify-center">
											<p className="text-red-500 mb-2">
                        La fecha no puede ser en un día anterior a la fecha de
                        hoy
											</p>
										</div>
									)}

									<div className="flex items-center justify-center">
										<div className="flex">
											<div className="w-1/3 mx-4">
												<div
													className="w-full h-10 mx-5 my-2 flex items-center justify-center text-white"
													id="texto-general"
												>
                          Hora inicio
												</div>
											</div>
											<input
												required
												type="time"
												onChange={(event) => {
													setHoraInicio(event.target.value);
												}}
												className={
													(horaInicioVacia()
														? ' border-[3px] border-red-700 '
														: '') +
                          'bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
												}
												id="texto-general"
												placeholder="Hora inicio"
											/>
										</div>
										<div className="flex">
											<div className="w-1/3 mx-2">
												<div
													className="w-full h-10 mx-5 my-2 flex items-center justify-center text-white"
													id="texto-general"
												>
                          Hora fin
												</div>
											</div>
											<input
												required
												type="time"
												onChange={(event) => {
													setHoraFin(event.target.value);
												}}
												className={
													(horaFinVacia()
														? ' border-[3px] border-red-700 '
														: '') +
                          'bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
												}
												id="texto-general"
												placeholder="Hora fin"
											/>
										</div>
									</div>
									{horaInvalida && (
										<div className="flex justify-center">
											<p className="text-red-500 mb-2">
                        La hora de fin no puede corresponder a una hora anterior
                        a la hora de inicio
											</p>
										</div>
									)}
									<div className="flex">
										<input
											required
											placeholder="Nombre del evento"
											onChange={(event) => {
												setNombreEvento(event.target.value);
											}}
											type="text"
											className={
												(nombreEventoVacio()
													? ' border-[3px] border-red-700 '
													: '') +
                        'bg-neutral-200 rounded-full w-full h-10 mx-5 my-2 pl-4 text-black'
											}
											id="texto-general"
										/>
									</div>
									<div className="flex items-center justify-center">
										<textarea
											required
											onChange={(event) => {
												setDescripcionEvento(event.target.value);
											}}
											rows={3}
											className={
												(descripcionEventoVacio()
													? ' border-[3px] border-red-700 '
													: '') +
                        'bg-neutral-200 rounded-lg w-full mx-5 my-2 p-2 text-black'
											}
											id="texto-general"
											placeholder="Descripcion general del evento"
										/>
									</div>
									{fechaRepetida && (
										<p className="text-center p-4 text-[125%] text-red-600">
                      Ya hay un evento programado para esa fecha
										</p>
									)}
								</div>
								<div className="w-1/2 pr-4">
									<div className="flex">
										<div className="w-1/3 mx-2">
											<div
												className="w-full h-10 mx-5 my-2 flex items-center justify-center text-white"
												id="texto-general"
											>
                        Categoría
											</div>
										</div>
										<Select
											className=" w-full h-10 mx-5 my-2 pl-1 text-black"
											id="texto-general"
											placeholder='Selecciona una categoría'
											styles={{
												option: (baseStyles, { isFocused, isSelected }) => ({
													...baseStyles,
													backgroundColor: isSelected ? '#E68C8C' : isFocused ? '#F5D1D1' : baseStyles.backgroundColor,
													borderRadius: '10px',
													':active': {
														backgroundColor: '#F5D1D1', // Cambiar color de fondo cuando la opción está activa
													},
												}),
												control: (baseStyles, isFocused) => ({
													...baseStyles,
													borderColor: 'black',
													borderRadius: '20px',
													borderWidth: '3px',
												}),
												input: (baseStyles) => ({
													...baseStyles,
													textAlign: 'center'
												}),
											}}
											options={opcionesCategorias}
											value={opcionesCategorias.find((opcion) => opcion.value === selectedCategoria)}
											onChange={(selectedOption) => {
												setSelectedCategoria(selectedOption?.value || '');
												setNuevoParticipante1('-');
												setNuevoParticipante2('-');
											}}
										/>
									</div>
									<div className="flex">
										<Select
											isDisabled={categoriaVacia() ? true : false}
											className="text-black w-full h-10 mx-5 my-2 pl-1"
											id="texto-general"
											styles={{
												option: (baseStyles, { isFocused, isSelected }) => ({
													...baseStyles,
													backgroundColor: isSelected ? '#E68C8C' : isFocused ? '#F5D1D1' : baseStyles.backgroundColor,
													borderRadius: '10px',
													':active': {
														backgroundColor: '#F5D1D1', // Cambiar color de fondo cuando la opción está activa
													},
												}),
												control: (baseStyles, isFocused) => ({
													...baseStyles,
													borderColor: 'black',
													borderRadius: '20px',
													borderWidth: '3px',
												}),
												input: (baseStyles) => ({
													...baseStyles,
													textAlign: 'center'
												}),
												menu: (baseStyles) => ({
													...baseStyles,
													borderRadius: '12px'
												}),
											}}
											placeholder={categoriaVacia() ? 'Primero selecciona una categoría' : 'Selecciona un combatiente'}
											options={opcionesFiltradas1}
											value={opcionesFiltradas1.find((opcion) => opcion.value === nuevoParticipante1)}
											onChange={(selectedOption) => setNuevoParticipante1(selectedOption?.value || '')}
										/>
									</div>
									<div className="flex justify-center">
										<h1
											className="text-center text-[250%]"
											id="titulos-grandes"
										>
                      VS
										</h1>
									</div>
									<div className="flex">
										<Select
											isDisabled={categoriaVacia() ? true : false}
											className="text-black w-full h-10 mx-5 my-2 pl-1"
											id="texto-general"
											styles={{
												option: (baseStyles, { isFocused, isSelected }) => ({
													...baseStyles,
													backgroundColor: isSelected ? '#E68C8C' : isFocused ? '#F5D1D1' : baseStyles.backgroundColor,
													borderRadius: '10px',
													':active': {
														backgroundColor: '#F5D1D1', // Cambiar color de fondo cuando la opción está activa
													},
												}),
												control: (baseStyles, isFocused) => ({
													...baseStyles,
													borderColor: 'black',
													borderRadius: '20px',
													borderWidth: '3px',
												}),
												input: (baseStyles) => ({
													...baseStyles,
													textAlign: 'center'
												}),
											}}
											placeholder={categoriaVacia() ? 'Primero selecciona una categoría' : 'Selecciona un combatiente'}
											options={opcionesFiltradas2}
											value={opcionesFiltradas2.find((opcion) => opcion.value === nuevoParticipante2)}
											onChange={(selectedOption) => setNuevoParticipante2(selectedOption?.value || '')}
										/>
									</div>
									<div className="flex">
										<textarea
											required
											value={combates
												.map(
													(combat) =>
														`${
															usuarios.find(
																(user) => user._id === combat.boxer1
															)?.name
														} vs ${
															usuarios.find(
																(user) => user._id === combat.boxer2
															)?.name
														}`
												)
												.join('\n')}
											readOnly
											className={
												(combatesVacios()
													? 'border-[3px] border-red-700 '
													: '') +
                        'bg-neutral-200 rounded-lg w-full h-40 mx-5 my-5 p-2 text-black'
											}
											id="texto-general"
											placeholder="Combates"
										/>
									</div>
									<div className="flex justify-center items-center mt-4">
										<button
											type="button"
											disabled={
												nuevoParticipante1Vacio() || nuevoParticipante2Vacio()
											}
											onClick={() => handlerSetParticipantes(false)}
											className={
												(nuevoParticipante1Vacio() || nuevoParticipante2Vacio()
													? styles.buttonDisabled + ' cursor-not-allowed'
													: styles.button) + ' text-white rounded p-2'
											}
										>
                      Agregar Combate
										</button>
									</div>
								</div>
							</div>
							<div className="flex justify-center items-center mt-4">
								<button
									onClick={() => handlerSubmit()}
									type="button"
									className={
										(!botonValido()
											? styles.buttonDisabled + ' cursor-not-allowed'
											: styles.button) + ' text-white rounded p-2 mx-5'
									}
								>
                  Agregar Torneo
								</button>
								<button
									type="button"
									onClick={handlerCancelar}
									className={
										styles.button + ' text-white rounded p-2 w-[130px]'
									}
								>
                  Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
