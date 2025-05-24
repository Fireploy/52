
import './loading.css';
import loading from '@/public/images/guantes-de-boxeo(blancos).png';
import Image from 'next/image';
export const LoaderContenido = () =>{
	return(
		<div className='flex justify-center items-center min-h-[600px]'>
			<div className='w-[128px] h-[128px] flex justify-center items-center'>
				<Image
					src={loading}
					alt='cargando'
					width={128}
					height={128}
					className='w-full h-full object-contain loader-image'
				/>
			</div>
		</div>

	);
};