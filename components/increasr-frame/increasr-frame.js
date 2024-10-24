/*
Copyright (c) cuebitt 2024.

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

/**
 * @class IncreasrFrame
 * @extends HTMLElement
 * @description Custom element for rendering the Increasr badge
 * @property {string} siteKey - The site key for the Increasr badge
 * @example
 * <increasr-frame site-key="changeme"></increasr-frame>
 */
class IncreasrFrame extends HTMLElement {
	/**
	 * @constructor
	 * @description Creates an instance of IncreasrFrame
	 * @returns {void}
	 */
	constructor() {
		super();

		// used for rendering the component
		this._template = null;
		this._element = null;
		// this._css = null;
		this._connected = false;

		// props from attributes
		this.siteKey = null;

		this.attachShadow({ mode: "open" });
	}

	/**
	 * @description Lifecycle method called when the component is connected to the DOM.
	 * Initializes the HTML template, sets the props from attributes, and renders the component.
	 */
	connectedCallback() {
		// Create component template
		this._template = document.createElement("template");
		this._template.innerHTML = IncreasrFrame.template();

		// Init props from attributes
		this.siteKey = this.getAttribute("site-key") || "changeme";

		// Render the component
		this.render();

		this._connected = true;
	}

	/**
	 * @description The observed attributes of the component.
	 * @returns {string[]} The attributes to observe.
	 */
	static get observedAttributes() {
		return ["site-key"];
	}

	/**
	 * @description Lifecycle method called when an attribute is changed.
	 * Updates the component's props and re-renders the component.
	 * @param {string} name
	 * @param {any} oldVal
	 * @param {any} newVal
	 * @returns
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue || !this._connected) return;

		switch (name) {
			case "site-key":
				this.siteKey = newValue;
				break;
			default:
				return;
		}

		// Re-render the component
		this.render();
	}

	/**
	 * @description The HTML template for the component.
	 * @returns {string} The HTML template for the component.
	 */
	static template() {
		return /* html */ `
    <iframe
        id="increasr-frame-inner"
        src="//incr.easrng.net/badge?key=changeme"
        style="background: url(//incr.easrng.net/bg.gif)"
        title="increment badge"
        width="88"
        height="31"
        frameborder="0"
      ></iframe>
    `;
	}

	/**
	 * Renders the component
	 * @returns {void}
	 */
	render() {
		// Clear the shadow DOM and render the component
		this.shadowRoot.innerHTML = "";
		this.shadowRoot.appendChild(this._template.content.cloneNode(true));

		// Update reference to DOM element
		this._element = this.shadowRoot.getElementById("increasr-frame-inner");

		// Set the src attribute
		this._element.src = `//incr.easrng.net/badge?key=${this.siteKey}`;
	}
}

// Register the custom element unless one with the same already exists
if (!customElements.get("increasr-frame")) {
	customElements.define("increasr-frame", IncreasrFrame);
}
