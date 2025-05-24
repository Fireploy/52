import usuariosData from '@/pruebas/usuarios.json';

export default function TableRoles() {

	const rolesUnicos = Array.from(new Set(usuariosData.map((usuario) => usuario.rol)));

	return (
		<table className="w-full">
			<thead>
				<tr>
					<th
						className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center text-[150%] tracking-widest"
						id="titulos-grandes"
					>
                        Rol
					</th>
				</tr>
			</thead>
			<tbody>
				{rolesUnicos.map((rol, index) => (
					<tr key={index}>
						<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">
							{rol}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}