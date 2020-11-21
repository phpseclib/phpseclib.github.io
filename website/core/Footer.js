/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('why', this.props.language)}>
              Introduction
            </a>
            <a href={this.docUrl('connect', this.props.language)}>
              SSH2 / SFTP
            </a>
            <a href={this.docUrl('publickeys', this.props.language)}>
              Public Key Crypto
            </a>
            <a href={this.docUrl('symmetric', this.props.language)}>
              Symmetric Key Crypto
            </a>
            <a href={this.docUrl('x509', this.props.language)}>
              X.509 / CSR / SPKAC / CRL
            </a>
          </div>
          <div>
            <h5>Support</h5>
            <a
              href="https://stackoverflow.com/questions/tagged/phpseclib"
              target="_blank"
              rel="noreferrer noopener">
              Stack Overflow
            </a>
            <a href="https://github.com/phpseclib/phpseclib">GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
          <div>
            <h5>Sponsor</h5>
            <a
              href="https://patreon.com/phpseclib"
              target="_blank"
              rel="noreferrer noopener">
              Patreon
            </a>
            <a
              href="https://github.com/sponsors/terrafrost"
              target="_blank"
              rel="noreferrer noopener">
              GitHub
            </a>
            <a
              href="https://sourceforge.net/donate/index.php?group_id=198487"
              target="_blank"
              rel="noreferrer noopener">
              PayPal
            </a>
          </div>
        </section>

        <a
          href="https://opensource.facebook.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/oss_logo.png`}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
