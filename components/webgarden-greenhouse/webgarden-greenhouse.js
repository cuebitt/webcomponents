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
class WebgardenGreenhouse extends HTMLElement {
  constructor() {
    super();
    this._connected = false;
    this._element = null;

    this._plants = [];

    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["plants"];
  }

  connectedCallback() {
    // Init props from attributes
    this._plants = this.hasAttribute("plants")
      ? this.getAttribute("plants").split(",")
      : [];

    // Add the top-level div only once when connecting
    const greenhouseGardens = document.createElement("template");
    greenhouseGardens.innerHTML = WebgardenGreenhouse.template();
    this.shadowRoot.appendChild(greenhouseGardens.content.cloneNode(true));

    this._element = this.shadowRoot.getElementById("greenhouse");

    // Render the component
    this.render();

    // Component is now connected
    this._connected = true;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    console.log(`${name}: ${oldVal} -> ${newVal}`);
    switch (name) {
      case "plants":
        console.log("Re-rendering greenhouse...");
        this._plants = newVal.split(",");
        this.render();
        break;
    }
  }

  render() {
    this._element.textContent = ""; // clear all the rows

    // Skip rendering if there are no pots to render
    if (this._plants.size === 0) return;

    // Split the array into chunks of 3 to separate the shelves
    const rowChunks = this.chunk(this._plants, 3);

    // Templates used to construct the rows
    const rowTmp = document.createElement("template");
    rowTmp.innerHTML = `
    <div class="stuffonshelf" id="row-shelf">
    </div>
    <img class="shelf">
    `;

    const rowItemTmp = document.createElement("template");
    rowItemTmp.innerHTML = `
    <iframe height = "250px" width="250px" loading="lazy" scrolling="no"></iframe>
    `;

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

      const row = rowTmp.content.cloneNode(true);
      const rowShelf = row.getElementById("row-shelf");
      rowItems.forEach((rowItem) => {
        rowShelf.appendChild(rowItem);
      });

      return row;
    });

    rows.forEach((row) => {
      this._element.appendChild(row);
    });
  }

  static template() {
    return /* html */ `

    <!-- shelves.css by missmoss.neocities.org -->
    <style>
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
    </style>
    
    <div id="greenhouse"></div>
    `;
  }

  // https://youmightnotneed.com/lodash/#chunk
  chunk(arr, chunkSize = 1, cache = []) {
    const tmp = [...arr];
    if (chunkSize <= 0) return cache;
    while (tmp.length) cache.push(tmp.splice(0, chunkSize));
    return cache;
  }
}

window.customElements.define("webgarden-greenhouse", WebgardenGreenhouse);
