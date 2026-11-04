# Prototype 3 · Main Menu

Open `http://localhost:4173/prototype-04.html` from the existing static server, or use its hub card.
No installation or build step is required. Prototype 1 uses HTML files 01 and 03; Garage uses 02.

`config.js` owns menu labels, messages, computer artwork, saved portrait/faction/progress,
placeholder credits and the initial Video/Audio values. Change `save.progress` to change the preview;
change `portrait` to a project image path. `model.js` defines navigation independently of rendering.
`app.js` presents those states and handles inputs. `style.css` owns terminal/hardware presentation.

Enter confirms; arrows navigate; Right enters an open branch; Left/Escape returns. The displayed
Xbox A/B prompts describe the intended controller mapping; this iteration implements keyboard,
mouse and touch, without Gamepad API input. Tab also reaches all interactive controls.

The supplied IMG_0072 computer is copied unchanged into `assets/main-menu/computer.png`.
Only its hardware/environment is used: a live HTML screen covers the drawn title and prompt.
At narrow widths the screen is enlarged within the hardware treatment to keep text readable.

Continue and New Game lead to a placeholder simulation screen. New Game only clears the in-memory
story progress after confirmation; there is no real save deletion or storage. Quit returns to the
title screen. Reset restores the sample 45% save and initial settings, cancels the transition,
and closes all windows. Sliders retain their values during navigation but do not change real audio/video.

Reduced motion disables blinking, scan movement and glitch transitions. Run `node tests/main-menu.test.cjs`
for the navigation/state checks. Existing prototypes have separate scripts and styles.

Menu branches connect to their actual parent button and are recalculated on resize. Controls has separate Xbox Controller and Keyboard previews. The boot title and menu watermark share `.brand-title`; the three auxiliary displays use `.side-screen` masks aligned with the artwork.
