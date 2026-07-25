# Dashboard Bento Redesign Plan

## Analysis
The current dashboard uses a 12-column grid but doesn't constrain heights. The right column has 3 stacked components (Incident Dispatch, Route Detours, Dispatch Log) which makes it very tall. Because the grid stretches rows, the left and center columns also stretch. The map stretches, but Leaflet doesn't automatically resize its tiles, leaving a grey void. More importantly, the layout feels like a long scrolling webpage rather than a dense, unified command center.

## Proposed Layout (True Bento Grid)
We will constrain the dashboard to a fixed or viewport-relative height (e.g., `h-[calc(100vh-200px)]` or a specific min/max height) so the entire command center fits on screen without page-level scrolling.

**Grid Structure:**
Instead of 3 simple columns, we'll use a more intricate grid layout that utilizes both rows and columns.

**Option A (Dense Bento):**
- **Grid Size:** 12 columns, 2 main rows.
- **Top Row:** 
  - Left: `City Metrics` (col-span-3)
  - Center: `Interactive Map` (col-span-6, row-span-2) - Map takes up massive central real estate.
  - Right: `Incident Dispatch` (col-span-3)
- **Bottom Row:**
  - Left: `Dispatch Log` (col-span-3)
  - Right: `Route Detours` (col-span-3)
- **Footer:** `Forecast Horizon` spans full width.

Wait, if Map is row-span-2, it will sit between City Metrics/Dispatch Log on the left, and Incident Dispatch/Route Detours on the right.
This gives us:
- Left Column (col 1-3): City Metrics (top), Dispatch Log (bottom)
- Center Column (col 4-9): Map (full height of both rows)
- Right Column (col 10-12): Incident Dispatch (top), Route Detours (bottom)

To make this work, we can make the outer grid have a fixed height, e.g., `h-[800px]`, or use `grid-rows-2` with proportional heights (e.g., `grid-rows-[1fr_1fr]`).
We must ensure components like Dispatch Log and Incident Dispatch have internal scrolling (`overflow-y-auto`) so they don't break the grid height.

## Fixes
1. Leaflet map grey space: Fix the container height and use `ResizeObserver` or CSS to ensure it sizes correctly, or simply have a stable fixed layout height so it doesn't change after mounting.
2. Make cards scrollable: Add `overflow-y-auto` and custom scrollbar styling to the lists inside IncidentDispatch, RouteDetours, and DispatchLog.

