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
class LanyardStatus extends HTMLElement {
  constructor() {
    super();

    this._connected = false;
    this._element = null;
    this._interval = null;
    this._apiData = null;

    this.userId = null;
    this.updateInterval = null;

    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["user-id", "update-interval"];
  }

  async connectedCallback() {
    this.userId = this.getAttribute("user-id") || "987555201969971210";
    this.updateInterval = this.getAttribute("update-interval") || 30;

    this._apiData = await (
      await fetch(`https://api.lanyard.rest/v1/users/${this.userId}`)
    ).json();

    this.render();

    this._interval = setInterval(() => {
      this.updateData().then(this.render());
    }, this.updateInterval * 1000);

    this._connected = true;
  }

  disconnectedCallback() {
    clearInterval(this._interval);
  }

  async attributeChangedCallback(name, oldVal, newVal) {
    if (!this._connected || oldVal === newVal) return;

    switch (name) {
      case "user-id":
        this.userId = newVal;

        this.render();
        break;
      case "update-interval":
        this.updateInterval = newVal;

        clearInterval(this._interval);

        this._interval = setInterval(() => {
          this.updateData().then(this.render());
        }, this.updateInterval * 1000);
        break;
    }
  }

  async updateData() {
    this._apiData = await (
      await fetch(`https://api.lanyard.rest/v1/users/${this.userId}`)
    ).json();
  }

  render() {
    const lanyardStatusTmp = document.createElement("template");
    lanyardStatusTmp.innerHTML = LanyardStatus.template();

    // Add or replace existing dom element
    if (this._element) {
      this._element.replaceWith(lanyardStatusTmp.content.cloneNode(true));
    } else {
      this.shadowRoot.appendChild(lanyardStatusTmp.content.cloneNode(true));
    }

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
      userDisc.classList.remove("hide");
      userDisc.textContent = `(${this._apiData.data.discord_user.username}${this._apiData.data.discord_user.discriminator !== "0" ? "#" + this._apiData.data.discord_user.discriminator : ""})`;
    }

    // Set user activity if it exists
    const act = this.shadowRoot.getElementById("activity-name");
    const actContainer = this.shadowRoot.getElementById("activity-container");
    const rpcIndicator = this.shadowRoot.getElementById(
      "rich-presence-indicator",
    );
    if (this._apiData.data.activities.length > 0) {
      actContainer.classList.remove("hide");

      // set "Listening", "Playing", "Streaming"
      const activityType = this.shadowRoot.getElementById("activity-type");
      if (this._apiData.data.listening_to_spotify) {
        // Listening to Spotify
        activityType.textContent = "Listening to";
        act.textContent = "Spotify";
      } else if (this._apiData.data.activities[0].application_id) {
        // Streaming {details}
        if (this._apiData.data.activities[0].type === 1) {
          activityType.textContent = "Streaming";
          act.textContent = this._apiData.data.activities[0].details;

          // change the activity indicator and tooltip
          this.shadowRoot
            .getElementById("activity-indicator")
            .setAttribute("status", "streaming");
          this.shadowRoot.getElementById("activity-tooltip").textContent =
            "Streaming";
        } else {
          // Playing {game}
          activityType.textContent = "Playing";
          act.textContent = this._apiData.data.activities[0].name;
        }
        rpcIndicator.classList.remove("hide");
      } else {
        rpcIndicator.classList.add("hide");
      }
    } else {
      act.textContent = "";
      actContainer.classList.add("hide");
    }
  }

  static template() {
    return /* html */ `
        <style>
    @import url('https://unpkg.com/css.gg@2.0.0/icons/css/menu-left.css');
    :host {
    font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
    display: none;
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
</style>
<div class="outer-container" id="lanyard-status-component">
    <div class="avatar-container">
        <img id="pfp-img" class="avatar-img">
        <div id="activity-indicator" class="activity-indicator">
            <span id="activity-tooltip" class="activity-tooltip">
            </span>
        </div>
    </div>
    <div class="text-container">
        <div >
            <span id="display-name" class="display-name"></span>
            <span id="user-discriminator" class="user-discriminator"><span>
        </div>
        <div class="activity-container" id="activity-container">
            <span id="activity-type" class="activity-type">Playing</span>
            <span id="activity-name" class="activity-name"></span>
            <div id="rich-presence-indicator" class="rich-presence-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 5.99519C2 5.44556 2.44556 5 2.99519 5H11.0048C11.5544 5 12 5.44556 12 5.99519C12 6.54482 11.5544 6.99039 11.0048 6.99039H2.99519C2.44556 6.99039 2 6.54482 2 5.99519Z" fill="currentColor" />
                    <path d="M2 11.9998C2 11.4501 2.44556 11.0046 2.99519 11.0046H21.0048C21.5544 11.0046 22 11.4501 22 11.9998C22 12.5494 21.5544 12.9949 21.0048 12.9949H2.99519C2.44556 12.9949 2 12.5494 2 11.9998Z" fill="currentColor" />
                    <path d="M2.99519 17.0096C2.44556 17.0096 2 17.4552 2 18.0048C2 18.5544 2.44556 19 2.99519 19H15.0048C15.5544 19 16 18.5544 16 18.0048C16 17.4552 15.5544 17.0096 15.0048 17.0096H2.99519Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    </div>
</div>
        `;
  }

  static activityTypes() {
    return {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };
  }
}

window.customElements.define("lanyard-status", LanyardStatus);
