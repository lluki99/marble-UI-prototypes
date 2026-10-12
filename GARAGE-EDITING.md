# Editing Garage UI

Garage UI is `prototype-02.html`. Its scene is separate from the race demo.

## Objects and camera

Edit `garage-config.js`. All coordinates are pixels on the original **1983 × 793** canvas. Keep the original PNGs in `assets/garage/`.

- `name` changes the preview sign and menu heading (for example, `name: 'Geralt Witcher'`).
- `src` selects an independent PNG layer.
- `interactive: false` keeps a layer visible but excludes it from navigation, hit testing, focus effects and menus (Lift).
- `pulseScale` sets the per-object focus maximum: 1.05 for large objects, up to 1.08 for smaller objects. A shared clock keeps the scale phase continuous; the silhouette halo uses a fixed filter and a smooth opacity fade.
- `layer` sets stacking order; larger values render in front. Lift is 3, Marble is 2.
- `bounds: [x, y, width, height]` encloses the visible object, excluding faint stray alpha pixels. Rendering crops this region from the original layer without modifying the source file. Pixel alpha within this region determines pointer hits, so transparent holes do not intercept another object.
- `pivot: [x, y]` sets the scale origin and exploration camera target. Navigation is sorted by the pivot's horizontal coordinate.
- `zoom: {scale: 1.8, target: [x, y]}` sets the selection framing. The camera limits zoom to keep the object visible and clamps movement to the background edges.
- `motion` controls mouse travel, easing, pulse scale/period and alpha hit threshold. Reduced motion disables parallax/pulsing and snaps the camera to the readable final view.

Example: change `motion.mouseTravel` from `22` to `12` for a smaller horizontal response.

## Individual menus

Each object has its own `menu: {id: 'mechanic-menu', content: []}` and separate DOM container. The initial content is deliberately empty.

To add plain text later, use `content: ['Your first message.']`. To add interactive content, build it inside that object's `.garage-menu-content` in `prototype-02.js`; keep its unique `menu.id`. Do not add shared workshop actions to all objects unless they are intended for all of them.

## Inputs

A / D or arrow keys cycle objects. Clicking opaque pixels focuses an object. Enter or Select opens its menu. Escape or Close returns to exploration. Reset closes menus and returns to the configured `initial` object. The compact Previous / Select / Next buttons provide the same actions without a keyboard.

The hub entry is in `prototype-config.js`. Race configuration and behavior remain independent.
