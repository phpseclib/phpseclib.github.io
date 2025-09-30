// src/components/SpecialThanks/index.tsx
import React from 'react';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import styles from './styles.module.css';

const sponsors = [
  {
    url: 'https://www.sovereign.tech/tech/phpseclib',
    logoLight: '/img/sponsors/sovereign-tech-agency.svg',
    logoDark: '/img/sponsors/sovereign-tech-agency-dark.svg',
  },
];

export default function SpecialThanks() {
  const {colorMode} = useColorMode();

  return (
    <section className={styles.wrap} aria-labelledby="special-thanks">
      <div className={styles.inner}>
        <h2 id="special-thanks" className={styles.title}>
          Special Thanks
        </h2>

        <ul className={styles.grid}>
          {sponsors.map((s) => {
            const logo = colorMode === 'dark' ? s.logoDark : s.logoLight;
            return (
              <li key={s.name} className={styles.item}>
                <Link href={s.url} className={styles.card}>
                  <img src={logo} alt={s.name} className={styles.logo} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
