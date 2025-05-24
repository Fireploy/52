import type { Metadata } from 'next';
import NavbarDeportista from '@/components/navbar/navbarDeportista';

export const metadata: Metadata = {
	title: 'Deportista'
};

export default function LayoutDeportista({
	children,
}: {
  children: React.ReactNode
}) {
	return (
		<>
			<NavbarDeportista />
			{children}
		</>
	);
}