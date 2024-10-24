# theme-switcher

This web component is used to switch the color theme on a website. Clicking on the button cycles between light mode, dark mode, and system color mode.

# Preview

![component preview](/components/theme-switcher/meta/preview.png)

# Usage

1. Include the script in your HTML document's head tag:

```html
<script type="module" src="theme-switcher"></script>
```

(replace `theme-switcher.js` with the path or URL to the script)

2. Use the `theme-switcher` component in the body tag of your HTML document:

```html
<body>
  <theme-switcher theme="system"></theme-switcher>
</body>
```

3. Style the button using CSS:

```css
theme-switcher::part(btn) {
}

[data-theme="dark"] theme-switcher::part(btn) {
}
```

4. Listen for the `themechange` event:

```js
const themeSwitcher = document.querySelector("theme-switcher");
themeSwitcher.addEventListener("themechange", (e) => {
  // e.detail.theme will be one of "light", "dark", "system"
});
```
