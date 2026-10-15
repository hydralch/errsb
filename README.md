# Random fullscreen background website

This simple site shows a fullscreen background image that is randomly chosen each time the page loads. Images should be placed in the `images/` folder at the site root.

How it chooses images (in order):

1. If you create `images/list.json` containing a JSON array of filenames, e.g. `["a.jpg","b.png"]`, the script will use those names.
2. Otherwise the script attempts to fetch `/images/` and parse the server directory listing for image files (works when directory indexes are enabled).
3. If neither option works, put a fallback image at `images/default.jpg`.

Examples:

- images/list.json
  [
    "photo1.jpg",
    "photo2.jpg",
    "wallpaper.png"
  ]

Notes:
- This is a static client-side solution. A server-side listing or a pre-generated list.json gives the best, reliable results.
- If you want the page to scale to different aspect ratios, use images with sufficient resolution and the CSS `background-size: cover` will keep them fullscreen.
