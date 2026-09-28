// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'phpseclib',
  tagline: 'PHP Secure Communications Library',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://phpseclib.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'phpseclib', // Usually your GitHub org/user name.
  projectName: 'phpseclib.github.io', // Usually your repo name.
  deploymentBranch: 'master',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    mdx1Compat: {
      comments: true,
      admonitions: false,
      headingIds: false,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          includeCurrentVersion: false,
          lastVersion: '4.0',
          versions: {
            '4.0': { label: '4.0', banner: 'none' },
            '3.0': { label: '3.0', banner: 'unmaintained' },
          },
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeKatex],
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/phpseclib/phpseclib.github.io/tree/source/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/phpseclib/phpseclib.github.io/tree/source/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-7M7XG2FC7M',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          { from: '/docs/connect', to: '/docs/3.0/ssh2/connect' },
          { from: '/docs/auth', to: '/docs/3.0/ssh2/auth' },
          { from: '/docs/commands', to: '/docs/3.0/ssh2/commands' },
          { from: '/docs/special-chars', to: '/docs/3.0/ssh2/special-chars' },
          { from: '/docs/sftp', to: '/docs/3.0/ssh2/sftp' },
          { from: '/docs/diagnosis', to: '/docs/3.0/ssh2/diagnosis' },
          { from: '/docs/publickeys', to: '/docs/3.0/publickeys/overview' },
          { from: '/docs/rsa', to: '/docs/3.0/publickeys/rsa' },
          { from: '/docs/dsa', to: '/docs/3.0/publickeys/dsa' },
          { from: '/docs/ec', to: '/docs/3.0/publickeys/ec' },
          { from: '/docs/dh', to: '/docs/3.0/publickeys/dh' },
          { from: '/docs/jwt', to: '/docs/3.0/publickeys/jwt' },
          { from: '/docs/rsa-keys', to: '/docs/3.0/publickeys/rsa-keys' },
          { from: '/docs/dsa-keys', to: '/docs/3.0/publickeys/dsa-keys' },
          { from: '/docs/ec-keys', to: '/docs/3.0/publickeys/ec-keys' },
          { from: '/docs/symmetric', to: '/docs/3.0/symmetric/overview' },
          { from: '/docs/x509', to: '/docs/3.0/file/x509' },
          { from: '/docs/csr', to: '/docs/3.0/file/csr' },
          { from: '/docs/spkac', to: '/docs/3.0/file/spkac' },
          { from: '/docs/crl', to: '/docs/3.0/file/crl' },
          { from: '/docs/interop', to: '/docs/3.0/interop/overview' },
          { from: '/docs/python', to: '/docs/3.0/interop/python' },
          { from: '/docs/java', to: '/docs/3.0/interop/java' },
          { from: '/docs/javascript', to: '/docs/3.0/interop/javascript' },
          { from: '/docs/nodejs', to: '/docs/3.0/interop/nodejs' },
          { from: '/docs/go', to: '/docs/3.0/interop/go' },
          { from: '/docs/ruby', to: '/docs/3.0/interop/ruby' },
          { from: '/docs/csharp', to: '/docs/3.0/interop/csharp' },
          { from: '/docs/c', to: '/docs/3.0/interop/c' },
          { from: '/docs/php', to: '/docs/3.0/interop/php' },
        ],
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/phpseclib-social-card.jpg',

      algolia: {
        appId: '9JAHOV00P8',
        apiKey: 'd88000c9cf09fd7067f2db65c22d7c87',
        indexName: 'phpseclib',
        contextualSearch: true,
        searchParameters: {},
      },

      navbar: {
        title: 'phpseclib',
        logo: {
          alt: 'phpseclib',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: 'Docs',
          },
          {
            to: 'blog',
            label: 'Blog',
            position: 'right'
          },
          {
            href: 'https://github.com/phpseclib/llm-resources',
            label: 'LLM Resources',
            position: 'right',
          },
          {
            href: 'https://stackoverflow.com/questions/tagged/phpseclib',
            label: 'Support',
            position: 'right',
          },
          {
            href: 'https://github.com/phpseclib/phpseclib',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right'
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro/why',
              },
              {
                label: 'SSH / SFTP',
                to: '/docs/ssh2/connect',
              },
              {
                label: 'Public Key Crypto',
                to: '/docs/publickeys/overview',
              },
              {
                label: 'Symmetric Key Crypto',
                to: '/docs/symmetric/overview',
              },
              {
                label: 'X509 / PFX / CMS / etc',
                to: '/docs/file/x509',
              },
              {
                label: 'Interoperability',
                to: '/docs/interop/overview',
              },
            ],
          },
          {
            title: 'Support',
            items: [
              {
                label: 'Docs (1.0 / 2.0)',
                href: 'https://phpseclib.sourceforge.net/',
              },
              {
                label: 'LLM Resources (4.0)',
                href: 'https://github.com/phpseclib/llm-resources',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/phpseclib',
              },
              {
                label: 'GitHub Issues',
                href: 'https://github.com/phpseclib/phpseclib/issues',
              },
            ],
          },
          {
            title: 'Sponsor',
            items: [
              {
                label: 'Patreon',
                href: 'https://patreon.com/phpseclib',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/sponsors/terrafrost',
              },
              {
                label: 'PayPal',
                href: 'https://sourceforge.net/donate/index.php?group_id=198487',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Jim Wigginton. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['php', 'bash', 'java'],
      },
    }),
};

export default config;
