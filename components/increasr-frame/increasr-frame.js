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

        <increasr-frame sitekey="yourSitekeyHere"></increasr-frame>
*/

// HTML Template
const template = document.createElement("template");
template.innerHTML = `
<iframe id="inner-frame" src="//incr.easrng.net/badge?key=changeme" style="background: url(//incr.easrng.net/bg.gif)" title="increment badge" width="88" height="31" frameborder="0"></iframe>
`;

// iframe src helper fn
const srcUrl = (key) => `//incr.easrng.net/badge?key=${key}`;

// increasr-frame Web Component
class IncreasrFrame extends HTMLElement {
  constructor() {
    super();
    this._connected = false;

    this.sitekey = "changeme";

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._connected = true;
    const sitekey = this.getAttribute("sitekey");
    if (sitekey !== null) {
      this.shadowRoot
        .getElementById("inner-frame")
        .setAttribute("src", srcUrl(sitekey));
    }
  }

  static get observedAttributes() {
    return ["sitekey"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._connected) return;

    if (name === "sitekey") {
      this.shadowRoot
        .getElementById("inner-frame")
        .setAttribute("src", srcUrl(newValue));
    }
  }
}

customElements.define("increasr-frame", IncreasrFrame);
