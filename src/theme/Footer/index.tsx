// src/theme/Footer/index.tsx
import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import SpecialThanks from '@site/src/components/SpecialThanks';
import {useLocation} from '@docusaurus/router';

export default function FooterWrapper(props) {
  const {pathname} = useLocation();

  // Show on all routes except /docs/*
  const showSpecialThanks = !pathname.startsWith('/docs');

  return (
    <>
      {showSpecialThanks && <SpecialThanks />}
      <OriginalFooter {...props} />
    </>
  );
}
