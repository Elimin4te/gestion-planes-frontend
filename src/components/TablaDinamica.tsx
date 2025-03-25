import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Icon
} from '@chakra-ui/react';

import { AiFillEdit, AiFillDelete } from 'react-icons/ai';

import _ from 'lodash'

const TablaDinamica = (props: { encabezado: string[], datos: object[] }) => {
    let { encabezado, datos } = props
    return (
        <TableContainer w='100%'>
            <Table variant="simple">
                <Thead textAlign='center'>
                    <Tr>
                        {encabezado.map((header) => (
                            <Th key={header}>{_.startCase(header)}</Th>
                        ))}
                        <Th colSpan={1} textAlign='center'>Editar</Th>
                        <Th colSpan={1} textAlign='center'>Eliminar</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {datos.map((dato, idx) => (
                        <Tr key={idx}>
                            {encabezado.map((header) => (
                                <Td key={`${idx}-${header}`}>{dato[header]}</Td>
                            ))}
                            <Td><Icon w='100%' color='yellow.500' as={AiFillEdit}/></Td>
                            <Td><Icon w='100%' color='red.500' as={AiFillDelete}/></Td>
                        </Tr>
                    ))}

                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default TablaDinamica;