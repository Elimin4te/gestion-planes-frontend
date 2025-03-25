import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
    Image as Img,
    useColorModeValue,
    Container,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react'

import { Head } from '@components/index'
import { nombreProyecto, urlInicial } from '@src/constants'
import { ImagenLogin } from '@assets/images'

import { withMask } from 'use-mask-input'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useContextoAutenticacion, Docente } from '@src/contexts/contextoAutentacion'
import { login, infoDocente } from '@src/api/autenticacionDocente'
import { obtenerPrimerValor } from '@src/utils'


export default function Login() {

    const [error, setError] = useState()

    const navigate = useNavigate()
    const { docente, setDocente } = useContextoAutenticacion()

    const obtenerInfoDocente = () => {
        infoDocente().then(
            (response) => {
                let docente: Docente = response.data
                setDocente(docente)
            }
        ).catch(
            (err) => console.log("Ocurrió un error recuperando la información del docente:", err)
        )
    }
    
    const manejarLogin = (e: any) => {
        e.preventDefault()
        let cedula: string = e.target.cedula.value
        login(cedula).then(
            () => {
                obtenerInfoDocente()
                navigate(urlInicial)
            }
        ).catch(
            (err) => setError(obtenerPrimerValor(err.response.data))
        )
    }

    // Redireccion al docente si ya esta autenticado
    useEffect(() => {
        if (docente) { navigate(urlInicial) }
    }, [])

    return (
        <>
            <Head>
                <title>Login | {nombreProyecto}</title>
            </Head>
            <Container maxW='7xl' as="main">
                <Flex minH="90vh" alignItems="center">
                    <Box
                        w='50%'
                        display={{ base: 'none', lg: 'block' }}
                    >
                        <Box boxSize={{ lg: 'lg', xl: 'xl' }} mx='auto' >
                            <Img src={ImagenLogin} alt='login' />
                        </Box>
                    </Box>
                    <Box w={{ base: '100%', lg: '50%' }} bg={useColorModeValue('gray.50', 'gray.900')} h="100vh" p='16'>
                        <VStack spacing="7" justify="center" alignItems="stretch" h="full">
                            <Heading as='h1' fontSize="3xl" textAlign="center">{nombreProyecto}</Heading>
                            <VStack spacing="6" as="form" onSubmit={manejarLogin}>
                                {error && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertDescription fontSize='0.9rem'>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <FormControl>
                                    <FormLabel>Ingresa tu Cédula</FormLabel>
                                    <Input type="text" placeholder="V-XX.XXX.XXX" ref={withMask('V-99.999.999')} name='cedula' required={true} />
                                </FormControl>
                                <Button w='full' size="lg" colorScheme='blue' type='submit'>Iniciar Sesión</Button>
                            </VStack>
                        </VStack>
                    </Box>
                </Flex>
            </Container>
        </>
    )
}
