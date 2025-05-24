import '@/app/administrador/lista-usuarios/estilos.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { LoaderContenido } from '@/components/loaderContenido';
import styles from '@/public/css/styles.module.scss';

interface User {
    _id: string;
    name: string;
    lastName: string;
    role: string;
    club: string;
    email: string;
    weightCategory: string;
    // ... otras propiedades
  }

  interface TableProps {
    rol: string;
  }

const TableDeportistas: React.FC<TableProps> = ({ rol }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredData, setFilteredData] = useState<User[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [clubes, setClubes] = useState<{ [clubId: string]: string }>({});
	const [weightCategories, setWeightCategories] = useState<{
      [weightCategoryId: string]: string;
    }>({});
	const usersPerPage = 10;
	const apiEndpoint = process.env.NEXT_PUBLIC_URL_BACKEND;

	useEffect(() => {
		cargarUsuarios();
	}, []);

	const cargarUsuarios = async () => {
		const datos = localStorage.getItem('userData');
		var arreglo;

		if (datos != null) {
			arreglo = JSON.parse(datos);
		}
		const datoos = await carga(arreglo, rol);
		setFilteredData(datoos);
		setUsers(datoos);
	};

	const carga = async (datos: { token: any }, rol: any): Promise<any> => {
		try {
			const headers = {
				sessiontoken: datos.token,
			};
			const parametros = {
				role: rol,
			};

			const response = await axios.get(`${apiEndpoint}/users/List`, {
				params: parametros,
				headers: headers,
			});
			return response.data.users;
		} catch (error) {
			console.log(error);
		}
	};

	const cargarClub = async (clubId: string) => {
		try {
			const datos = localStorage.getItem('userData');
			if (datos != null) {
				const arreglo = JSON.parse(datos);
				const token = arreglo.token;

				const headers = {
					sessiontoken: token,
				};

				const parametros = {
					clubId: clubId,
				};

				if(parametros.clubId !== null && parametros.clubId !== undefined)
				{const response = await axios.get(`${apiEndpoint}/club`, {
					params: parametros,
					headers: headers,
				});

				const clubName = response.data.club.name;
				setClubes((prevClubes) => ({
					...prevClubes,
					[clubId]: clubName,
				}));

				return clubName;}
			}
		} catch (error) {
			console.log(error);
			return '';
		}
	};

	const cargarWeightCategory = async (weightCategoryId: string) => {
		try {
			const datos = localStorage.getItem('userData');
			if (datos != null) {
				const arreglo = JSON.parse(datos);
				const token = arreglo.token;

				const headers = {
					sessiontoken: token,
				};

				const parametros = {
					weightCategoryId: weightCategoryId,
				};

				if(parametros.weightCategoryId !== undefined && parametros.weightCategoryId !== null){
					const response = await axios.get(`${apiEndpoint}/weightCategory`, {
						params: parametros,
						headers: headers,
					});
					const weightCategoryName = response.data.Category.name;
					setWeightCategories((prevCategories) => ({
						...prevCategories,
						[weightCategoryId]: weightCategoryName,
					}));

					return weightCategoryName;
				}
			}
		} catch (error) {
			console.log(error);
			return '';
		}
	};

	useEffect(() => {
		const cargarTodosClubes = async () => {
			const clubesIds = new Set(filteredData.map((user) => user.club));
			for (const clubId of clubesIds) {
				await cargarClub(clubId);
			}
		};
		cargarTodosClubes();
	}, [filteredData]);

	useEffect(() => {
		const cargarTodasCategoriasPeso = async () => {
			const weightCategoriesIds = new Set(
				filteredData.map((user) => user.weightCategory)
			);
			for (const weightCategoryId of weightCategoriesIds) {
				await cargarWeightCategory(weightCategoryId);
			}
		};
		cargarTodasCategoriasPeso();
	}, [filteredData]);

	const handlePageChange = (selectedPage: { selected: number }) => {
		const newPage = selectedPage.selected;
		if (newPage >= 0 && newPage < Math.ceil(filteredData.length / usersPerPage)) {
			setCurrentPage(newPage);
		}
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value.toLowerCase();
		const filtered = users.filter(
			(user: User) =>
				(user.name + ' ' + user.lastName).toLowerCase().includes(searchTerm)
		);
		setFilteredData(filtered);
		setCurrentPage(0);
	};

	const renderUsers = () => {
		const start = currentPage * usersPerPage;
		const end = start + usersPerPage;
		const usersToRender = Array.isArray(filteredData) ? filteredData : [];

		return usersToRender.slice(start, end).map((item) => (
			<tr key={item._id}>
				<td className="border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-black text-center" id='texto-general'>
					{item.name + ' ' + item.lastName}
				</td>
				<td className="border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-black text-center" id='texto-general'>
					{(item.club !== null && item.club !== undefined) ? clubes[item.club] : 'Sin club'}
				</td>
				<td className="border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-black text-center" id='texto-general'>
					{(item.weightCategory !== null && item.weightCategory !== undefined) ? weightCategories[item.weightCategory] : 'Sin categoría'}
				</td>
				<td className="border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-black text-center" id='texto-general'>
					{item.email}
				</td>
			</tr>
		));
	};

	const ready = () => {
		return users.length != 0 && Object.keys(clubes).length !== 0 && Object.keys(weightCategories).length !== 0;
	};

	return (
		<>
			{!ready() && (
				<LoaderContenido/>
			)}
			{ready() && (
				<div className="w-80% mx-auto">
					<h1 className="text-5xl text-white mb-4">USUARIOS</h1>
					<input
						type="text"
						placeholder="Filtrar por nombre"
						onChange={handleSearch}
						className="p-2 rounded-[18px] bg-gray-200 focus:outline-none mb-4 text-black"
						id='texto-general'
					/>
					<table className="w-full">
						<thead>
							<tr>
								<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] w-1/4 text-white text-center">NOMBRE</th>
								<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] w-1/4 text-white text-center">CLUB</th>
								<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] w-1/4 text-white text-center">CATEGORÍA DE PESO</th>
								<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] w-1/4 text-white text-center">CORREO</th>
							</tr>
						</thead>
						<tbody>{renderUsers()}</tbody>
					</table>
					<ReactPaginate
						pageCount={Math.ceil(filteredData.length / usersPerPage)}
						onPageChange={handlePageChange}
						containerClassName="pagination flex gap-2 justify-center"
						activeClassName="active"
						pageLinkClassName="page-link"
						previousLabel={<button className={styles.button + ' text-white rounded p-2'}>Anterior</button>}
						nextLabel={<button className={styles.button + ' text-white rounded p-2'}>Siguiente</button>}
						pageRangeDisplayed={0}
						marginPagesDisplayed={0}
					/>
				</div>
			)}
		</>
	);
};

export default TableDeportistas;