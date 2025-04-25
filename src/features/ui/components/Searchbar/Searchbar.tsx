import { Button, Input, Kbd } from '@mantine/core';
import {
  Spotlight,
  spotlight,
  SpotlightActionData,
  SpotlightActionGroupData,
} from '@mantine/spotlight';
import { IconConcept, IconHome, IconSearch } from '../Icons';

const actions: (SpotlightActionGroupData | SpotlightActionData)[] = [
  {
    group: 'Inicio',
    actions: [
      {
        id: 'home',
        label: 'Dashboard',
        description: 'Ver informacion completa acerca del estado actual del sistema',
        onClick: () => console.log('Dashboard'),
        leftSection: <IconHome size={24} stroke={1.5} />,
      },
    ],
  },
  {
    group: 'Conceptos',
    actions: [
      {
        id: 'refund',
        label: 'Reintegros',
        description: 'Ver el estado de los reintegros (concepto 19)',
        onClick: () => console.log('refund'),
        leftSection: <IconConcept size={24} stroke={1.5} />,
      },
      {
        id: 'forte',
        label: 'Forte',
        description: 'Ver el estado del forte (concepto 21)',
        onClick: () => console.log('forte'),
        leftSection: <IconConcept size={24} stroke={1.5} />,
      },
    ],
  },
];

export function Searchbar() {
  return (
    <>
      <Button
        // className="inputColor"
        variant="default"
        onClick={spotlight.open}
        leftSection={<IconSearch size={14} stroke={1.5} />}
        rightSection={
          <Kbd size="xs" mr="4">
            Ctrl + K
          </Kbd>
        }
      >
        Buscar
      </Button>
      {/* <Input
        styles={{
          input: {
            cursor: 'pointer',
            borderColor: '#424242',
          },
        }}
        readOnly
        classNames={{ input: 'inputColor' }}
        // className="inputColor"
        onClick={spotlight.open}
        placeholder="Buscar"
        leftSection={<IconSearch size={14} stroke={1.5} />}
        rightSectionWidth="all"
        rightSection={
          <Kbd size="xs" mr="4">
            Ctrl + K
          </Kbd>
        }

        // disabled
      /> */}
      <Spotlight
        actions={actions}
        nothingFound="No se encontro informacion"
        highlightQuery
        limit={20}
        maxHeight={350}
        scrollable
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: 'Buscando...',
        }}
      />
    </>
  );
}
