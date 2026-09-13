# Reversent Research — v4.4

A complete redesign of the supplied v3.0 cinematic preview, inspired by the visual pacing of OpenAI’s Astra launch page.

## Open the website

Public site: [Reversent Research](https://thorfabian85.github.io/reversent/).

This repository contains the v4.4 website source. GitHub Pages publishes the `main` branch through the repository’s existing configuration.

Extract this ZIP, then open `index.html` in your browser. The site uses ordinary HTML, CSS and JavaScript. No installation or build command is needed. All research downloads work from the extracted folder.

For the separate self-contained preview, open `Reversent-Interactive-Preview-v4.4.html`. It includes all 11 website pages. The complete research downloads live in this ZIP.

## Update the existing GitHub Pages site

Upload the contents of this folder into your existing repository root. Replace the matching HTML files, `styles.css` and `script.js`; preserve the `assets`, `conversations` and `research-files` directories. Keep `.nojekyll` in the root. If Pages is already enabled, the update publishes through its existing configuration.

The separate downloadable package and preview contain the same website design. The preview file is a standalone deliverable and is not required by GitHub Pages.

## v4.4 finishing details

- Removed the large circular focus outline around the interactive ring. Keyboard focus now subtly highlights the existing Drag to rotate label.
- Removed the Scroll to explore prompt from the opening.
- Removed the separate Back to top footer link on all 11 pages. Both logos continue to return to the top.

## v4.3 continuous ring motion

- Automatic motion keeps running while you click, hold, drag, release, use the arrow keys or reset the view.
- The animation moves 30% faster than v4.2. Drag sensitivity is unchanged.
- Drag rotation is layered over the live animation. Grabbing does not jump to a different pose, and Reset restores the default view without restarting the animation phase.
- The Pause motion button still pauses automatic motion. Reduced-motion preferences are still respected; deliberate dragging remains available while paused.

## v4.2 network shortcut and interactive ring

- A Reversent Network button in the fixed header scrolls to the existing network links on every page. On smaller phones the label shortens to Network.
- Hold the left mouse button on the ring and drag in any direction to rotate it in place. Touch dragging is supported inside the ring interaction area; the surrounding page remains scrollable.
- Your chosen viewing offset is preserved after release while the ring continues moving. Use Pause motion whenever you want to stop the automatic animation.
- Reset view returns the ring to its initial orientation. When the ring is keyboard-focused, use arrow keys to rotate and Home to reset.
- The ring uses quaternion rotation, preserving rotation freedom and numerical stability through repeated turns.
- Deliberate rotation works with reduced motion enabled; automatic animation stays paused until requested.

## v4.1 navigation and mobile update

- The main header stays visible on every page while scrolling.
- The homepage chapter navigation sits below the fixed header, with anchor clearance for headings.
- Both logos return to the top of the current page.
- Compact navigation extends through tablet widths of 1024 CSS pixels, with a scrollable menu for short landscape screens.
- Phone rendering uses fewer particles and filaments, and a lower canvas pixel ratio.
- The standalone preview includes phone and iPad width controls. These show responsive layouts; they do not emulate a physical device or its browser.

## What changed

- A new opening with an original animated geometric field, pointer response and a pause control.
- A chapter-based homepage: question, principle, evidence and further research.
- An interactive conceptual comparison of preserved correction and irreversible loss.
- Keyboard-accessible failure, repair and audit panels; figures retain their original qualifications.
- A consistent design across all 11 pages, simplified navigation and a complete research footer.
- Responsive layouts, reduced-motion support and no external fonts or JavaScript dependencies.

All nine research-page main texts and all 36 supplied assets/research files are preserved. The home page is reorganized and rewritten for clarity; the experimental numbers and their limits are retained.

## Research status

Formal Core Draft 0.5 remains an unvalidated repair candidate. Experiment 005A exposed the frozen Draft 0.4 specification gap. Experiment 005B recorded 192/192 formal behavioral matches and 96/96 blinded semantic gate passes. Baseline Astra was also 48/48: this audit does not establish a causal improvement or universal safety.

See `DESIGN-NOTES.md` for the reference study and `VERIFICATION.md` for the checks and remaining validation limits.
