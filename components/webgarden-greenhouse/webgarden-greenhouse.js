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
 * @class WebgardenGreenhouse
 * @extends HTMLElement
 * @description Custom element for rendering a greenhouse of Webgarden plants
 * @property {string[]} plants - The list of web garden URLs or Neocities IDs
 * @example
 * <webgarden-greenhouse plants="neocities,neocities,neocities"></webgarden-greenhouse>
 */
class WebgardenGreenhouse extends HTMLElement {
	/**
	 * @constructor
	 * @description Creates an instance of WebgardenGreenhouse
	 * @returns {void}
	 */
	constructor() {
		super();

		this._template = null;
		this._css = null;
		this._element = null;
		this._connected = false;

		this._plants = [];

		this.attachShadow({ mode: "open" });
	}

	/**
	 * @description The observed attributes of the component.
	 * @returns {string[]} The attributes to observe.
	 */
	static get observedAttributes() {
		return ["plants"];
	}

	/**
	 * @description Lifecycle method called when the component is connected to the DOM.
	 * Initializes the HTML template, sets the props from attributes, and renders the component.
	 */
	connectedCallback() {
		// Create CSS stylesheet
		this._css = new CSSStyleSheet();
		this._css.replaceSync(WebgardenGreenhouse.css());

		// Create component template
		this._template = {
			greenhouse: document.createElement("template"),
			row: document.createElement("template"),
			rowItem: document.createElement("template"),
		};
		this._template.greenhouse.innerHTML =
			WebgardenGreenhouse.template().greenhouse;
		this._template.row.innerHTML = WebgardenGreenhouse.template().row;
		this._template.rowItem.innerHTML = WebgardenGreenhouse.template().rowItem;

		// Attach the CSS to the shadow DOM
		this.shadowRoot.adoptedStyleSheets = [this._css];

		// Init props from attributes
		this._plants = this.hasAttribute("plants")
			? this.getAttribute("plants").split(",")
			: [];

		// Render the component
		this.render();

		// Component is now connected
		this._connected = true;
	}

	/**
	 * @description Lifecycle method called when an attribute is changed.
	 * Updates the component's props and re-renders the component.
	 * @param {string} name The name of the attribute that changed
	 * @param {string} oldVal The old value of the attribute
	 * @param {string} newVal The new value of the attribute
	 * @returns {void}
	 */
	attributeChangedCallback(name, oldVal, newVal) {
		if (!this._connected || oldVal === newVal) return;

		switch (name) {
			case "plants":
				this._plants = newVal.split(",");
				break;
			default:
				return;
		}

		this.render();
	}

	/**
	 * @description Renders the component with the current props
	 * @returns {void}
	 */
	render() {
		// Clear the shadow DOM and add clone the element
		this.shadowRoot.innerHTML = "";
		this.shadowRoot.appendChild(
			this._template.greenhouse.content.cloneNode(true),
		);

		// Update greenhouse element reference
		this._element = this.shadowRoot.getElementById("greenhouse");

		// Skip rendering if there are no pots to render
		if (this._plants.size === 0) return;

		// Split the array into chunks of 3 to separate the shelves
		const rowChunks = this.chunk(this._plants, 3);

		// Generate the rows
		const rows = rowChunks.map((rowChunk) => {
			const rowItems = rowChunk.map((plant) => {
				const shelfItem = document.createElement("iframe");
				shelfItem.height = shelfItem.width = "250px";
				shelfItem.loading = "lazy";
				shelfItem.scrolling = "no";

				// Use a URL if provided, otherwise use a Neocities ID
				shelfItem.src = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i.test(plant)
					? plant
					: `https://${plant}.neocities.org/webgarden.html`;

				return shelfItem;
			});

			const row = this._template.row.content.cloneNode(true);
			const rowShelf = row.getElementById("row-shelf");
			for (const rowItem in rowItems) {
				rowShelf.appendChild(rowItem);
			}

			return row;
		});

		// Add the rows to the shelves
		for (const row in rows) {
			this._element.appendChild(row);
		}
	}

	/**
	 * @description The HTML template for the component.
	 * @returns {string} The HTML template for the component.
	 */
	static template() {
		return {
			greenhouse: /* html */ `
      <div id="greenhouse"></div>
    `,
			row: /* html */ `
    <div class="stuffonshelf" id="row-shelf"></div>
        <img class="shelf" />
    `,
			rowItem: /* html */ `<iframe
          height="250px"
          width="250px"
          loading="lazy"
          scrolling="no"
        ></iframe>`,
		};
	}

	/**
	 * @description The CSS for the component.
	 * @returns {string} The CSS for the component.
	 */
	static css() {
		// shelves.css by missmoss.neocities.org
		return /* css */ `
      .shelf {
        display: block;
        z-index: 9;
        content: url("https://files.catbox.moe/s1apr5.png");
        position: relative;
        width: 941px;
        height: 175px;
        margin-left: auto;
        margin-right: auto;
      }

      .stuffonshelf {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        position: relative;
        z-index: 10;
        margin-bottom: -80px;
        width: 770px;
        margin-left: auto;
        margin-right: auto;
      }
    `;
	}

	/**
	 * @description Splits an array into chunks of a specified size.
	 *
	 * https://youmightnotneed.com/lodash/#chunk
	 *
	 * @param {any[]} arr
	 * @param {number} chunkSize
	 * @param {any[]} cache
	 * @returns {any[any[any]]} The array split into chunks
	 */
	chunk(arr, chunkSize = 1, cache = []) {
		const tmp = [...arr];
		if (chunkSize <= 0) return cache;
		while (tmp.length) cache.push(tmp.splice(0, chunkSize));
		return cache;
	}
}

// Register the custom element unless one with the same name already exists
if (!customElements.get("webgarden-greenhouse")) {
	customElements.define("webgarden-greenhouse", WebgardenGreenhouse);
}
