# webgarden-greenhouse

This web component is used to display a stack of shelves that hold [Webgarden](https://wiki.melonland.net/web_gardens) pots. `shelves.css` by MissMoss is used to style the shelves.

# Preview

![component preview](/components/webgarden-greenhouse/meta/preview.png)

# Usage

1. Include the script in your HTML document's head tag:

```html
<script type="module" src="webgarden-greenhouse.js">
```

(replace `webgarden-greenhouse.js` with the path or URL to the script)

2. Use the `webgarden-greenhouse` component in the body tag of your HTML document:

```html
<body>
  <webgarden-greenhouse plants="pots,go,here"></webgarden-greenhouse>
</body>
```

Insert a comma separated list of pots into the `plants` attribute. These can be either Neocities IDs (`cuebitt`.neocities.org) or URLs to a Webgarden pot (`https://cuebitt.neocities.org/webgarden.html`) Example:

```html
<body>
  <webgarden-greenhouse
    plants="cuebitt,https://cuebitt.neocities.org/webgarden.html,cuebitt"
  ></webgarden-greenhouse>
</body>
```
