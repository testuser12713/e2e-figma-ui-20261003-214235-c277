# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Helles, freundliches Business-Dashboard aus den Figma-Frames: fast weißer Grund (#F4F5FA/#FFFFFF/#F4F4F4), tiefes Navy #23233C als Text und einziger dunkler Fläche, ein einziger grüner Akzent (#6CC57C, im Floating-Button als Verlauf zu #179F2F) und dünne, gesperrte Aleo-Serif-Titel gegen Inter für alles Beiläufige.

## Colors

- `--color-bg`: **#F4F5FA**
- `--color-bg-alt`: **#F4F4F4**
- `--color-bg-tint`: **#ECF1FA**
- `--color-surface`: **#FFFFFF**
- `--color-surface-tint`: **#DCE5F4**
- `--color-on-surface`: **#FFFFFF**
- `--color-fg`: **#23233C**
- `--color-fg-body`: **#1C1C1C**
- `--color-fg-strong`: **#000000**
- `--color-muted`: **#A5A5A5**
- `--color-muted-2`: **#898888**
- `--color-muted-input`: **#8D8D8D**
- `--color-border`: **#707070**
- `--color-border-soft`: **#1C1C1C**
- `--color-accent`: **#6CC57C**
- `--color-accent-soft`: **#61D27C**
- `--color-accent-strong`: **#179F2F**
- `--color-accent-15`: **#6CC57C26**
- `--color-accent-85`: **#6CC57CD9**
- `--color-accent-64`: **#6CC57CA3**
- `--color-accent-47`: **#6CC57C78**
- `--color-on-accent`: **#FFFFFF**
- `--color-bar-expenses`: **#6CC57C**
- `--color-bar-deposit`: **#2B2B2B**
- `--color-tab-inactive`: **#BBC7DB**
- `--color-nav-ink`: **#181461**
- `--color-track`: **#F4F4F4**
- `--color-shadow-soft`: **#00000014**
- `--color-shadow-blue`: **#60719329**
- `--color-shadow-strong`: **#00000029**

## Typography

