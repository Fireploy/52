import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/footer';
import dotenv from 'dotenv';
dotenv.config();

export const metadata: Metadata = {
	title: 'Home',
};

export default function RootLayout({
	children,
}: {
  children: React.ReactNode;
}) {
	return (
		<html lang="es">
			<body className="flex flex-col min-h-screen">
				<div id="content-container" className="flex-grow">
					{children}
				</div>
				<Footer />
			</body>
		</html>
	);
}