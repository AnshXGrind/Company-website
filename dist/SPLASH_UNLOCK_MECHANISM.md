# Splash-to-App Unlock Mechanism

## Overview
The splash transition has been hardened to **guarantee the app reaches a fully interactive state** under all conditions, favoring reliability over visual perfection.

## State Management

### `appReady` Flag
- **Purpose**: Explicit boolean tracking whether the app has transitioned to the interactive "app-ready" state
- **Single source of truth**: Once `true`, the app is fully unlocked and will never re-lock
- **Checked before all transitions**: Guards against multiple transitions running simultaneously

### `transitionInProgress` Flag
- Prevents race conditions when multiple events fire (e.g., scroll + timeout)
- Set when any transition starts
- Cleared when `forceAppReady()` completes

## Unlock Triggers (Multiple Paths to Success)

The app transitions to the ready state through **any** of these paths:

1. **First Scroll Intent** (most common)
   - User scrolls, touches, or presses arrow key
   - Immediately calls `forceAppReady('first-scroll-intent')`
   - No animation delay—instant unlock

2. **2-Second Timeout Failsafe** (backup)
   - `APP_READY_TIMEOUT = 2000ms`
   - If user does not interact within 2s, app auto-unlocks
   - Prevents indefinite waiting

3. **JavaScript Error Handler** (safety)
   - Global `window.error` listener
   - Any JS error during startup triggers immediate unlock
   - Ensures broken animation code can't trap the page

4. **Promise Rejection Handler** (safety)
   - `unhandledrejection` listener
   - Async errors also trigger unlock
   - Covers fetch failures, async bugs, etc.

5. **Reduced Motion Preference** (accessibility)
   - Detects `prefers-reduced-motion: reduce`
   - Skips animations entirely and immediately unlocks
   - Respects user preferences

## `forceAppReady()` Function

Central unlock routine that **atomically** transitions the app to interactive state:

### Scroll Management
```javascript
unlockScroll() // iOS-safe: restores position, removes fixed positioning
```

### Content Visibility
```javascript
contentOverlay.style.transition = 'none';      // Disable animation
contentOverlay.style.transform = 'translateY(0)'; // Slide into view
contentOverlay.style.opacity = '1';            // Fully visible
contentOverlay.style.pointerEvents = 'auto';   // Enable clicks
```

### Splash Element Disabling
```javascript
// Disable pointer-events on all splash layers so they can't block interaction
splashEls = [brand-container, scroll-indicator, title, subtitle, keyboardHint]
splashEls.forEach(el => el.style.pointerEvents = 'none')
```

### Hero Element Cleanup
```javascript
mainTitle.style.transform = '';  // Remove scale
mainTitle.style.filter = '';     // Remove blur
mainTitle.style.opacity = '0.2'; // Fade to background
```

### Navbar Activation
```javascript
navbar.classList.remove('-translate-y-full', 'opacity-0');
navbar.classList.add('translate-y-0', 'opacity-100', ...);
navbar.style.pointerEvents = 'auto'; // Explicitly enable clicks
```

### Cleanup
- Removes all event listeners (wheel, touch, keydown)
- Clears timeout timer
- Removes global error handlers (they're no longer needed)

## Why This Works on Desktop & Mobile

### Desktop
- Wheel events trigger immediate unlock
- Keyboard navigation (arrow keys, space) also triggers
- Timeout ensures unlock even if user doesn't interact

### Mobile (iOS/Android)
- Touch events (`touchstart`) trigger unlock
- Pointer events (`pointerdown`) also work
- iOS-safe scroll lock (position: fixed) prevents Safari quirks
- Timeout handles cases where touch events are suppressed

### Edge Cases Covered
- **Animation hangs/freezes**: Timeout unlocks after 2s
- **JS errors**: Error handler forces unlock
- **No scroll capability**: Timeout handles it
- **Multiple rapid events**: `appReady` flag prevents re-entry
- **Reduced motion users**: Skip directly to unlock
- **Accessibility tools**: Keyboard navigation triggers unlock

## Testing the Mechanism

### Manual Tests
1. **Normal flow**: Scroll/touch → immediate unlock
2. **Timeout test**: Load page, don't touch → unlocks at 2s
3. **Error test**: Add syntax error → page still becomes interactive
4. **Reduced motion**: Enable OS setting → instant unlock
5. **Mobile**: Test on iOS Safari and Chrome (Android)

### Console Logging
`forceAppReady()` logs the trigger reason:
```
App ready: first-scroll-intent
App ready: timeout-failsafe
App ready: error-handler
App ready: reduced-motion
```

## Configuration

### Adjust Timeout
```javascript
const APP_READY_TIMEOUT = 2000; // Change to 1500, 3000, etc.
```

Lower = faster unlock, less time to see splash  
Higher = more time for user to see splash, but delayed unlock

## Architecture Benefits

✅ **Single responsibility**: `forceAppReady()` is the only function that sets `appReady = true`  
✅ **Idempotent**: Can call multiple times safely (early exit if already ready)  
✅ **Fail-safe by default**: Multiple independent triggers ensure unlock happens  
✅ **No animation dependency**: Unlock is instant, not tied to CSS transitions  
✅ **Observable**: Console logs make debugging easy  
✅ **Cleanup-safe**: Removes listeners and timers to prevent memory leaks

## Summary

**The app will ALWAYS become interactive within 2 seconds, no exceptions.**

- First user interaction: instant unlock
- No interaction: 2s timeout unlock
- JS error: immediate unlock
- Accessibility need: instant unlock

Animations are preserved but never block functionality.
