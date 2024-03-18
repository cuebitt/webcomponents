# lanyard-status

This web component is used to display a Discord status. It uses [Lanyard](https://lanyard.eggsy.xyz), which requires you to join a Discord server (link found [here](https://lanyard.eggsy.xyz)) in order for your data to be accessible.

# Preview

![component preview](/components/lanyard-status/meta/preview.png)

# Usage

1. Include the script in your HTML document's head tag:

```html
<script type="module" src="lanyard-status.js"></script>
```

(replace `lanyard-status.js` with the path or URL to the script)

2. Use the `lanyard-status` component in the body tag of your HTML document:

```html
<body>
  <lanyard-status
    user-id="discordUserIdHere"
    update-interval="updateIntervalHere"
  ></lanyard-status>
</body>
```

Replace `discordUserIdHere` with your Discord user ID (not your username! you can find this by turning on `Developer Mode` in Discord and right clicking on your profile.) and `updateIntervalHere` with an update interval in seconds (optional, defaults to 30 seconds).
