import { ChakraProvider } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'
import { AutenticacionProvider } from './contexts/contextoAutentacion'

import { Font, theme } from '@theme/config'
import Router from '@routes/index'

export default function App() {

    return (
        <AutenticacionProvider>
            <HelmetProvider>
                <ChakraProvider theme={theme}>
                    <Font />
                    <Router />
                </ChakraProvider>
            </HelmetProvider>
        </AutenticacionProvider>
    )
}
