# QA Checklist

## Audio System
- [ ] Fix TypeScript warning: `webkitAudioContext` fallback (line 389)
- [ ] Section detection not triggering reliably on all scroll positions
- [ ] Transitions between sections too abrupt / not smooth enough
- [ ] Add fade-in on initial play (currently pops)
- [ ] Consider adding subtle noise/texture layer for warmth
- [ ] Volume levels may need balancing across sections
- [ ] Test on mobile browsers (audio context restrictions)
- [ ] Add visual feedback showing current "mood" or section
- [ ] Consider adding optional nature sounds (wind, leaves) as secondary layer
- [ ] Oscillator frequencies could be more musical / harmonically related

## Visual
- [ ] Test silhouette visibility across different screen sizes
- [ ] Verify parallax doesn't cause jank on lower-end devices
- [ ] Check particle performance on mobile

## Content
- [ ] Refine philosophical text/quotes
- [ ] Consider adding more sections or expanding existing ones
- [ ] Source accurate quotes or write original reflections

## Accessibility
- [ ] Add reduced-motion media query support
- [ ] Ensure sufficient color contrast
- [ ] Screen reader testing
