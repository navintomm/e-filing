# Sidebar Scroll Fix

**Date:** 2026-01-08
**Issue:** User reported that the Draft Suit System sidebar was auto-scrolling to show only step 5 onwards, hiding previous steps (1-4).
**Cause:** The `StepIndicator` component used `block: 'nearest'` in `scrollIntoView()`. When the active step (e.g., Step 5) was loaded, it aligned the step to the top of the scrollable sidebar container, effectively scrolling steps 1-4 out of view.
**Fix:** Changed `block: 'nearest'` to `block: 'center'`.
**Result:** The active step is now centered in the sidebar, ensuring that previous and upcoming steps are visible, providing better context to the user.
