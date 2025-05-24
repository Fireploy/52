import type { Metadata } from 'next';
import NavbarEntrenador from '@/components/navbar/navbarEntrenador';

export const metadata: Metadata = {
	title: 'Entrenador'
};

export default function LayoutEntrenador({
	children,
}: {
  children: React.ReactNode
}) {
	return (
		<>
			<NavbarEntrenador />
			{children}
		</>
	);
}