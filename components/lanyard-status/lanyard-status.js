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
 * @class LanyardStatus
 * @extends HTMLElement
 * @description A custom element to display a user's Discord status using Lanyard's API.
 * @property {string} userId - The Discord user ID to fetch the status of.
 * @property {number} updateInterval - The interval in seconds to update the status.
 * @example
 * <lanyard-status user-id="987555201969971210" update-interval="30"></lanyard-status>
 */
class LanyardStatus extends HTMLElement {
  /**
   * @constructor
   * @description Creates an instance of LanyardStatus.
   * @returns {void}
   */
  constructor() {
    super();

    // used for rendering
    this._template = null;
    this._css = null;
    this._element = null;
    this._connected = false;

    // internal state
    this._interval = null;
    this._apiData = null;

    // props from attributes
    this.userId = null;
    this.updateInterval = null;

    this.attachShadow({ mode: "open" });
  }

  /**
   * @description The observed attributes of the component.
   * @returns {string[]} The attributes to observe.
   */
  static get observedAttributes() {
    return ["user-id", "update-interval"];
  }

  /**
   * @description Lifecycle method called when the component is connected to the DOM.
   * Initializes the HTML template, sets the props from attributes, fetches data from Lanyard's API, and renders the component.
   */
  async connectedCallback() {
    // Create CSS Stylesheet
    this._css = new CSSStyleSheet();
    this._css.replaceSync(LanyardStatus.css());

    // Create component template
    this._template = document.createElement("template");
    this._template.innerHTML = LanyardStatus.template();

    // Add stylesheet to Shadow DOM
    this.shadowRoot.adoptedStyleSheets = [this._css];

    // Init props from attributes
    this.userId = this.getAttribute("user-id") || "987555201969971210";
    this.updateInterval = this.getAttribute("update-interval") || 30;

    // Fetch data from Lanyard's API
    await this.updateData();

    // Render the component
    this.render();

    // Set interval to update data
    this._interval = setInterval(() => {
      this.updateData().then(this.render());
    }, this.updateInterval * 1000);

    this._connected = true;
  }

  /**
   * @description Lifecycle method called when the component is disconnected from the DOM.
   * Clears the update interval.
   * @returns {void}
   */
  disconnectedCallback() {
    clearInterval(this._interval);
  }

  /**
   * @description Lifecycle method called when an attribute is changed.
   * Updates the component's props and re-renders the component.
   * @param {string} name
   * @param {any} oldVal
   * @param {any} newVal
   * @returns
   */
  async attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    switch (name) {
      case "user-id":
        this.userId = newVal;
        break;
      case "update-interval":
        this.updateInterval = newVal;

        // Clear the old interval
        clearInterval(this._interval);

        // Update the data and render the component after every new interval
        this._interval = setInterval(() => {
          this.updateData().then(this.render());
        }, this.updateInterval * 1000);
        break;
      default:
        return;
    }

