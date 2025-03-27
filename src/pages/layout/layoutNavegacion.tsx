import { Box, Drawer, DrawerContent, Flex, HStack, Heading, IconButton, List, ListIcon, ListItem, Text, useBreakpointValue, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { BiMenu } from 'react-icons/bi'
import { AiOutlineBook, AiOutlinePercentage, AiOutlineUser, AiOutlineClose, AiOutlinePoweroff } from 'react-icons/ai'

import { Head } from "@src/components"
import { nombreProyecto, urlLogin, urlInicial, urlPlanesEvaluacion } from "@src/constants"

import { Link, useNavigate } from 'react-router-dom'
import { ReactElement } from 'react'

import { logout } from '@src/api/autenticacionDocente'
import { useContextoAutenticacion, Docente } from '@src/contexts/contextoAutentacion'


type ItemDeLista = {
    texto: string
    icono: React.ElementType
    link: string
}

const listaDeItems: ItemDeLista[] = [
    {
        texto: 'Aprendizaje',
        icono: AiOutlineBook,
        link: urlInicial
    },
    {
        texto: 'Evaluación',
        icono: AiOutlinePercentage,
        link: urlPlanesEvaluacion
    }
]

import React, { useState, useRef } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';

const IconoUsuario = ( props: {infoUsuario: Docente} ) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const { infoUsuario } = props

    const userIconRef = useRef(null);
  
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

  
    return (
      <Popover
        isOpen={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        placement="bottom-end" // Adjust placement as needed
        closeOnBlur={true}
      >
        <PopoverTrigger>
        <IconButton isRound={true} size="lg" aria-label='user icon' icon={<AiOutlineUser />} ref={userIconRef} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">{infoUsuario.nombre} {infoUsuario.apellido}</Text>
              <Text>{infoUsuario.cedula}</Text>
              <Text>{infoUsuario.correo}</Text>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }

export default function Navegacion(props: {title: string, children?: ReactElement}) {

    const { children, title } = props
    const { getButtonProps, isOpen, onClose } = useDisclosure()

    const buttonProps = getButtonProps()
    const navigate = useNavigate()
    const { docente, setDocente } = useContextoAutenticacion()

    const cerrarSesion = () => {
        logout()
        setDocente(null)
        navigate(urlLogin)
    } 

    const currentsBreakpoint = useBreakpointValue({ lg: 'lg' }, { ssr: false })
    if (currentsBreakpoint === "lg" && isOpen) {
        onClose()
    }

    return (
        <>
            <Head>
                <title>{title} | {nombreProyecto}</title>
            </Head>
            <Flex as="nav" alignItems="center" justifyContent={{ base: 'space-between', lg: 'flex-end' }} h='10vh' p='2.5'>
                <Heading w='80%' textAlign='center' as='h4'>{title}</Heading>
                <HStack spacing={2} display={{ base: 'flex', lg: 'none' }}>
                    <IconButton {...buttonProps} fontSize="18px" variant='ghost' icon={<BiMenu />} aria-label='open menu' />
                    <Heading as='h1' size="md" textAlign="center" w='100%'>{nombreProyecto}</Heading>
                </HStack>
                <HStack spacing="1">
                    <IconoUsuario infoUsuario={docente} />
                    <IconButton variant="ghost" isRound={true} size="lg" aria-label='icono logout' icon={<AiOutlinePoweroff />} onClick={() => cerrarSesion()}/>
                </HStack>
            </Flex>
            <HStack align="start" spacing={0}>
                <Aside onClose={onClose} display={{ base: 'none', lg: 'block' }} />
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="xs"
                >
                    <DrawerContent>
                        <Aside onClose={onClose} isOpen={isOpen} />
                    </DrawerContent>
                </Drawer>
                <Flex as="main" ml={{ base: 0, lg: '60' }} w='full' minH="90vh" p={5} bg={useColorModeValue('gray.50', 'gray.900')}>
                    {children}
                </Flex>
            </HStack>
        </>
    )
}

type AsideProps = {
    display?: {
        base: string
        lg: string
    }
    onClose: () => void
    isOpen?: boolean
}

const Aside = ({ onClose, isOpen, ...rest }: AsideProps) => {
    return (
        <Box
            as="aside"
            borderRight="2px"
            borderColor={useColorModeValue('gray.200', 'gray.900')}
            w={{ base: '100%', lg: 60 }}
            top="0"
            pos="fixed"
            h="100%"
            minH="100vh"
            zIndex={99}
            {...rest}
        >
            <HStack p="2.5" h='10vh' justify="space-between">
                <Heading as='h1' size="md" w='100%' textAlign='center'>{nombreProyecto}</Heading>
                <IconButton onClick={onClose} display={isOpen ? 'flex' : 'none'} fontSize="18px" variant='ghost' icon={<AiOutlineClose />} aria-label='open menu' />
            </HStack>
            <Box>
                <List spacing={1} p="0.5">
                    {
                        listaDeItems.map(item => (<ElementoDeLista icono={item.icono} texto={item.texto} link={item.link} key={item.texto}/>))
                    }
                </List>
            </Box>
        </Box>
    )
}

const ElementoDeLista = ({ icono, texto, link }: ItemDeLista) => {
    return (
        <Link to={link}>
            <ListItem as={HStack} spacing={0} h="10" pl="2.5" cursor="pointer" _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }} rounded="md">
                <ListIcon boxSize={5} as={icono} />
                {
                    texto && <Text>{texto}</Text>
                }
            </ListItem>
        </Link>
    )
}
