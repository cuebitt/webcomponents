class ThemeSwitcher extends HTMLElement {
	static get template() {
		return /* html */ `
<button
        id="theme-switcher-btn"
        data-theme="system"
        part="btn"
      >
        <svg
          id="icon-light"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"
          />
        </svg>

        <svg
          id="icon-dark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          fill="currentColor"
        >
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M144.7 98.7c-21 34.1-33.1 74.3-33.1 117.3c0 98 62.8 181.4 150.4 211.7c-12.4 2.8-25.3 4.3-38.6 4.3C126.6 432 48 353.3 48 256c0-68.9 39.4-128.4 96.8-157.3zm62.1-66C91.1 41.2 0 137.9 0 256C0 379.7 100 480 223.5 480c47.8 0 92-15 128.4-40.6c1.9-1.3 3.7-2.7 5.5-4c4.8-3.6 9.4-7.4 13.9-11.4c2.7-2.4 5.3-4.8 7.9-7.3c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-3.7 .6-7.4 1.2-11.1 1.6c-5 .5-10.1 .9-15.3 1c-1.2 0-2.5 0-3.7 0l-.3 0c-96.8-.2-175.2-78.9-175.2-176c0-54.8 24.9-103.7 64.1-136c1-.9 2.1-1.7 3.2-2.6c4-3.2 8.2-6.2 12.5-9c3.1-2 6.3-4 9.6-5.8c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-3.6-.3-7.1-.5-10.7-.6c-2.7-.1-5.5-.1-8.2-.1c-3.3 0-6.5 .1-9.8 .2c-2.3 .1-4.6 .2-6.9 .4z"
          />
        </svg>

        <svg
          id="icon-system"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          fill="currentColor"
        >
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 288L64 352 64 64l448 0z"
          />
        </svg>
      </button>
`;
	}

	static get css() {
		return /* css */ `
      #theme-switcher-btn {
        padding: 0.5rem !important;
        width: fit-content !important;
        height: fit-content !important;
        aspect-ratio: 1/1 !important;
      }

      #theme-switcher-btn svg {
        display: none;
        width: 1rem;
        height: 1rem;
      }

      #theme-switcher-btn svg {
        width: 1rem;
        height: 1rem;
      }

      #theme-switcher-btn[data-theme="light"] #icon-light,
      #theme-switcher-btn[data-theme="dark"] #icon-dark,
      #theme-switcher-btn[data-theme="system"] #icon-system {
        display: initial;
      }
    `;
	}

	constructor() {
		super();
		// attach shadow root
		this.attachShadow({ mode: "open" });

		const style = new CSSStyleSheet();
		style.replaceSync(ThemeSwitcher.css);
		this.shadowRoot.adoptedStyleSheets = [style];

		// add template to shadow root
		const template = document.createElement("template");
		template.innerHTML = ThemeSwitcher.template;
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.btn = this.shadowRoot.querySelector("#theme-switcher-btn");
	}

	connectedCallback() {
		this.setAttribute("theme", "system");
		this.btn.addEventListener("click", this.rotateTheme.bind(this));
	}

	static get observedAttributes() {
		return ["theme"];
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (oldVal === newVal) return;

		switch (name) {
			case "theme":
				if (["light", "dark", "system"].includes(newVal)) {
					this.btn.setAttribute("data-theme", newVal);
				} else {
					this.btn.setAttribute("data-theme", "system");
				}
				break;
		}
	}

	rotateTheme() {
		// move to the next theme
		switch (this.getAttribute("theme")) {
			case "light":
				this.setAttribute("theme", "dark");
				break;
			case "dark":
				this.setAttribute("theme", "system");
				break;
			case "system":
				this.setAttribute("theme", "light");
				break;
			default:
				this.setAttribute("theme", "system");
				break;
		}

		// emit theme changed event
		this.dispatchEvent(
			new CustomEvent("themechange", {
				detail: {
					theme: this.getAttribute("theme"),
				},
			}),
		);
	}
}

window.customElements.define("theme-switcher", ThemeSwitcher);
