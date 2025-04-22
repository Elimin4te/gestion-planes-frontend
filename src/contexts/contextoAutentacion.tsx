import { createContext, useContext, ReactElement } from 'react';
import Cookies from 'js-cookie';

export type Docente = {
    nombre: string
    apellido: string
    cedula: number
    correo: string
}

export type ContextoAutenticacion = {
    docente: Docente | null,
    setDocente: (value: Docente | null) => void
}

const contextoAutenticacion = createContext<ContextoAutenticacion>({
    docente: null, setDocente: (value: Docente | null) => value
})

// Create a provider component
export const AutenticacionProvider = (props: { children?: ReactElement }) => {

    const { children } = props
    let cookie_docente_autenticado = Cookies.get('docente_autenticado')
    let docente: Docente | null = cookie_docente_autenticado?JSON.parse(cookie_docente_autenticado):null
    let setDocente = (value: Docente | null) => {
        if (value === null) { Cookies.remove('docente_autenticado') }
        else { Cookies.set('docente_autenticado', JSON.stringify(value)) }
    }

    const valorContexto = { docente, setDocente };

    return (
        <contextoAutenticacion.Provider value={valorContexto}>
            {children}
        </contextoAutenticacion.Provider>
    );
};

// Create a custom hook to use the context
export const useContextoAutenticacion = () => useContext(contextoAutenticacion);