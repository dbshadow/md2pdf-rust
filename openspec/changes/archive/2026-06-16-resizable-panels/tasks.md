## 1. Setup State and Refs

- [x] 1.1 Declare leftWidth (default 50) and isDragging (default false) states in App.tsx
- [x] 1.2 Create containerRef using useRef and attach it to the .app-container element in App.tsx

## 2. Implement Resizing Interaction Logic

- [x] 2.1 Implement handleMouseDown that sets isDragging to true and registers mousemove/mouseup listeners to the window
- [x] 2.2 Implement handleMouseMove that calculates new leftWidth percentage constrained between 20% and 80%
- [x] 2.3 Implement handleMouseUp that sets isDragging to false and removes window listeners
- [x] 2.4 Add useEffect hook to ensure clean removal of window event listeners on component unmount

## 3. Integrate JSX and Apply CSS Styles

- [x] 3.1 Apply dynamic width inline styles to .editor-panel and .preview-panel in App.tsx
- [x] 3.2 Insert the resizer div between editor and preview panels in App.tsx
- [x] 3.3 Render a pointer-events blocker overlay in the preview panel when isDragging is active
- [x] 3.4 Add resizer bar styles (width, cursor, hover color transitions) and overlay styles to src/index.css
