import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { urlInicial, urlLogin, urlPlanesEvaluacion } from '@src/constants'
import { ReactElement } from 'react'

import { useContextoAutenticacion } from '@src/contexts/contextoAutentacion'

import Login from '@src/pages/autenticacion/login'
import Navegacion from '@src/pages/layout/layoutNavegacion'

import GestionPlanesAprendizaje from '@src/pages/planes/aprendizaje/gestionPlanAprendizaje'
import GestionPlanesDeEvaluacion from '@src/pages/planes/evaluacion/gestionPlanEvaluacion'

export const RutaProtegida = (props: {children?: ReactElement}) => {
    const { children } = props
    let { docente } = useContextoAutenticacion()
    return ( docente ? children: <Navigate to={urlLogin}/> )
}

const router = createBrowserRouter([
    {
        path: urlInicial,
        element: (
            <RutaProtegida>
                <Navegacion title='Planes de Aprendizaje'>
                    <GestionPlanesAprendizaje/>
                </Navegacion>
            </RutaProtegida>
        )
    },
    {
        path: urlPlanesEvaluacion,
        element: (
            <RutaProtegida>
                <Navegacion title='Planes de Evaluación'>
                    <GestionPlanesDeEvaluacion/>
                </Navegacion>
            </RutaProtegida>
        )
    },
    {
        path: urlLogin,
        element: <Login />
    },
    // URL por defecto para evitar 404
    {
        path: '*',
        element: <Navigate to={urlLogin} />
    }
])

export default function Router () {
    return <RouterProvider router={router} />
}
