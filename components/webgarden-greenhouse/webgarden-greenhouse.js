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
    Webgarden Greenhouse Web Component
    by cuebitt

    Renders a "Webgarden Greenhouse" (see: https://wiki.melonland.net/web_gardens).
    Uses "shelves.css" by MissMoss.

    USAGE:

    1. Insert the following into the head of your HTML document:

        <script type="module" src="webgarden-greenhouse.js"></script>

        (replace webgarden-greenhouse.js.js with the path or URL to this script)

    2. Use the webgarden-greenhouse.js component anywhere in the page:

        <webgarden-greenhouse.js plants="replace,with,plants"></iwebgarden-greenhouse.js>

        (fill in the plants attribute with a comma separated list containing either a neocities id
        [ex. cuebitt] or a URL to a Webgarden pot [ex https://cuebitt.neocities.org/webgarden.html].)
*/

const template = document.createElement("template");
template.innerHTML = `

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

// template used to render the rows
const rowTemplate = document.createElement("template");
rowTemplate.innerHTML = `
<div class="stuffonshelf" id="row-shelf">
</div>
<img class="shelf">
`;

class WebgardenGreenhouse extends HTMLElement {
  constructor() {
    super();
    this._connected = false;
    this._greenhouse = null;

    this.plants = [];

    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["plants"];
  }

  connectedCallback() {
    // Init props from attributes
    const _plantsAttr = this.getAttribute("plants");
    this.plants = _plantsAttr ? _plantsAttr.split(",") : [];

    // Render the component
    this.render();

    // Add the component to the Shadow DOM
    this.shadowRoot.appendChild(greenhouse_gardens);
    this._connected = true;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    console.log(`${name}: ${oldVal} -> ${newVal}`);
    switch (name) {
      case "plants":
        console.log("Re-rendering greenhouse...");
        this.plants = newVal.split(",");
        this.renderGreenhouse();
        break;
    }
  }

  renderRows() {
    if (this.plants.size === 0) return;

    const rowChunks = chunk(this.plants, 3);

    const rows = rowChunks.map((rowChunk) => {
      const rowItems = rowChunk.map((plant) => {
        const shelfItem = document.createElement("iframe");
        shelfItem.height = "250px";
        shelfItem.width = "250px";
        shelfItem.scrolling = "no";
        shelfItem.loading = "lazy";
        shelfItem.frameBorder = "no";
        shelfItem.src = plant.includes(".")
          ? plant
          : `https://${plant}.neocities.org/webgarden.html`;

        return shelfItem;
      });

      const row = rowTemplate.content.cloneNode(true);
      const rowShelf = row.getElementById("row-shelf");
      rowItems.forEach((rowItem) => {
        rowShelf.appendChild(rowItem);
      });

      return row;
    });

    return rows;
  }

  renderGreenhouse() {
    this._greenhouse.textContent = ""; // clear all the rows

    const greenhouse_rows = this.renderRows();
    greenhouse_rows.forEach((greenhouse_row) => {
      this._greenhouse.appendChild(greenhouse_row);
    });
  }

  render() {
    // Add the top-level div only once when connecting
    if (!this._connected) {
      const greenhouse_gardens = template.content.cloneNode(true);
      this._greenhouse = greenhouse_gardens.getElementById("greenhouse");
    }

    // Render the greenhouse
    this.renderGreenhouse();
  }
}

// https://youmightnotneed.com/lodash/#chunk
const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

window.customElements.define("webgarden-greenhouse", WebgardenGreenhouse);
