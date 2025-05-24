export default function fechaCompleta(fecha: Date){
	// Obtener los componentes de la fecha
	var year = fecha.getFullYear();
	var month = ('0' + (fecha.getMonth() + 1)).slice(-2); // Sumar 1 al mes ya que los meses van de 0 a 11
	var day = ('0' + fecha.getDate()).slice(-2);
	var formattedDate = year + '-' + month + '-' + day;
	return formattedDate;
}