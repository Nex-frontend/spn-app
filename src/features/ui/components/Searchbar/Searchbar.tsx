import { useMemo, useState } from 'react';

import { Button, Kbd } from '@mantine/core';
import {
  Spotlight,
  spotlight,
} from '@mantine/spotlight';
import { IconConcept, IconHome, IconSearch } from '../Icons';
import { AppSpotlightLink } from '../AppLink';
import { EmptySearch } from './EmptySearch';

interface Action {
  id: string;
  label: string;
  description: string;
  to: string;
  leftSection: React.ReactNode;
  group: string;
}

const actions: Action[] = [
  {
    id: 'home',
    label: 'Dashboard',
    description: 'Ver informacion completa acerca del estado actual del sistema',
    to: '/',
    leftSection: <IconHome size={24} stroke={1.5} />,
    group: 'home',
  },
  {
    id: 'refund',
    label: 'Reintegros',
    description: 'Ver el estado de los reintegros (concepto 19)',
    to: '/refund',
    leftSection: <IconConcept size={24} stroke={1.5} />,
    group: 'conceptos'
  },
  {
    id: 'forte',
    label: 'Forte',
    description: 'Ver el estado del forte (concepto 21)',
    to: '/forte',
    leftSection: <IconConcept size={24} stroke={1.5} />,
    group: 'conceptos'
  },
];

export function Searchbar() {

  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const itemsObject = actions
    .filter((item) => {
      return item.label?.toLowerCase().includes(query.toLowerCase().trim())
        || item.description?.toLowerCase().includes(query.toLowerCase().trim());
    })
    .slice(0, 5)
    .reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    }, {} as Record<string, Action[]>)
    

    return Object.keys(itemsObject).map((item) => <Spotlight.ActionsGroup key={item}
      label={item.trim().toUpperCase()}>{itemsObject[item].map((action) => <AppSpotlightLink 
          key={action.id} 
          label={action.label} 
          description={action.description} 
          leftSection={action.leftSection} 
          highlightQuery 
          to={action.to}
        />)}</Spotlight.ActionsGroup>)
  }, [query]);

  

  return (
    <>
      <Button
        variant="default"
        visibleFrom='sm'
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
      <Button 
        variant="default"
        onClick={spotlight.open}
        hiddenFrom="sm"
      >
        <IconSearch size={14} stroke={1.5} />
      </Button>
      <Spotlight.Root query={query} onQueryChange={setQuery}>
        <Spotlight.Search placeholder="Buscar..." leftSection={<IconSearch stroke={1.5} />}   rightSection={
          <Kbd size="xs" mr="4">
            esc
          </Kbd>
        }/>
        <Spotlight.ActionsList >
          {items.length > 0 ? items : <Spotlight.Empty><EmptySearch query={query}/></Spotlight.Empty>}
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
}


