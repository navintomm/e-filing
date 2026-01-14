# Hydration Mismatch Fix

**Date:** 2026-01-08
**Issue:** "Hydration failed because the server rendered text didn't match the client." caused by the `caseReference` selector displaying different values on server ("New Draft") vs client (e.g., "OS 245/2025" from persisted state).
**Fix:**
- Updated `components/suit/SuitWizard.tsx` to include a `mounted` state check.
- The component now renders "New Draft" initially on both server and client (before mount), ensuring the HTML matches.
- Once mounted, it switches to the actual `caseReference`, seamlessly updating the UI without hydration errors.

**Status:** Fixed.
