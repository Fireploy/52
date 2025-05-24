'use client';

import React, { useContext } from 'react';
import styles from './styles.module.scss';
import { FormContext } from '..';

// Define una interfaz para las propiedades que puede recibir el componente Input.
interface InputProps {
    type?: 'text' | 'password'; // Tipo opcional que puede ser 'text' o 'password'
    name: string; // Nombre del campo de entrada
    label: string; // Etiqueta del campo de entrada
    placeholder?: string; // Texto de marcador de posición opcional
	value: string;
	className?: string;
	onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Define el componente funcional Input que acepta las propiedades definidas en InputProps.
export function Input({ label, name, placeholder, type, value, onChange, className }: InputProps) {

	// Retorna la estructura del componente Input.
	return (
		<div className={styles.inputContainer + ' ' + className}>
			{/* Etiqueta del campo de entrada */}
			<label className={styles.label} htmlFor={name}>
				{label}
			</label>
			{/* Campo de entrada */}
			<input
				required
				type={type}
				id={name}
				name={name}
				// Valor del campo de entrada tomado del estado del formulario o cadena vacía si no existe.
				value={value || ''}
				// Función que se ejecuta cuando el valor del campo de entrada cambia.
				onChange={onChange}
				// Texto de marcador de posición opcional.
				placeholder={placeholder}
			/>
		</div>
	);
}