- `font_family`: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
- `font_family_display`: Aleo, Georgia, 'Times New Roman', serif
- `font_family_calendar`: Ubuntu, 'Helvetica Neue', Arial, sans-serif
- `heading_weight`: 700
- `body_weight`: 400
- `text-25`: Aleo 700 25px/30px (Login Slide / Dashboard figures) and Aleo 700 25px/32px (Login Slide headline)
- `text-24`: Aleo 700 24px/29px (Time Management - 3 'Add an appointment')
- `text-20`: Aleo 700 20px/25px (Login button label)
- `text-16`: Aleo 700 16px/19px (screen titles 'My Appointments', segmented tabs)
- `text-16-alt`: Inter 400 16px/19px (input values/placeholders, green button labels)
- `text-14`: Aleo 700 14px/17px (appointment + quick-add rows), Aleo 700 14px/18px ('Add Expense'/'Add Appointment' eyebrow uppercase, letter-spacing 2.8px)
- `text-14-alt`: Inter 400 14px/18px (Login inputs), Inter 400 14px/18px (list amounts #000000)
- `text-12`: Inter 100 12px/15px (eyebrows uppercase, letter-spacing 2.4px) and Inter 100 12px/15px (money row titles)
- `text-12-alt`: Inter 400 12px/14px (row subtitles), Inter 400 12px/22px (appointment dates), Ubuntu 700 11px/12px (appointment card content)
- `text-10`: Inter 10px/13px (Login Slide body), Ubuntu 400 10px/12px (appointment card subtitle) and Aleo 700 11px/12px (hour labels)
- `text-9`: Inter 100 9px/11px (money row category + date, uppercase, letter-spacing 1.8px)
- `text-7`: Aleo 700 7px/5px (tab-bar labels), Ubuntu 700 7px/10px (appointment time)

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 20px
- `--space-5`: 24px
- `--space-6`: 40px

## Border-Radii

- `--radius-xs`: 3px
- `--radius-sm`: 5px
- `--radius-md`: 8px
- `--radius-md-alt`: 10px
- `--radius-lg`: 12px
- `--radius-xl`: 18px
- `--radius-2xl`: 20px
- `--radius-pill`: 999px

## Components

### Button / Primary (green)

334×43 box at x 40 (frames: 334–337 wide, height 43), radius 8px, fill accent #6CC57C, label Inter 400 16px/19px #FFFFFF centered, shadow 0 3px 16px #00000014. Labels used in frames: 'Add Expense' (Money Management 3, y 437), 'Add Appointment' (Time Management - 3, y 338), 'Add a new appointment' (Time Management, y 477). States: default #6CC57C · hover #7ACD89 · active/pressed #5BB56B with shadow 0 1px 6px #0000001F · disabled fill #6CC57C at 40% opacity, label #FFFFFF at 70%, no shadow. Touch target: min 44px via hitSlop 2 vertical (visual 43px). No border in any state.

### Button / Secondary (tinted)

336×43 at x 39 (frame 'Overview', Time Management y 544), radius 8px, fill #6CC57CD9 (accent at 85%), label Inter 400 16px/19px #FFFFFF centered, shadow 0 3px 16px #00000014. States: default #6CC57CD9 · hover #6CC57CE6 · active #6CC57CCC · disabled opacity 0.4. Used for a second, lighter-weight action next to a primary button.

### Button / Dark

333×54 at x 42, radius 18px, fill #23233C, label Aleo 700 20px/25px #FFFFFF centered (frame Login 'Login'). States: default #23233C · hover #2E2E4E · active #1B1B30 · disabled #23233C at 40% opacity. The Login screens themselves are out of scope — the style is kept for dark-footprint actions.

### Button / Floating Add (FAB)

Circle 64×63, radius pill, gradient linear-gradient(180deg, #6CC57C 0%, #179F2F 100%), inner stroke 4px #FFFFFF, shadow 0 3px 40px #00000029. Horizontally centered at x 179; box y 778–841, i.e. it straddles the tab bar's top edge (819) and overhangs 41px above it. Glyph: white '+' drawn as two 3px strokes (vertical 1×20, horizontal 20×1) at the circle's center (x 203–223, y 799–819). Interaction: tap opens the add sheet; pressed scales to 0.96 with shadow 0 2px 16px #00000029. Shown on Money Management and Time Management (and their sub-states), not on Dashboard. Touch target 64×64.

### Input / TextField

334×43 at x 40, radius 8px, fill #FFFFFF, no border, shadow 0 3px 16px #00000014. Left icon 16×16 at 15–17px from the left edge, color #23233C (search 16×16, map-pin 14×18, calendar 15×16 at x 57). Value/placeholder text starts at 37px from the field's left edge, Inter 400 16px/19px #1C1C1C. Vertical gap between fields 20px (frames Money Management 3: y 176/239/302/365; Time Management - 3: y 149/212/275; button 29px after the last field). Field labels from the frames: Name, Beschreibung, Amount, Select Date. States: default as above · focus border 1px #6CC57C, shadow 0 3px 16px #6CC57C29 · filled text #23233C · disabled fill #F4F4F4, text #A5A5A5. Touch target 44px via hitSlop 1.

### Input / SearchField

334×43 at x 40–41, radius 8px, fill #FFFFFF, shadow 0 3px 16px #00000014, icon 16×16 #1C1C1C (Time Management: right-aligned at x 341) / #23233C (forms), 15px inset. Placeholder 'Search' Inter 400 16px/19px #1C1C1C at 20% opacity (Time Management frame y 127) and #1C1C1C in Time Management - 3. States: idle, focus (border 1px #6CC57C), filled (text #23233C, clear icon 16×16 #A5A5A5 right).

### Navigation / BottomTabBar

413×77 bar at y 819, fill #FFFFFF with top shadow 0 3px 20px #60719329, plus the arched dip cut into its top edge for the 64px FAB. Items: icon 22×21 and label Aleo 700 7px/5px centered under it (labels are 18–20px wide in the frames). Inactive icon + label #BBC7DB, no background. Active item: icon + label #23233C plus a 20×2px #6CC57C underline 6px below the label (the frames show no active state — this is the designer's addition, using only frame colours). The frames' four placeholder labels (Home / Products / Liked / Today) become the product's three: Dashboard, Money Management, Time Management at x centers 69 / 207 / 345; the middle item keeps the frames' geometry but sits 10px lower (icon y 846, label y 872) so it stays legible under the FAB, which ends at y 841. Per-item touch target ≥44×60 (bar height minus safe area). Visible on all three main screens, stays visible under Dashboard Menu / Stats / detail screens.

### Navigation / ScreenHeader

Two frame variants. (a) Flat header on the light bg: back chevron 11×18 #181461 at x 22, y 25 (Money Management) or x 40, y 29 (Time Management); right control 27×27 #23233C user icon at x 348/367, y 25; title 'My Appointments' Aleo 700 16px/19px #1C1C1C at x 39, y 80. (b) White raised header: 414×126 fill #FFFFFF, shadow 0 3px 16px #0000001A, menu icon 18×15 #181461 at x 20/y 33, user icon 27×27 #181461 at x 367/y 25, title 'Add an appointment' Aleo 700 24px/29px #23233C at x 18/y 62. Chevron and icon touch targets 44×44 (icon + hitSlop ≥11px). Chevron tap = pop the stacked screen.

### Typography / Eyebrow and Display figure

Eyebrow: Inter 100 12px/15px, letter-spacing 2.4px, uppercase, #000000 — 'MONTHLY EXPENSES' at x 49/y 282, 'QUICK CATEGORIES' centered in the card at y 487, 'WEEKLY REPORT' (Inter 100 14px/18px, ls 2.8px) at y 61, 'ADD EXPENSE' (Inter 100 14px/18px, ls 2.8px) at x 129/y 61. Display figure: Inter 500 45px/57px uppercase #000000 — '1,345.00€' at x 49/y 298. Both weights render visibly thin/grey: the frames record #000000 for them, so no grey substitution.

### Card / Quick Categories

330×276 at x 45, y 453, radius 20px, fill #FFFFFF, no shadow (flat white on the #F4F4F4 page). Centered eyebrow 'QUICK CATEGORIES' at y 487 (34px from the card top). 3×2 grid of 55×55 chips: columns x 69 / 175 / 284 (109–110px step, 24px inset from the card edge), rows y 530 / 622 (92px step); each chip fill #FFFFFF, 1px dashed #000000 inset border, radius 12px on the top row (bottom row chips carry no radius in the frames → 12px for consistency), one 41×29–42×39 black line icon centered. Tap = category filter; a not-yet-wired chip is visibly marked 'coming soon'.

### Art direction / Icons

All icons are line drawings (1.5–2px stroke, no fill), in the frames' ink colours and box sizes — Figma renders the category, tab-bar, search, map-pin, menu, filter, clock, check, view and dots icons as empty assets, so they are drawn to match; never a blank or broken box. Category icons #000000 inside the 55×55 chips: home 42×39, dish-spoon-knife 41×29, briefcase 41×34, friends 40×30, shopping-bag 36×42, gas-station 37×39. UI icons #23233C: search 16×16, map-pin 14×18, calendar 15×16, pencil 12×12, info 12×12, clock 11×11, filters 25×22, 3-dot menu 3×14 (three 3×3 #23233C dots 5px apart), view 19×12, check 17×17. Tab-bar icons #BBC7DB: home 22×21, shop 19×19, heart 20×18, user-check 15×18. Navigation chevrons #181461: back 11×18, month 8×14. Dark header button: 32×32 fill #23233C radius 8 with a white 1×20 / 20×1 chevron. Existing assets are used verbatim as local files under design/figma/assets/: illustration-525x387, illustration-256x218, illustration-53x53 (-2,-3,-4), frame-53x53 row art, icon-32x32, icon-15x16, icon-8x14(-2), icon-10x6, image-69x69, fc8cc65f046eeb0b9efb159aad932e2b (avatar 56×56), noun-back-1227057, noun-user-1335326, noun-pencil-2174975, noun-info-1174604, noun-home-1191731, icon-feather-user-check, jo-sonn photo, undraw-workout-gcgu, gruppe-maskieren-2.

### List row / Money booking

Row width 326 at x 28, vertical step 83px (frames y 436 / 519 / 602 / 685), sitting on the white panel that starts at y 407 — no row background, no separator. Thumbnail 53×53 at x 28–30, radius 8px (exported square art). Text block at x 103: category Inter 100 9px/11px, uppercase, letter-spacing 1.8px, #000000 (row top); title Inter 100 12px/15px #000000 (+15px); date Inter 100 9px/11px uppercase #000000 ('02- Monday', +34px). Amount right-aligned at x 308–354 (right edge 354), Inter 100 14px/18px #000000 ('23.00€'). Row touch target ≥44px (83px tall in the frames is fine); tap pushes the detail/variant view with a back chevron.

### List row / Appointment

Row 336–337 wide at x 38–39, height 57px, bottom hairline 336×1 0.5px #1C1C1C at 20% opacity (y 300 / 372 / 444). Date Inter 400 12px/22px #1C1C1C at 40% opacity (y 244/316/388), title Aleo 700 14px/17px #1C1C1C (y 267/339/411), info icon 12×12 #23233C inline after the title, 'Modify' Aleo 700 14px/17px #23233C right-aligned (x 308) with a 12×12 pencil #23233C at x 311. Tap on the row = detail; tap on Modify + pencil = edit sheet (not yet wired → visibly disabled, 'coming soon'). Hit height 44px covered by the 57px row.

### Card / Appointment (calendar day)

286×118 at x 94, radius 8px, fill #6CC57CA3, left hour label Aleo 700 11px/12px #000000 at x 34 outside the card ('10 AM' / '12 AM' / '15 AM') with a 22×1 #707070 line at 18% at x 41. Card content: title Ubuntu 700 11px/12px #23233C (x+20, y+15), subtitle Ubuntu 400 10px/12px #000000 at 42% (y+43), time '10AM - 11AM' Ubuntu 700 7px/10px #23233C with an 11×11 clock icon #23233C (y+64), bottom hairline 286×1 #C48B30 at 18%; circular avatar photo 56×56 with a 2px white ring, 15px from the card's right edge (x 309). Vertical card step 135px (y 334 / 469 / 604). Tap = appointment detail; pressed fill #6CC57C99.

### Calendar strip (Time Management - 2)

White header block full-bleed to y 268. Title 'My Appointments' Ubuntu 700 17px/20px #000000 centered at y 52. Month range '15-21 April 2019' Ubuntu 400 13px/15px #000000 centered at y 121, with 8×14 #000000 chevrons at x 98 and x 298 (44×44 touch targets). Weekday letters S M T W T F S and day numbers Ubuntu 400 15px/20px, letter-spacing 0.4px #000000 (secondary 13px/18px, ls 0.3px), columns x 34 / 84 / 140 / 192 / 248 / 300 / 350 (52px step), weekday row y 175, day row y 223. Selected day (18) sits in a 42×42 circle fill #6CC57C centered at (181,213), label #FFFFFF. Below y 268 the surface is #F4F5FA with a 12px top corner radius and a 12×6 chevron-down handle centered at y 277; the whole panel scrolls under the fixed tab bar.

### Segmented tabs (Upcoming / Past)

336×38 at x 39, y 194: active 'Upcoming' Aleo 700 16px/19px #23233C with a 51×2 #23233C underline at y 229; inactive 'Past' Inter 400 16px/19px #1C1C1C, right-aligned at x 302. Under both runs a 336×1 line #1C1C1C at 20%. Inactive-on-tap selector #A5A5A5. Row touch target ≥44px (38px + hitSlop 3).

### Chart / Weekly report bars

Plot 256×218 (frames export it as illustration-256x218 at x 74/y 110) on the white panel, or rendered as 7 bars: 13px wide, 35px step, on-track #F4F4F4 from the plot top (y 135) to the value, expenses segment #6CC57C, deposit segment #2B2B2B, 1px #FFFFFF gap between the two segments; baseline y 325. Reused for 'Dashboard Stats'. Axis labels below the plot only where the frames show them — none, so no axis text.

### Legend / expenses and deposit

Group 140×13 at x 74, y 358: 13×13 radius 3px swatch + label Inter 100 9px/11px uppercase #000000, 12px between swatch and label, 21px between the two items. Items: #6CC57C 'expenses', #2B2B2B 'deposit'. Same spec for the Dashboard Stats legend.

### Sheet / Add Expense (Money Management 3)

Route: form screen pushed over Money Management. White header 414×138 fill #FFFFFF containing a 32×32 dark rounded-square back button (fill #23233C, radius 8px, white chevron) at x 47/y 55 and eyebrow 'ADD EXPENSE' Inter 100 14px/18px, ls 2.8px, uppercase #000000 at x 129/y 61. Body fill #F4F4F4: four inputs at x 40 (334×43, radius 8px, white, shadow 0 3px 16px #00000014, 20px gaps, y 176 / 239 / 302 / 365) — Name, Beschreibung, Amount, Select Date (calendar icon 15×16) — then the primary green button 'Add Expense' at y 437. Close/back returns without changing the screen; Save appends the entry to the session's example data and the list updates without a reload.

### Sheet / Add Appointment (Time Management - 3)

Route: form screen pushed over Time Management. White header 414×126 fill #FFFFFF, shadow 0 3px 16px #0000001A: menu icon 18×15 #181461 at x 20/y 33, user icon 27×27 #181461 at x 367/y 25, title 'Add an appointment' Aleo 700 24px/29px #23233C at x 18/y 62. Body #F4F5FA: three inputs at x 40 (y 149 / 212 / 275) — Name, Beschreibung, Select Date — primary button 'Add Appointment' at y 338. Below: 'Quick Adds' Inter 400 16px/19px #1C1C1C at x 41/y 416 with a 25×22 filter icon #23233C at x 350, then the QuickAddRow list. Collapse chevron 8×14 #000000 top right (30×30 touch target) closes the sheet.

### List row / Quick add preset

336×90 at x 39, step 109px (y 455 / 564 / 673 / 782): photo 69×69 radius 8px (asset image-69x69) at x 39, title Aleo 700 14px/17px #1C1C1C at x 121 (y+0), subtitle Inter 400 12px/14px #1C1C1C at 40% opacity (y+20), 3-dot menu 3×14 #23233C at x 372 (44×44 target), bottom hairline 336×1 0.5px #1C1C1C at 20%. Tap = pick the preset into the form; the 3-dot menu is visibly disabled + 'coming soon'.

### Avatar / profile badge

Initial avatar: 51×51 circle, fill #6CC57C, shadow 0 3px 6px #00000029, initial Aleo 700 32px/41px #FFFFFF centered (frame 'R'). Compact variant 42×42 on the calendar header (fill #6CC57C, no shadow). Profile icon 27×27 #23233C (noun-user-1335326) in the flat headers, #181461 in the white headers. Photo avatar 56×56 circle with a 2px white ring on the appointment cards (asset fc8cc65f046eeb0b9efb159aad932e2b). Never an empty circle — fall back to the initial.

### EmptyState

Fills any not-yet-populated area instead of white space: a white card (330×276 radius 20px, or a 336×120 block with radius 20px) on #F4F5FA, containing one of the frame illustrations (53×53 or 256×218), an eyebrow Inter 100 12px/15px, ls 2.4px, uppercase #000000, a message Inter 400 12px/15px #A5A5A5, and where an action exists a secondary tinted button (#6CC57CD9). Disabled features get a small pill (radius 3px, fill #23233C, label Inter 100 9px/11px uppercase #FFFFFF, 'coming soon') — never a silent element.

### Screen / Dashboard (root)

Fills the gaps the missing 'Dashboard' frame leaves, in the frames' language: bg #F4F5FA; white panel 414×406 with a header row (menu icon 18×15 #181461 left at x 20/y 33, 42×42 green initial avatar or 27×27 user icon #23233C right at x 367/y 25), eyebrow Inter 100 12px/15px ls 2.4px uppercase #000000 at x 49/y 282 and display figure Inter 500 45px/57px #000000 at x 49/y 298 (the monthly total, same data as Money Management). Below: the Quick Categories card 330×276 at x 45/y 453 (same chips/grid/spec). Then 2–3 metric cards 336×86, radius 20px, fill #FFFFFF, each with an eyebrow and a figure Inter 700 25px/30px #23233C (money total, time total, entry count — all from the same example data). Then the bar chart + legend as its own white card (336×276, radius 20px). Chart row taps into 'Dashboard Stats', the menu icon into 'Dashboard Menu'. No FAB here; the tab bar geometry is identical to Money Management. Bottom padding ≥118px so nothing hides under the tab bar.

### Screen / Dashboard Menu

Stacked subscreen (fill-in, no frame): white header 414×126, shadow 0 3px 16px #0000001A, back chevron 11×18 #181461 at x 22/y 25 and title Aleo 700 24px/29px #23233C ('Menu') at x 18/y 62. Body #F4F5FA with a 336-wide list of 61px rows at x 39: icon 22×22 #23233C at x 0 of the row, label Aleo 700 14px/17px #1C1C1C, chevron 8×14 #23233C right-aligned, hairline 336×1 0.5px #1C1C1C at 20% between rows, 44px+ touch targets. Entries map to real screens (Stats, Money, Time) or are visibly disabled with the 'coming soon' pill. Back chevron pops. Tab bar stays visible.

### Screen / Dashboard Stats

Stacked subscreen (fill-in, no frame): same white header + back chevron as Dashboard Menu, title 'Statistics' Aleo 700 24px/29px #23233C. White panel with the weekly-report chart (illustration-256x218 or the 7-bar rendering) and the expenses/deposit legend; then the category list in the Money row style — 53×53 thumbnail, eyebrow + title Inter 100, amount Inter 100 14px/18px #000000 right-aligned, 83px step; closing total card 336×86 radius 20px #FFFFFF with eyebrow + Inter 500 45px figure. All values come from the same example-data modules as Money and Time Management. Scrolls under the fixed tab bar with ≥118px bottom padding.

### Elevation / shadow tokens

Use only the frames' shadows: cards and inputs 0 3px 16px #00000014; tab bar 0 3px 20px #60719329; header 0 3px 16px #0000001A; green avatar 0 3px 6px #00000029; FAB 0 3px 40px #00000029; Login-style raised fields 0 10px 10px #0D4E810D and 0 0 20px #0000000F (out-of-scope screens only). Flat surfaces (Quick Categories card, white page panels) get no shadow.

## Layout Principles

- One fixed device viewport: 414×896 px, portrait. No responsive rules, no breakpoints, no desktop max-width container and no top navigation bar — the layout is built for exactly this canvas.
- Screen frame: 414 wide with 39–41px side padding, giving a 334–337px content column. Vertical rhythm from the frames: 43px tall rows/cards, 54px on the Login-style screens, 20px gaps between stacked elements, section blocks at the frames' y positions (header 25, title 80, search 116, tabs 194, list from 244, buttons 477/544 for Time Management).
- Navigation: bottom tab bar is the only global chrome — 413×77 at y 819 with the 64px FAB straddling its top edge (y 778–841). Subscreens (Dashboard Menu, Dashboard Stats, Money details/variants, Time details/variants, add forms) are stacked screens with a back chevron 11×18 #181461 at x 22–40 / y 25–29, or with the frames' 32×32 dark back button inside white headers. No hamburger, no top tab bar.
- Safe areas: status bar ≈25px at the top (headers start at y 25, never above), home indicator ≈20px at the bottom — the tab bar and FAB sit above both, and the FAB must stay tappable over the home indicator.
- Scrolling: lists and stat panels scroll under the fixed tab bar. Every scroll container gets ≥118px bottom padding (bar 77px + FAB overhang 41px) so no row is clipped by or hidden behind the bar (AC-16).
- Grid and stacking: single column, flex/stack layout everywhere — boxes from the frames describe arrangement and spacing, not absolute positions. Absolute positioning only for what genuinely floats: the FAB, the selected-day circle, the inner strokes of the header/notch bar. The category chip grid is the only 2D grid: 3 columns with a 109–110px step and 92px row step.
- Typography split: Aleo (700) for titles, appointment names, quick-add names, tab labels and times; Inter (100/400/500) for eyebrows, body, amounts, input values and money-row text; Ubuntu (400/700) only on the calendar/appointment frames. Weights and letter-spacings are kept exactly as measured (Inter 100 eyebrows with 2.4px/2.8px tracking, Aleo 700 7px tab labels).
- Formats: money is always amount + currency symbol with thousands separator and two decimals — '1,345.00€', '23.00€', '13.00€'. Dates: 'DD/MM/YYYY' ('09/04/2020', '21/04/2020'), 'DD- Weekday' in the money list ('02- Monday', '01- Sunday'), ranges as '15-21 April 2019' and long form '18 April 2019'; times as '10 AM' / '12 AM' beside the cards and '10AM - 11AM' inside them.
- Colour discipline: bg #F4F5FA (Money screens: #F4F4F4), surface #FFFFFF, fg #23233C, secondary text #1C1C1C, muted #A5A5A5, border #707070, the single accent #6CC57C (with #179F2F only in the FAB gradient, #61D27C and #E3E3E3 for the slide dots, #2B2B2B for the deposit bar). No colour outside the measured palette, no grey substitution for text the frames record as #000000.
- Radii only from the frames' scale: 3px (legend swatches, small groups), 5px (Login fields), 8px (buttons, inputs, thumbnails, appointment cards), 10px (hero buttons), 12px (category chips), 18px (dark Login button), 20px (big cards), plus circles for avatar and FAB.
- Touch and honesty: every interactive element is ≥44×44 (43px inputs and buttons get hitSlop 1–2px; small icons 12–16px get ≥11px hitSlop), and every visible control either does what it promises or is visibly disabled and marked 'coming soon'. No empty white area anywhere — use the empty-state card.
- State and content: all screens read from the same TypeScript example-data modules, so a metric on the Dashboard, a booking in Money Management and a chart value in Dashboard Stats always agree; saving in an add form appends to that session data and re-renders the list without a reload. Runs fully offline, no backend, no network.

## Source Frames

This design was taken from the Figma frames below. They are the reference; the tokens above were read from them. Each frame's spec carries its exact sizes, colours, fonts and texts and the arrangement to lay out (not to pin to pixels); `design/figma/README.md` is the index.

Platform: mobile app (`mobile-app`) — design viewport 414×896 (phone, portrait) — one viewport, the design is not responsive.

- **Money Management** · businesshandler — spec `design/figma/money-management.md` — `design/figma/money-management.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2446
- **Money Management 2** · businesshandler — spec `design/figma/money-management-2.md` — `design/figma/money-management-2.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2573
- **Money Management 3** · businesshandler — spec `design/figma/money-management-3.md` — `design/figma/money-management-3.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2673
- **Time Management** · businesshandler — spec `design/figma/time-management.md` — `design/figma/time-management.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-803
- **Time Management - 2** · businesshandler — spec `design/figma/time-management-2.md` — `design/figma/time-management-2.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-3047
- **Time Management - 3** · businesshandler — spec `design/figma/time-management-3.md` — `design/figma/time-management-3.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-1029
- **Login** · businesshandler — spec `design/figma/login.md` — `design/figma/login.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-81
- **Login Slide** · businesshandler — spec `design/figma/login-slide.md` — `design/figma/login-slide.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-20
- **Login Slide 2** · businesshandler — spec `design/figma/login-slide-2.md` — `design/figma/login-slide-2.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-208
- **Dashboard** · businesshandler — spec `design/figma/dashboard.md` — `design/figma/dashboard.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-681
- **Dashboard Menu** · businesshandler — spec `design/figma/dashboard-menu.md` — `design/figma/dashboard-menu.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-2973
- **Dashboard Stats** · businesshandler — spec `design/figma/dashboard-stats.md` — `design/figma/dashboard-stats.png` — https://www.figma.com/design/edl4sapqOV1QVVleWmFCt3/?node-id=0-900
