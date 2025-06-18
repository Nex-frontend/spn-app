import { memo, useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Collapse, Group, UnstyledButton } from '@mantine/core';
import { AppLink } from '../AppLink/AppLink';
import { LinkSingle } from './LinkSingle';
import { LinkWrapper } from './LinkWrapper';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  link?: string;
  matchRoute?: string;
  links?: { label: string; link: string }[];
}

export const LinksGroup = memo(function LinksGroup({
  icon,
  label,
  initiallyOpened,
  links,
  link,
  matchRoute,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <AppLink
      className="menu-link"
      to={link.link}
      key={link.label}
      underline="never"
      activeProps={{
        style: {
          fontWeight: 'bold',
        },
      }}
    >
      {link.label}
    </AppLink>
  ));

  return (
    <LinkWrapper link={link} matchRoute={matchRoute}>
      {({ isActive }) => (
        <>
          <>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={'control'}>
              <Group justify="space-between" gap={0}>
                <LinkSingle icon={icon} label={label} className={isActive ? 'font-bold' : ''} />
                {hasLinks && (
                  <IconChevronRight
                    className={'chevron'}
                    stroke={1.5}
                    style={{
                      transform: opened ? 'rotate(-90deg)' : 'none',
                    }}
                  />
                )}
              </Group>
            </UnstyledButton>
          </>
          {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
      )}
    </LinkWrapper>
  );
});
