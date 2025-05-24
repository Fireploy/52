import criteriosData from '@/pruebas/criterios.json';

export default function TableCriteriosEvaluacion() {

	return (
		<table className="w-full">
			<thead>
				<tr>
					<th className="border-[#1e1e1e] border-[8px] p-3 bg-[#cd1919] text-white text-center text-[150%] tracking-widest" id='titulos-grandes'>Criterio</th>
				</tr>
			</thead>
			<tbody>
				{criteriosData.map((criterio, index) => (
					<tr key={index}>
						<td className=" border-[#1e1e1e] border-[8px] p-3 bg-[#dfdfdf] text-center text-black">{criterio.Nombre}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}