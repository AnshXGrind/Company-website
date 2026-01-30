# Splash Unlock Logic

## Single Source of Truth
- `isSplashActive` (boolean, default: true)
- All splash behaviors depend on this state
- Once set to false, splash mode exits permanently

## Exit Triggers
The splash exits when ANY of these occur:
1. **First scroll attempt** (wheel, touchstart, pointerdown, keydown)
2. **First touch interaction** (touchstart, pointerdown)
3. **Fixed timeout** (1.5 seconds max)

## On Splash Exit (`forceAppReady()`)
1. Set `isSplashActive = false`
2. Remove position: fixed from hero (brand-container → static)
3. Disable pointer events on splash/hero elements
4. Enable pointer events on main content and navbar
5. Restore body scrolling (overflow-y: auto)
6. Make content below visible and scrollable
7. Clean up listeners and timers

## Guards Against Deadlocks
- `if (!isSplashActive)` prevents re-running
- `transitionInProgress` prevents multiple simultaneous exits
- Works even if animations fail (no dependency on CSS transitions)
- Compatible with desktop (wheel/keydown) and mobile (touch/pointer)

## Safety Net
- Failsafe timeout (1.5s) force-exits even on JS errors
- Global error handlers catch unhandled errors and promise rejections
- Console logs exit reason for debugging

## Result
The site starts in splash mode, then transitions to a normal scrolling website within 1.5 seconds, guaranteed.