    // Re-render the component (skipped if attribute doesn't match any case above)
    this.render();
  }

  /**
   * @description Fetches data from Lanyard's API and sets the _apiData property.
   * @returns {Promise<void>}
   */
  async updateData() {
    this._apiData = await (
      await fetch(`https://api.lanyard.rest/v1/users/${this.userId}`)
    ).json();
  }

  /**
   * @description Renders the component with the fetched data.
   * @returns {void}
   */
  render() {
    // Clear the shadow DOM and re-render the component
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(this._template.content.cloneNode(true));

    // Update reference to dom element
    this._element = this.shadowRoot.getElementById("lanyard-status-component");

    // Set user profile photo
    this.shadowRoot.getElementById("pfp-img").src =
      `https://api.lanyard.rest/${this.userId}.webp`;

    // Set user activity type
    this.shadowRoot
      .getElementById("activity-indicator")
      .setAttribute("status", this._apiData.data.discord_status);
    this.shadowRoot.getElementById("activity-tooltip").textContent =
      LanyardStatus.activityTypes()[this._apiData.data.discord_status];

    // User display name
    this.shadowRoot.getElementById("display-name").textContent =
      this._apiData.data.discord_user.global_name;

    // Username if !== global display name, discriminator if present
    const userDisc = this.shadowRoot.getElementById("user-discriminator");
    if (
      this._apiData.data.discord_user.discriminator === "0" &&
      this._apiData.data.discord_user.username ===
        this._apiData.data.discord_user.global_name
    ) {
      userDisc.classList.add("hide");
      userDisc.textContent = "#";
    } else {
      userDisc.textContent = `(${this._apiData.data.discord_user.username}${this._apiData.data.discord_user.discriminator !== "0" ? "#" + this._apiData.data.discord_user.discriminator : ""})`;
    }

    // Set user activity if it exists
    const activityIndicator =
      this.shadowRoot.getElementById("activity-indicator");
    const activityIndicatorTooltip =
      this.shadowRoot.getElementById("activity-tooltip");

    const customActivityEmoji = this.shadowRoot.getElementById(
      "custom-activity-emoji",
    );
    const act = this.shadowRoot.getElementById("activity-name");
    const activityType = this.shadowRoot.getElementById("activity-type");
    const actContainer = this.shadowRoot.getElementById("activity-container");
    const rpcIndicator = this.shadowRoot.getElementById(
      "rich-presence-indicator",
    );

    // If user has no activity, hide the activity section and return
    if (this._apiData.data.activities.length <= 0) {
      act.textContent = "";
      actContainer.classList.add("hide");
      return;
    }

    // User is streaming
    if (this._apiData.data.activities[0].type === 1) {
      activityType.textContent = "Streaming";
      act.textContent = this._apiData.data.activities[0].details;

      // change the activity indicator and tooltip
      activityIndicator.setAttribute("status", "streaming");
      activityIndicatorTooltip.textContent = "Streaming";

      return;
    }

    // User has a custom activity
    if (this._apiData.data.activities[0].id === "custom") {
      act.textContent = "";
      activityType.textContent = this._apiData.data.activities[0].state;

      if ("emoji" in this._apiData.data.activities[0]) {
        if ("id" in this._apiData.data.activities[0].emoji) {
          const customEmojiImgUrl = `https://cdn.discordapp.com/emojis/${this._apiData.data.activities[0].emoji.id}.${this._apiData.data.activities[0].emoji.animated ? "gif" : "webp"}`;

          customActivityEmoji.textContent = "";
          customActivityEmoji.style = `background-image: url(${customEmojiImgUrl}); vertical-align: text-top;`;
        } else {
          customActivityEmoji.textContent =
            this._apiData.data.activities[0].emoji.name;
        }
      } else {
        customActivityEmoji.classList.add("hide");
      }

      // If custom activity but not rich presence, hide the rpc indicator
      if (this._apiData.data.activities.length < 2) {
        rpcIndicator.classList.add("hide");
      }
      return;
    }

    // None of the options below can have an emoji
    customActivityEmoji.classList.add("hide");

    // User is playing a game without Rich Presence
    if (!("application_id" in this._apiData.data.activities[0])) {
      rpcIndicator.classList.add("hide");
      activityType.textContent = "Playing";
      act.textContent = this._apiData.data.activities[0].state;
      return;
    }

    // User is playing a game with Rich Presence
    if ("application_id" in this._apiData.data.activities[0]) {
      activityType.textContent = "Playing";
      act.textContent = this._apiData.data.activities[0].name;
      return;
    }

    // User is listening to Spotify
    if (this._apiData.data.listening_to_spotify) {
      activityType.textContent = "Listening to";
      act.textContent = "Spotify";
    }
  }

  /**
   * @description The CSS styles for the component.
   * @returns {string} The CSS styles for the component.
   */
  static css() {
    return /* css */ `
      @import url("https://unpkg.com/css.gg@2.0.0/icons/css/menu-left.css");
      @import url("https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
      :host {
        font-family: "Open Sans", sans-serif, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        --bg-color: #2b2d31;
        --text-color: rgb(148, 155, 164);
        box-sizing: border-box;
      }
      .outer-container {
        display: flex;
        gap: 15px;
        background-color: var(--bg-color);
        padding: 10px;
        width: 300px;
      }
      .text-container {
        color: var(--text-color);
        font-weight: 500;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .display-name {
        font-size: 20px;
      }
      .activity-container {
        font-size: 14px;
      }
      .rich-presence-indicator {
        background-color: var(--text-color);
        color: var(--bg-color);
        border-radius: 2px;
        width: 10px;
        height: 10px;
        padding: 1px;
        display: inline-flex;
      }
      .rich-presence-indicator svg {
        width: 10px;
        height: 10px;
      }
      .activity-name {
        font-weight: bold;
      }
      .hide {
        display: none !important;
      }
      .avatar-container {
        position: relative;
        width: 64px;
        height: 64px;
        background-color: var(--bg-color);
      }
      .avatar-img {
        position: relative;
        width: 100%;
        border-radius: 50%;
      }
      .activity-indicator {
        display: inline-block;
        position: absolute;
        border-radius: 50%;
        top: 44px;
        left: 44px;
        width: 15px;
        height: 15px;
        border: 3px solid #2b2d31;
      }
      .activity-indicator[status="online"] {
        background-color: rgb(35, 165, 90);
      }
      .activity-indicator[status="idle"] {
        background-color: rgb(240, 178, 50);
      }
      .activity-indicator[status="dnd"] {
        background-color: rgb(242, 63, 67);
      }
      .activity-indicator[status="offline"] {
        background-color: rgb(128, 132, 142);
      }
      .activity-indicator[status="streaming"] {
        background-color: rgb(89, 54, 149);
      }
      .activity-indicator .activity-tooltip {
        visibility: hidden;
        width: min-content;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 10px;
        border-radius: 6px;
        position: absolute;
        z-index: 1;
        width: min-content;
        bottom: 155%;
        left: 50%;
        transform: translateX(-50%);
      }
      .activity-indicator:hover .activity-tooltip {
        visibility: visible;
      }
      .activity-indicator .activity-tooltip::after {
        content: " ";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
      }
      .custom-activity-emoji {
        width: 19px;
        height: 19px;
        background-size: contain;
        display: inline-block;
      }
    `;
  }

  /**
   * @description The HTML template for the component.
   * @returns {string} The HTML template for the component.
   */
  static template() {
    return /* html */ `

      <div
        class="outer-container"
        id="lanyard-status-component"
      >
        <div class="avatar-container">
          <img id="pfp-img" class="avatar-img" />
          <div id="activity-indicator" class="activity-indicator">
            <span id="activity-tooltip" class="activity-tooltip"></span>
          </div>
        </div>
        <div class="text-container">
          <div>
            <span id="display-name" class="display-name"></span>
            <span id="user-discriminator" class="user-discriminator"></span>
          </div>

          <div class="activity-container" id="activity-container">
            <div id="custom-activity-emoji" class="custom-activity-emoji"></div>
            <span id="activity-type" class="activity-type">Playing</span>
            <span id="activity-name" class="activity-name"></span>
            <div id="rich-presence-indicator" class="rich-presence-indicator">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 5.99519C2 5.44556 2.44556 5 2.99519 5H11.0048C11.5544 5 12 5.44556 12 5.99519C12 6.54482 11.5544 6.99039 11.0048 6.99039H2.99519C2.44556 6.99039 2 6.54482 2 5.99519Z"
                  fill="currentColor"
                />
                <path
                  d="M2 11.9998C2 11.4501 2.44556 11.0046 2.99519 11.0046H21.0048C21.5544 11.0046 22 11.4501 22 11.9998C22 12.5494 21.5544 12.9949 21.0048 12.9949H2.99519C2.44556 12.9949 2 12.5494 2 11.9998Z"
                  fill="currentColor"
                />
                <path
                  d="M2.99519 17.0096C2.44556 17.0096 2 17.4552 2 18.0048C2 18.5544 2.44556 19 2.99519 19H15.0048C15.5544 19 16 18.5544 16 18.0048C16 17.4552 15.5544 17.0096 15.0048 17.0096H2.99519Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
        `;
  }

  /**
   * @description The activity types and their corresponding names.
   * @returns {Object} The activity types and their corresponding names.
   */
  static activityTypes() {
    return {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };
  }
}

// Register the custom element unless one with the same already exists
if (!window.customElements.get("lanyard-status")) {
  window.customElements.define("lanyard-status", LanyardStatus);
}
