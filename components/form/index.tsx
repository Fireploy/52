// Importaciones de módulos y estilos
'use client';

import { createContext, useState } from 'react';
import styles from './styles.module.scss';
import {
	Footer,
	Input,
	SubmitButton
} from './components';

// Definición de tipos y interfaces
type FormValues = Record<string, string>;

interface FormContextType {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

interface FormProps {
  title1: string;
  title2: string;
  title3: string;
  description?: string;
  className: string
  onSubmit: (values: FormValues) => void;
  children: React.ReactNode;
}

// Creación de un contexto para compartir datos entre componentes
export const FormContext = createContext<FormContextType | undefined>(undefined);

// Definición del componente principal "Form"
export function Form({ title1, title2, title3, children, onSubmit, description, className }: FormProps) {
	// Estado local para almacenar los valores del formulario
	const [formValues, setFormValues] = useState<FormValues>({});

	// Función para manejar el envío del formulario
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onSubmit(formValues);
	};

	// Renderización del componente
	return (
		<FormContext.Provider value={{ formValues, setFormValues }}>
			<form className={styles.form + ' ' + className} onSubmit={handleSubmit}>
				<div className={styles.descriptionContainer}>
					<h2>{title1}</h2>
					<h2>{title2}</h2>
					<h2>{title3}</h2>
					<h2>{description && <p>{description}</p>}</h2>
				</div>
				{children}
			</form>
		</FormContext.Provider>
	);
}

// Asignación de un componente Input al componente Form para su reutilización
Form.Input = Input;
Form.Footer = Footer;
Form.SubmitButton = SubmitButton;
