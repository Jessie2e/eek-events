# Install this concept in Squarespace 7.1

## Fastest path
This package is intentionally **framework-free** so it can live inside Squarespace without React, a build process, or a separate app server.

### 1. Preview it first
Open `index.html` locally. Keep the `assets` folder next to it.

### 2. Upload the real wedding images to Squarespace
Upload the image assets you want to use in Squarespace and copy their CDN URLs. The included deck images are only there so the prototype has real EEK visual material immediately.

Search/replace these paths in `eek-squarespace-codeblock.html`:
- `assets/sword-ceremony.jpg`
- `assets/knight-wedding.jpg`
- `assets/renaissance-wedding.jpg`
- `assets/cake-topper.jpg`
- `assets/glow-dress.jpg`
- `assets/eek-team.jpg`

For the three portfolio cards, the current art-directed initials are deliberate placeholders. Once you give me the **Caroline + Noah**, **Mike + Sara**, and **David + Diana** image sets, those cards should become cinematic multi-image case-study covers instead of simple gradients.

### 3. Add the page
Create a new Squarespace 7.1 page, preferably a blank/full-width page. Add one Code Block and paste the entire contents of `eek-squarespace-codeblock.html`.

If your plan/setup strips JavaScript from page Code Blocks, use this split install instead:
- Paste the HTML portion into a Code Block.
- Put `custom-css.css` in Design → Custom CSS.
- Put `footer-js.js` in Settings → Advanced → Code Injection → Footer.

### 4. Remove Squarespace section padding
The custom experience is designed to go edge-to-edge. Set the host section to full width and reduce/remove its native top and bottom padding. If the Squarespace header feels redundant, hide it on this page and use the custom EEK nav included in the concept.

### 5. Replace the prototype inquiry action
The Vibe Forge currently creates a brief and opens an email to `eek@eek.events`. For the production build, the best Squarespace-native setup is:
- Keep the Vibe Forge interaction.
- Route the final CTA to a dedicated inquiry page or Squarespace Form Block.
- Add hidden/visible fields for the generated vibe summary if you want to preserve the answers in form submissions.
- Optionally connect scheduling after form submission rather than making a consultation calendar the first thing visitors see.

### 6. Create three real case-study pages
Suggested routes:
- `/weddings/caroline-noah`
- `/weddings/mike-sara`
- `/weddings/david-diana`

Each should be image-forward and short: 1 hero statement, 8–15 great images, 3–5 “design decisions,” one small quote if available, and a CTA. Avoid turning the portfolio into a huge gallery dump.

## What I would do next
The next build pass should use the actual three wedding galleries and create the case-study transitions. The strongest version would let each portfolio card expand into its wedding with an image-mask transition so the site feels more like entering a new “chapter” than loading another page.
