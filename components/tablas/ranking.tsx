import '@/app/administrador/lista-usuarios/estilos.css';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styles from '@/public/css/styles.module.scss';

// Definir las propiedades del componente Table
interface TableProps {
  data: tablaRanking []
}

interface User{
	id: string,
	nombre: string,
	apellido: string,
	puntos: number,
	Ranking: Ranking,
}

interface Ranking{
	draw: number,
	lose: number,
	win: number,
}

// Definir el componente funcional Table
const RankingTable: React.FC<TableProps> = ({ data }) => {
	//console.log(data);

	const [users, setUsers] = useState<User[]>([]);
	const [filteredData, setFilteredData] = useState<User[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const usersPerPage = 10;

	// Estado para almacenar los datos filtrados

	// Función para manejar el cambio de página
	const handlePageChange = (selectedPage: { selected: number }) => {
		const newPage = selectedPage.selected;
		if (newPage >= 0 && newPage < Math.ceil(filteredData.length / usersPerPage)) {
			setCurrentPage(newPage);
		}
	};

	// Función para manejar la búsqueda por nombre y rol
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value.toLowerCase();
		const filtered = users.filter(
			(user: User) => (user.nombre + ' ' + user.apellido).toLowerCase().includes(searchTerm)
		);
		setFilteredData(filtered);
		setCurrentPage(0);
	};
	//Función para cargar los usuarios
	useEffect(() => {
		// Mapear el array y crear instancias de la interfaz User
		const mappedUsers: User[] = data.map((item) => ({
		  id: item.id,
		  nombre: item.nombre,
		  apellido: item.apellido,
		  puntos: (item.ranking.win * 2) + item.ranking.draw,
		  Ranking: {
				draw: item.ranking.draw,
				lose: item.ranking.lose,
				win: item.ranking.win,
		  },
		  // ... otras propiedades
		}));

		// Establecer los usuarios en el estado
		const sortedUsers = mappedUsers.sort((a, b) => b.puntos - a.puntos);
		setUsers(sortedUsers);
		setFilteredData(sortedUsers);
	  }, [data]);

	  // Función para renderizar las filas de usuarios
	const renderUsers = () => {
		const start = currentPage * usersPerPage;
		const end = start + usersPerPage;
		return filteredData.slice(start, end).map((item, index) => (
			<tr key={item.id}>
				<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">{item.nombre + ' ' + item.apellido}</td>
				<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">{item.Ranking.win}</td>
				<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">{item.Ranking.lose}</td>
				<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">{item.Ranking.draw}</td>
			</tr>
		));
	};

	// Renderizar el componente Table
	return (
		<div className=" w-[80%] mx-auto mt-5 p-5">
			<h1 className="text-5xl text-white mb-4">RANKING</h1>
			<input
				type="text"
				placeholder="Filtrar por nombre"
				onChange={handleSearch}
				className="px-5 py-2 rounded-[18px] bg-gray-200 focus:outline-none mb-4 text-black"
			/>
			<table className="w-full">
				<thead>
					<tr>
						<th className=" border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center">NOMBRE</th>
						<th className=" border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center">VICTORIAS</th>
						<th className=" border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center">DERROTAS</th>
						<th className=" border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center">EMPATES</th>
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
				pageRangeDisplayed={2}
				marginPagesDisplayed={1}
			/>
		</div>
	);
};

export default RankingTable;
