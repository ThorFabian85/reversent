# Verification — Reversent v4.5

## v4.5 header refinements

Source checks confirm two Home navigation links on each of the 11 pages, all targeting index.html. Both desktop and mobile Home links have an outlined pill style. The chapter bar is 44px at all four height declarations, and its links fill the bar without the previous vertical padding. Existing anchor offsets use the updated height variable.

All content after the main header, the ring script, and the assets and research downloads are unchanged from v4.4. The self-contained v4.5 preview JavaScript passes its syntax check. Browser rendering and physical-device testing remain unverified. The site owner approved this revision after reviewing the downloadable website; deployment status is recorded in the repository’s GitHub Actions runs.

## Previous v4.4 checks

Completed source and file checks:

- All 11 HTML pages have one H1, unique element IDs, a main landmark and a skip link.
- All 22 header/footer brand links target a focusable top anchor. The back-to-top handler explicitly scrolls the current page to zero and respects reduced motion.
- Fixed-header placement, stacked chapter offsets and the compact menu breakpoint were checked by resolving their CSS declarations for the viewport sizes below.
- All 521 local link/asset references resolve, including fragment targets.
- All nine research-page main texts match the supplied pages after whitespace normalization.
- All 36 supplied assets and research files retain their original SHA-256 hashes.
- JavaScript passes Node’s syntax check.
- The self-contained preview loader was executed in an isolated JavaScript context: all 11 routes embed their styles, logo and syntactically valid scripts; the research-download notice is triggered correctly. This does not test browser rendering.
- Responsive rules cover small phones, larger phones/tablets and desktop layouts. Interactive controls include keyboard handling, accessible state attributes, Escape dismissal, reduced-motion behavior and an animation pause control.
- The site does not request external fonts or JavaScript dependencies.

Validation limit: the environment’s browser security policy blocked local HTTP and file previews. Visual layout, real browser interactions, animation performance and mobile rendering have therefore not been verified in a browser. Responsive rules and accessibility handling have been implemented and reviewed in source; this is not an accessibility conformance audit.

The self-contained interactive preview is supplied separately so the completed design can be opened and inspected directly. The checks in this document were completed on the v4.4 package before publication; deployment status is recorded separately in the repository’s GitHub Actions runs.

## Responsive source audit — historical v4.4 dimensions

These checks evaluate CSS declarations, not rendered element dimensions.

| Target | Viewport in CSS pixels | Header height | Chapter height | Navigation |
| --- | --- | --- | --- | --- |
| Small phone | 320 × 568 | 72px | 62px | Menu |
| Phone | 390 × 844 | 72px | 62px | Menu |
| Large phone | 430 × 932 | 72px | 62px | Menu |
| Phone landscape | 844 × 390 | 64px | 52px | Menu |
| iPad split view | 600 × 900 | 72px | 66px | Menu |
| iPad portrait | 768 × 1024 | 72px | 66px | Menu |
| iPad Air portrait | 820 × 1180 | 72px | 72px | Menu |
| iPad landscape | 1024 × 768 | 72px | 72px | Menu |
| iPad Pro landscape | 1194 × 834 | 78px | 72px | Desktop |
| Desktop | 1440 × 900 | 78px | 72px | Desktop |

## v4.2 interaction checks

The actual website JavaScript was executed in a minimal DOM/canvas model, without a browser. Checks passed for primary mouse-button capture, horizontal and vertical turning, a drag continuing beyond the initial region, stable orientation after release, hover after release, reset, reverse rotation, 500 consecutive turns with finite projection coordinates, pointer cancellation, lost-capture handling, window blur, keyboard input, resuming animation, touch input and reduced-motion behavior. Pointer capture API calls were verified; physical browser capture delivery was not.

Touch-region sizing and canvas pixel limits were checked at widths of 320, 390, 820 and 1024 CSS pixels. The mobile interaction region leaves space beside it for ordinary scrolling. Touch-action declarations allow pinch zoom. Native scrolling, pinch zoom and device performance require browser/device validation.

All 11 header Network buttons resolve to the existing footer network. Both logo links remain intact. No live deployment was performed.

## v4.3 continuous-motion regression check

The actual website script passed focused checks in the existing DOM/canvas model for continued motion during click-and-hold, mouse and touch dragging, release, keyboard rotation and Reset. Explicit pause and reduced-motion preferences still freeze autonomous motion while allowing deliberate rotation. Grabbing and resetting preserve phase continuity, and dragging reuses a single scheduled animation loop.

The speed increase was checked against the previously shipped v4.2 script: 100 animation steps at the new speed produce the same projected ring coordinates as 130 equivalent old steps, within floating-point tolerance. The animation is therefore 30% faster; pointer sensitivity remains unchanged.

The historical v4.2 expectation of freezing on grab/release is intentionally replaced by the continuous behavior above. These are code-level checks; browser rendering and physical-device input remain unverified because local browser previews are blocked.

## v4.4 finishing details

Source inspection confirms that the ring interaction surface has no circular focus outline, the opening no longer contains a Scroll to explore prompt, and none of the 11 footers has a separate Back to top link. All 22 header/footer logo links still target the page-top anchor. Keyboard focus is indicated on the existing drag hint. The animation and input handlers are unchanged apart from a comment.
