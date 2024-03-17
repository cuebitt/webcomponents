/*
Copyright (c) cuebitt 2023.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/

/*
    incr.easrng.net Web Component
    by cuebitt

    Convenience Web Component that wraps the iframe element given by inc.easrng.net.
    Displays a counter that site visitors can increment.

    USAGE:

    1. Insert the following into the head of your HTML document:

        <script type="module" src="increasr-frame.js"></script>

        (replace increasr-frame.js with the path or URL to this script)

    2. Use the increasr-frame component anywhere in the page:

        <increasr-frame site-key="yourSitekeyHere"></increasr-frame>
*/
class IncreasrFrame extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this._element = null;
    this._connected = false;
    this._siteKey = null;
  }

  connectedCallback() {
    this._siteKey = this.getAttribute("site-key") || "changeme";

    const newTemplate = document.createElement("template");
    newTemplate.innerHTML = IncreasrFrame.template();
    this.shadowRoot.appendChild(newTemplate.content.cloneNode(true));
    this._element = this.shadowRoot.getElementById("increasr-frame-inner");

    this.render();
    this._connected = true;
  }

  static get observedAttributes() {
    return ["site-key"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._connected) return;

    switch (name) {
      case "site-key":
        this._siteKey = newValue;
        this.render();
        break;
    }
  }

  static template() {
    return /* html */ `
    <iframe id="increasr-frame-inner" src="//incr.easrng.net/badge?key=changeme" style="background: url(//incr.easrng.net/bg.gif)" title="increment badge" width="88" height="31" frameborder="0"></iframe>
    `;
  }

  // since src is the only thing that changes, we don't need to re-render the component here
  render() {
    this._element.src = `//incr.easrng.net/badge?key=${this._siteKey}`;
  }
}

customElements.define("increasr-frame", IncreasrFrame);
