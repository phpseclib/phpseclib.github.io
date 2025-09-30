import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Portability',
    Svg: require('@site/static/img/portability.svg').default,
    description: (
      <>
        phpseclib doesn't require any extensions. For <a href="/docs/intro/speed">purposes of speed</a>, OpenSSL, GMP or libsodium
        are used, if they're available, but they are not required.
      </>
    ),
  },
  {
    title: 'Interoperability',
    Svg: require('@site/static/img/interoperability.svg').default,
    description: (
      <>
        phpseclib is designed to be fully interoperable with <a href="/docs/interop/overview">standardized
        cryptography libraries</a> and protocols.
      </>
    ),
  },
  {
    title: 'Long-term support',
    Svg: require('@site/static/img/lts.svg').default,
    description: (
      <>
        Don't have PHP 8.1+? Try phpseclib 3.0 (PHP 5.6+),
        phpseclib 2.0 (PHP 5.3+) or phpseclib 1.0 (PHP 4.4+).
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
