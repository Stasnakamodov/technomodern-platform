# TECHNICAL SPECIFICATION: Desktop HeroSection Component

## FILE LOCATIONS
- Primary Component: `/Users/user/Downloads/code/components/desktop/HeroSection.tsx`
- Search Component: `/Users/user/Downloads/code/components/header-search.tsx`
- Styles Reference: `/Users/user/Downloads/code/app/globals.css`

---

## 1. HEROSECTION DESKTOP CONTAINER

### 1.1 Main Section Element
**Component**: `<section>` wrapper (line 65)
**CSS Classes**: `relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-6 py-24`

**Style Breakdown**:
- `relative`: Positioning context for absolute elements
- `min-h-[90vh]`: Minimum height of 90% viewport height
- `flex items-center justify-center`: Flexbox centering (both axes)
- `bg-gradient-to-br`: Gradient from top-left to bottom-right
  - Start: `from-background` (oklch(1 0 0) = white)
  - Middle: `via-background` (oklch(1 0 0) = white)
  - End: `to-primary/5` (oklch(0.55 0.25 300) at 5% opacity = very light purple)
- `px-6`: Horizontal padding = 1.5rem (24px)
- `py-24`: Vertical padding = 6rem (96px)

---

## 2. BACKGROUND DECORATIVE GEOMETRY

### 2.1 Geometric Border Container
**Component**: `<div>` absolute (line 66-75)
**CSS Classes**: `absolute inset-0 flex items-center justify-center pointer-events-none`

**Style Breakdown**:
- `absolute`: Positioned absolutely
- `inset-0`: All sides = 0 (covers entire section)
- `flex items-center justify-center`: Centers child elements
- `pointer-events-none`: Decorative layer doesn't interact with mouse

### 2.2 Five Nested Rotated Borders (Decorative Rings)

#### Border Ring 1 (Outermost)
**Line**: 69
**Classes**: `absolute w-[2200px] h-[2200px] border-2 border-muted/25 rotate-45 rounded-[220px]`

**Properties**:
- Dimensions: 2200px × 2200px
- Border: 2px solid
- Color: `border-muted/25` = oklch(0.97 0 0) at 25% opacity (light gray, very subtle)
- Rotation: 45 degrees
- Border Radius: 220px (creates rounded square effect)

#### Border Ring 2
**Line**: 70
**Classes**: `absolute w-[1800px] h-[1800px] border-2 border-muted/20 rotate-45 rounded-[180px]`

**Properties**:
- Dimensions: 1800px × 1800px
- Border: 2px solid
- Color: `border-muted/20` = oklch(0.97 0 0) at 20% opacity (slightly darker gray)
- Rotation: 45 degrees
- Border Radius: 180px

#### Border Ring 3
**Line**: 71
**Classes**: `absolute w-[1400px] h-[1400px] border-2 border-primary/15 rotate-45 rounded-[140px]`

**Properties**:
- Dimensions: 1400px × 1400px
- Border: 2px solid
- Color: `border-primary/15` = oklch(0.55 0.25 300) at 15% opacity (very light purple)
- Rotation: 45 degrees
- Border Radius: 140px

#### Border Ring 4
**Line**: 72
**Classes**: `absolute w-[1000px] h-[1000px] border-2 border-primary/20 rotate-45 rounded-[100px]`

**Properties**:
- Dimensions: 1000px × 1000px
- Border: 2px solid
- Color: `border-primary/20` = oklch(0.55 0.25 300) at 20% opacity (light purple)
- Rotation: 45 degrees
- Border Radius: 100px

#### Border Ring 5 (Innermost)
**Line**: 73
**Classes**: `absolute w-[600px] h-[600px] border-2 border-primary/25 rotate-45 rounded-[80px]`

**Properties**:
- Dimensions: 600px × 600px
- Border: 2px solid
- Color: `border-primary/25` = oklch(0.55 0.25 300) at 25% opacity (purple)
- Rotation: 45 degrees
- Border Radius: 80px

**Visual Effect**: Creates 5 concentric rotated squares with rounded corners, progressively smaller, creating a geometric diamond/square pattern centered behind all content.

---

## 3. CONTENT CONTAINER

### 3.1 Max-Width Wrapper
**Component**: `<div>` (line 77)
**Classes**: `max-w-7xl mx-auto w-full relative z-10`

**Properties**:
- `max-w-7xl`: Maximum width = 80rem (1280px)
- `mx-auto`: Horizontally centered
- `w-full`: Full width (responsive)
- `relative`: Positioning context
- `z-10`: Above decorative background (z-index: 10)

### 3.2 Text Content Wrapper
**Component**: `<div>` (line 78)
**Classes**: `max-w-4xl mx-auto text-center space-y-8`

**Properties**:
- `max-w-4xl`: Maximum width = 56rem (896px)
- `mx-auto`: Horizontally centered
- `text-center`: Center aligned text
- `space-y-8`: Vertical spacing between children = 2rem (32px)

---

## 4. HEADLINE TEXT

### 4.1 Main Heading
**Component**: `<h1>` (line 79)
**Classes**: `text-7xl font-bold leading-tight`

**Properties**:
- `text-7xl`: Font size = 4.5rem (72px)
- `font-bold`: Font weight = 700
- `leading-tight`: Line height = 1.25

**Content Structure**:
```
"Помогаем селлерам закупать у "
<span className="text-primary block">зарубежных поставщиков</span>
```

**Span Properties**:
- `text-primary`: Color = oklch(0.55 0.25 300) (purple)
- `block`: Display as block element (line break before and after)

**Visual Effect**: Last line of headline breaks to new line in purple color.

---

## 5. SUBHEADING TEXT

### 5.1 Description Paragraph
**Component**: `<p>` (line 83)
**Classes**: `text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed`

**Properties**:
- `text-2xl`: Font size = 1.5rem (24px)
- `text-muted-foreground`: Color = oklch(0.556 0 0) (mid-gray)
- `max-w-2xl`: Maximum width = 42rem (672px)
- `mx-auto`: Horizontally centered
- `leading-relaxed`: Line height = 1.625

**Content**: 
"Для продавцов на Ozon, Wildberries и Яндекс Маркете. +100500 товаров · Собственная B2B сеть · CRM система"

---

## 6. SEARCH BAR AND BUTTONS CONTAINER

### 6.1 Flex Container
**Component**: `<div>` (line 87)
**Classes**: `flex flex-col items-center gap-6 pt-4 w-full max-w-2xl mx-auto`

**Properties**:
- `flex flex-col`: Flexbox, column direction
- `items-center`: Center horizontally
- `gap-6`: Gap between items = 1.5rem (24px)
- `pt-4`: Top padding = 1rem (16px)
- `w-full`: Full width
- `max-w-2xl`: Maximum width = 42rem (672px)
- `mx-auto`: Horizontally centered

### 6.2 Search Bar Container (Visible in Hero)
**Component**: `<div>` with ref (line 89-98)
**Ref**: `searchRef`

**Inline Styles**:
```javascript
{
  visibility: isSticky ? 'hidden' : 'visible',
  height: '56px'
}
```

**Classes**: `w-full`

**Behavior**:
- Height fixed at 56px (14 units in rem = 3.5rem)
- Visibility toggles on scroll (hidden when sticky)
- Contains `<HeaderSearch />` component

### 6.3 "Create Order" Button
**Component**: `<Link>` → `<Button>` (line 99-103)
**Link href**: `/catalog`
**Button Classes**: `text-lg px-8 py-6 bg-transparent`
**Button Props**:
- `size="lg"`: Large button size
- `variant="outline"`: Outline button style

**Button Text**: "Создать заказ" (Create Order)

**Styling**:
- `text-lg`: Font size = 1.125rem (18px)
- `px-8`: Horizontal padding = 2rem (32px)
- `py-6`: Vertical padding = 1.5rem (24px)
- `bg-transparent`: No background

---

## 7. STICKY SEARCH BAR (Fixed Position)

### 7.1 Fixed Container
**Component**: `<div>` (line 107-125)
**Classes**: `fixed top-0 left-0 right-0 z-40 px-6 py-3`

**Positioning**:
- `fixed`: Fixed viewport positioning
- `top-0`: Top = 0
- `left-0 right-0`: Full width
- `z-40`: Above content (z-index: 40)
- `px-6`: Horizontal padding = 1.5rem (24px)
- `py-3`: Vertical padding = 0.75rem (12px)

### 7.2 Inline Styles (Dynamic)
```javascript
{
  opacity: isSticky ? 1 : 0,                    // 0 = transparent, 1 = visible
  pointerEvents: isSticky ? 'auto' : 'none',    // Click disabled when hidden
  background: `rgba(255, 255, 255, ${0.8 + expandProgress * 0.2})`,
  backdropFilter: 'blur(12px)',
  boxShadow: `0 1px 3px rgba(0, 0, 0, ${0.1 + expandProgress * 0.05})`,
}
```

**Background Animation**:
- Opacity range: `0.8` to `1.0` (80% to 100%)
- `expandProgress` interpolates from 0 to 1 over 300px of scroll
- White background (`rgba(255, 255, 255)`) progressively becomes more opaque

**Blur Effect**:
- `backdropFilter: blur(12px)`: Background blur = 12px

**Shadow Animation**:
- Default: `0 1px 3px rgba(0, 0, 0, 0.1)` (subtle shadow)
- Maximum: `0 1px 3px rgba(0, 0, 0, 0.15)` (slightly darker shadow)

### 7.3 Inner Container (Width Animation)
**Component**: `<div>` (line 117-124)
**Classes**: `mx-auto`

**Inline Style**:
```javascript
{
  maxWidth: `${672 + (expandProgress * 400)}px`
}
```

**Width Animation**:
- Initial: 672px (42rem)
- Final: 1072px (672 + 400)
- Grows progressively as user scrolls past sticky point
- Same `expandProgress` value used for opacity

**Content**: `<HeaderSearch />` component

---

## 8. STATE VARIABLES (HeroSectionDesktop)

### 8.1 State Hooks
```typescript
const [isSticky, setIsSticky] = useState(false)          // Boolean: search bar stuck to top?
const [expandProgress, setExpandProgress] = useState(0)  // Number: 0-1, expansion progress
```

### 8.2 Refs
```typescript
const searchRef = useRef<HTMLDivElement>(null)          // Reference to original search container
const initialTopRef = useRef<number | null>(null)       // Initial scroll position (px)
```

---

## 9. SCROLL BEHAVIOR LOGIC

### 9.1 Initial Position Calculation
**Function**: `setInitialPosition()` (line 16-21)

**Behavior**:
1. Waits for component mount (100ms timeout at line 24)
2. Gets bounding rect of searchRef element
3. Calculates absolute position: `rect.top + window.scrollY`
4. Stores in `initialTopRef.current`
5. Only runs once (checks `initialTopRef.current === null`)

### 9.2 Scroll Event Handler
**Event**: `window.scroll` (line 26-47)
**Passive**: Yes (improves scrolling performance)

**Logic**:
```
IF scrollY >= stickyPoint:
  - Set isSticky = true
  - Calculate progress: min(scrollAfterSticky / 300, 1)
  - Progress interpolates from 0 to 1 over 300px
  - Set expandProgress = progress
ELSE:
  - Set isSticky = false
  - Set expandProgress = 0
```

**Variables**:
- `scrollY`: Current scroll position
- `stickyPoint`: initialTopRef.current (stored Y position of search bar)
- `scrollAfterSticky`: scrollY - stickyPoint (pixels scrolled after sticky point)
- `progress`: Normalized value 0-1 (capped at 1)

### 9.3 Resize Event Handler
**Event**: `window.resize` (line 49-53)

**Behavior**:
- Resets `initialTopRef.current = null`
- Recalculates initial position on next scroll

### 9.4 Event Listeners
**Lines**: 55-61

**Listeners**:
- `scroll` event (passive mode)
- `resize` event
- Cleanup removes both listeners on unmount

---

## 10. HEADERSEARCH COMPONENT STRUCTURE

### 10.1 Component Props
```typescript
interface HeaderSearchProps {
  onExpandChange?: (expanded: boolean) => void
  isSticky?: boolean
}
```

**Accepted by HeroSection**: Only `onExpandChange` is technically passed implicitly through parent context.

### 10.2 Main Container
**Component**: `<div>` (line 285)
**Ref**: `containerRef`
**Classes**: `relative w-full`

**Properties**:
- `relative`: Positioning context
- `w-full`: Full width

---

## 11. SEARCH FORM (Collapsed State)

### 11.1 Form Element
**Component**: `<form>` (line 286)
**onSubmit**: `handleSearch()`
**Classes**: `flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 max-md:px-4 max-md:py-2 shadow-sm hover:shadow-md transition-shadow w-full`

**Style Breakdown**:
- `flex items-center gap-2`: Flexbox, vertical center, 0.5rem gap
- `bg-white/80`: White at 80% opacity
- `backdrop-blur-sm`: Small background blur (4px)
- `border border-border`: 1px border, color = oklch(0.922 0 0) (light gray)
- `rounded-full`: Completely rounded (border-radius = 9999px)
- `px-6`: Horizontal padding = 1.5rem (24px)
- `py-3`: Vertical padding = 0.75rem (12px)
- `shadow-sm`: Box shadow (0 1px 2px rgba(0,0,0,0.05))
- `hover:shadow-md`: Hover shadow (0 4px 6px rgba(0,0,0,0.1))
- `transition-shadow`: Smooth shadow transition (150ms)
- `w-full`: Full width
- Responsive padding: `max-md:px-4 max-md:py-2` (tablet/mobile smaller)

### 11.2 Search Icon (Left)
**Component**: `<Search>` icon from lucide-react (line 290)
**Icon Size**: `h-5 w-5` (20px × 20px), `max-md:h-4 max-md:w-4` (16px on mobile)
**Color**: `text-muted-foreground` = oklch(0.556 0 0) (gray)
**Properties**: `flex-shrink-0` (doesn't shrink)

### 11.3 Search Input
**Component**: `<input>` (line 291-298)
**Type**: `text`
**Placeholder**: Animated (changes every 3 seconds)
**Classes**: `flex-1 bg-transparent border-none outline-none text-base max-md:text-sm text-foreground placeholder:text-muted-foreground min-w-0 transition-all duration-300`

**Properties**:
- `flex-1`: Takes remaining space
- `bg-transparent`: No background
- `border-none outline-none`: No border or outline
- `text-base`: Font size = 1rem (16px)
- `max-md:text-sm`: Smaller on mobile = 0.875rem (14px)
- `text-foreground`: Color = oklch(0.145 0 0) (dark)
- `placeholder:text-muted-foreground`: Placeholder color = oklch(0.556 0 0) (gray)
- `min-w-0`: Allows flex shrinking
- `transition-all duration-300`: 300ms smooth transitions

**State Binding**:
- `value={query}` (state variable)
- `onChange={(e) => setQuery(e.target.value)}`
- `onClick={handleInputClick}` (opens modal)

### 11.4 Right Tool Buttons Container
**Component**: `<div>` (line 301)
**Classes**: `flex items-center gap-1 max-md:gap-0.5 border-l border-gray-300 pl-3 ml-2 max-md:pl-2 max-md:ml-1`

**Properties**:
- `flex items-center`: Horizontal layout, centered
- `gap-1`: 0.25rem gap between buttons
- `max-md:gap-0.5`: 0.125rem on mobile
- `border-l`: Left border, 1px
- `border-gray-300`: Border color = #d1d5db (light gray)
- `pl-3`: Left padding = 0.75rem (12px)
- `ml-2`: Left margin = 0.5rem (8px)
- `max-md:pl-2 max-md:ml-1`: Smaller on mobile

---

## 12. TOOL BUTTONS (Right Side)

### 12.1 Camera Button (Photo Search)
**Component**: `<button>` (line 302-316)
**Type**: `button`
**onClick**: Toggles `activeTool` between 'photo' and null
**Classes**: `p-2 max-md:p-1.5 rounded-full transition-colors group`

**Dynamic Classes** (conditional):
```javascript
activeTool === 'photo' ? 'bg-blue-100' : 'hover:bg-purple-100'
```

**Padding**:
- `p-2`: 0.5rem (8px) padding
- `max-md:p-1.5`: 0.375rem (6px) on mobile

**Icon Properties**:
- Icon: `<Camera>` from lucide-react
- Size: `h-5 w-5` (20px), `max-md:h-4 max-md:w-4` (16px mobile)
- Dynamic color:
```javascript
activeTool === 'photo' ? 'text-blue-600' : 'text-gray-500 group-hover:text-purple-600'
```
- `transition-colors`: 150ms color transition

**Title**: "Поиск по фото" (Photo Search)

### 12.2 Globe Button (Supplier Search)
**Component**: `<button>` (line 317-331)
**Type**: `button`
**onClick**: Toggles `activeTool` between 'supplier' and null
**Classes**: `p-2 max-md:p-1.5 rounded-full transition-colors group`

**Dynamic Classes**:
```javascript
activeTool === 'supplier' ? 'bg-orange-100' : 'hover:bg-purple-100'
```

**Icon**: `<Globe>` from lucide-react
**Dynamic Color**:
```javascript
activeTool === 'supplier' ? 'text-orange-600' : 'text-gray-500 group-hover:text-purple-600'
```

**Title**: "Найти поставщика" (Find Supplier)

### 12.3 Link Button (URL Search)
**Component**: `<button>` (line 332-346)
**Type**: `button`
**onClick**: Toggles `activeTool` between 'link' and null
**Classes**: `p-2 max-md:p-1.5 rounded-full transition-colors group`

**Dynamic Classes**:
```javascript
activeTool === 'link' ? 'bg-green-100' : 'hover:bg-purple-100'
```

**Icon**: `<Link2>` from lucide-react
**Dynamic Color**:
```javascript
activeTool === 'link' ? 'text-green-600' : 'text-gray-500 group-hover:text-purple-600'
```

**Title**: "Поиск по ссылке" (Search by Link)

### 12.4 Close Button (X - Conditional)
**Component**: `<button>` (line 348-360)
**Type**: `button`
**Visible**: Only when `isModalOpen === true`
**onClick**: Calls `closeMenu()`
**Classes**: `p-2 max-md:p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors ml-1`

**Icon**: `<X>` from lucide-react
**Size**: `h-5 w-5` (20px), `max-md:h-4 max-md:w-4` (16px)

**Title**: "Закрыть" (Close)

---

## 13. STATE VARIABLES (HeaderSearch)

### 13.1 State Hooks
```typescript
const [activeTool, setActiveTool] = useState<ActiveTool>(null)
  // 'search' | 'photo' | 'link' | 'supplier' | null

const [query, setQuery] = useState('')
  // Text search query

const [urlInput, setUrlInput] = useState('')
  // URL input for search-by-url

const [selectedImage, setSelectedImage] = useState<File | null>(null)
  // Selected image file

const [isLoading, setIsLoading] = useState(false)
  // Loading state during API calls

const [placeholderIndex, setPlaceholderIndex] = useState(0)
  // Index for animated placeholder text (0-4)

const [isExpanded, setIsExpanded] = useState(false)
  // Modal expanded state

const [isModalOpen, setIsModalOpen] = useState(false)
  // Modal visibility state

const [mounted, setMounted] = useState(false)
  // Portal readiness (prevents SSR mismatch)
```

### 13.2 Refs
```typescript
const containerRef = useRef<HTMLDivElement>(null)
  // Main search container

const modalContentRef = useRef<HTMLDivElement>(null)
  // Modal content wrapper

const fileInputRef = useRef<HTMLInputElement>(null)
  // Hidden file input

const modalInputRef = useRef<HTMLInputElement>(null)
  // Modal search input
```

---

## 14. PLACEHOLDER ANIMATION

### 14.1 Placeholder Array
**Lines**: 99-105
**Rotation Period**: 3 seconds (3000ms)

**Placeholders**:
1. "Поиск товаров, поставщиков, артикулов..."
2. "Загрузите фото — найдем товар на китайских площадках..."
3. "Вставьте ссылку — найдем аналоги дешевле..."
4. "Нет нужного товара? Мы найдем поставщика для вас..."
5. "Ищите по фото, ссылке или названию..."

### 14.2 Placeholder Rotation Effect
**Effect Hook**: Lines 145-151

**Behavior**:
```javascript
setInterval(() => {
  setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
}, 3000) // Every 3 seconds
```

**Animation**: Changes placeholder every 3 seconds, cycles through all 5 and repeats.

---

## 15. MODAL WINDOW (Portal)

### 15.1 Portal Setup
**Lines**: 365-664
**Render Target**: `document.body`
**Mounted Check**: Only renders when `mounted === true` and `isModalOpen === true`

### 15.2 Modal Backdrop
**Component**: `<div>` (line 366-370)
**Classes**: `fixed inset-0 z-[100] animate-in fade-in duration-200`

**Properties**:
- `fixed`: Fixed positioning
- `inset-0`: Covers entire viewport
- `z-[100]`: High z-index (100)
- `animate-in fade-in`: Tailwind animation
- `duration-200`: 200ms animation

**Inner Overlay**:
**Classes**: `absolute inset-0 bg-black/30 z-0`
- `bg-black/30`: Black at 30% opacity (dark overlay)
- `z-0`: Below modal content
- `onClick={closeMenu}`: Clicking overlay closes modal

### 15.3 Modal Content Container
**Component**: `<div>` (line 373-376)
**Ref**: `modalContentRef`
**Classes**: `relative bg-white shadow-2xl animate-in slide-in-from-top duration-300 z-10`

**Properties**:
- `relative`: Positioning context
- `bg-white`: White background
- `shadow-2xl`: Large shadow (0 25px 50px rgba(0,0,0,0.25))
- `animate-in slide-in-from-top`: Slides down from top
- `duration-300`: 300ms animation
- `z-10`: Above overlay

### 15.4 Modal Top Bar (Search Input Area)
**Component**: `<div>` (line 378-441)
**Classes**: `px-6 py-4 border-b border-gray-200`

**Padding**:
- `px-6`: Horizontal = 1.5rem (24px)
- `py-4`: Vertical = 1rem (16px)

**Border**:
- `border-b border-gray-200`: 1px bottom border, light gray

**Inner Wrapper**: `<div className="max-w-5xl mx-auto">`
- `max-w-5xl`: 64rem (1024px) max width
- `mx-auto`: Centered

**Form Inside**:
- `<form onSubmit={handleSearch}>`
- `className="flex items-center gap-3"`

**Components**:
- Search icon (h-5 w-5, gray)
- Modal input ref (larger text, responsive)
- Tool buttons (Camera, Globe, Link2)
- Close button (X)

### 15.5 Modal Input Field
**Component**: `<input>` (line 382-390)
**Ref**: `modalInputRef`
**Type**: `url`
**Placeholder**: Same animated placeholders
**Classes**: `flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400`

**Properties**:
- `text-lg`: 1.125rem font size (18px)
- `text-gray-900`: Dark text
- `placeholder:text-gray-400`: Gray placeholder

**Auto Focus**: `autoFocus` attribute for accessibility

---

## 16. MODAL CONTENT SECTIONS

### 16.1 Search Mode Content (activeTool === 'search')
**Lines**: 444-511

#### Promo Block
**Lines**: 446-471
**Classes**: `bg-gray-50 border-b border-gray-200 p-5`

**Content**:
- Icon: 🎯 emoji in 10×10 gray box
- Heading: "Не можете найти товар?" (text-base font)
- Description: Service explanation (text-sm, gray-600)
- Button: "Оставить заявку" (Leave Request)
  - Background: `bg-gray-900` (dark)
  - Hover: `bg-gray-800`
  - Padding: `px-5 py-2`
  - Text: `text-sm`
  - Inline flex with ChevronRight icon

#### Categories Section
**Lines**: 474-509
**Classes**: `p-4`

**Heading**: 
- Classes: `text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2`
- Text: "Категории товаров"

**Grid**: `grid grid-cols-1 md:grid-cols-2 gap-3`
- 1 column on mobile, 2 on desktop
- 0.75rem gap

**Category Cards**: 6 categories
- `<button>` elements with background images
- Classes: `relative flex items-center justify-between px-6 py-8 rounded-xl overflow-hidden transition-all group hover:shadow-lg animate-in slide-in-from-top duration-300`

**Category Card Styles**:
```javascript
{
  backgroundImage: `url(${category.image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  animationDelay: `${index * 50}ms`,
  animationFillMode: 'backwards',
}
```

**Overlay**: `absolute inset-0 bg-black/40 group-hover:bg-black/50`
- Darkens image on hover

**Content**:
- Icon (3xl emoji, drop shadow)
- Name (font-semibold, text-lg, white, drop shadow)
- ChevronRight icon (h-5 w-5, white, hover translate-x-1)

**View All Button**:
- Classes: `w-full mt-4 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium`
- Text: "Показать все товары"

### 16.2 Photo Search Mode (activeTool === 'photo')
**Lines**: 514-571

**Header**:
- Purple icon box (12×12, bg-purple-600)
- Heading: "Поиск товара по фотографии"
- Description: Explanation text

**Upload Area**:
- Classes: `bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200`
- Hover: `border-gray-300`
- Label (clickable): File input (hidden)
- Upload icon (7×7, gray)
- Text: Shows filename or "Загрузить фотографию"
- Note: "JPG, PNG или WEBP до 10MB"

**Button**:
- Classes: `bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-purple-700`
- Disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`
- Loading state: Shows spinning Loader2 icon + "Ищем..."
- Normal state: Shows "Найти товар" + ChevronRight

### 16.3 Link Search Mode (activeTool === 'link')
**Lines**: 574-620

**Header**:
- Green icon box (12×12, bg-green-600)
- Heading: "Поиск товара по ссылке"
- Description: Explanation

**Input Area**:
- Classes: `bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200`
- Input placeholder: "https://aliexpress.com/item/..."

**Button**:
- Classes: `bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-700`
- Same loading/disabled states as photo search
- Text: "Найти аналоги"

### 16.4 Supplier Search Mode (activeTool === 'supplier')
**Lines**: 623-660

**Header**:
- Orange icon box (12×12, bg-orange-600)
- Heading: "Найти поставщика"
- Description: Explanation

**Textarea**:
- Classes: `bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200`
- Rows: 3
- Placeholder: "Опишите товар, который вам нужен..."
- No resize allowed

**Button**:
- Classes: `bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-700`
- Inline flex with Send icon
- Text: "Оставить заявку"
- Routes to "/#services" on click

---

## 17. INTERACTIVE BEHAVIORS

### 17.1 Click Outside Detection
**Lines**: 108-128

**Trigger**: Active tool is set
**Behavior**:
- Detects clicks outside `containerRef` AND `modalContentRef`
- Closes menu only if both are clicked outside
- Prevents false closures

### 17.2 Escape Key Handler
**Lines**: 134-142

**Trigger**: Escape key pressed while modal open
**Behavior**: Calls `closeMenu()`

### 17.3 Search Submission
**Function**: `handleSearch()` (lines 153-159)

**Behavior**:
```javascript
if (query.trim()) {
  router.push(`/catalog?search=${encodeURIComponent(query.trim())}`)
  closeMenu()
}
```

### 17.4 Category Click
**Function**: `handleCategoryClick()` (lines 166-169)

**Behavior**:
```javascript
router.push(`/catalog?category=${encodeURIComponent(categoryName)}`)
closeMenu()
```

### 17.5 Image File Selection
**Function**: `handleImageSelect()` (lines 192-202)

**Validation**:
- Checks file size <= 10MB
- Shows alert if exceeds limit
- Stores selected file in state

### 17.6 Image Search
**Function**: `handleImageSearch()` (lines 205-243)

**Process**:
1. Converts image to base64
2. Posts to `/api/catalog/search-by-image`
3. Stores results in `sessionStorage['imageSearchResults']`
4. Routes to `/catalog?mode=image-search`
5. Shows loading state during request
6. Shows error alert on failure

### 17.7 URL Search
**Function**: `handleUrlSearch()` (lines 246-282)

**Process**:
1. Validates URL input
2. Posts to `/api/catalog/search-by-url`
3. Stores results in `sessionStorage['urlSearchResults']`
4. Routes to `/catalog?mode=url-search`
5. Clears input on success

---

## 18. COLOR PALETTE

### Defined in globals.css

**Primary Colors**:
- Primary: `oklch(0.55 0.25 300)` = Purple (≈ #8c5cf6)
- Primary Foreground: `oklch(1 0 0)` = White

**Neutral Colors**:
- Background: `oklch(1 0 0)` = White
- Foreground: `oklch(0.145 0 0)` = Dark gray/black
- Card: `oklch(0.985 0 0)` = Off-white
- Border: `oklch(0.922 0 0)` = Light gray
- Muted: `oklch(0.97 0 0)` = Very light gray
- Muted Foreground: `oklch(0.556 0 0)` = Medium gray

**Interactive Colors** (hardcoded in JSX):
- Blue-100: Background for active photo button
- Blue-600: Text color for active photo button
- Purple-100: Hover background for all buttons
- Purple-600: Hover text for all buttons
- Orange-100: Background for active supplier button
- Orange-600: Text for active supplier button
- Green-100: Background for active link button
- Green-600: Text for active link button
- Gray-900: Button backgrounds (CTA)
- Gray-100: Hover overlay backgrounds

---

## 19. ANIMATIONS SUMMARY

### 19.1 Global CSS Animations (globals.css)

**slideInLeft** (lines 152-161):
- From: `opacity: 0; transform: translateX(-20px)`
- To: `opacity: 1; transform: translateX(0)`
- Duration: 0.4s ease-out

**slideInTop** (lines 163-172):
- From: `opacity: 0; transform: translateY(-20px)`
- To: `opacity: 1; transform: translateY(0)`
- Duration: 0.5s ease-out

**fadeInUp** (lines 174-183):
- From: `opacity: 0; transform: translateY(20px)`
- To: `opacity: 1; transform: translateY(0)`
- Duration: 0.4s ease-out

### 19.2 Component-Level Animations

**Modal Entry**:
- Backdrop: `animate-in fade-in duration-200`
- Content: `animate-in slide-in-from-top duration-300`

**Category Cards**:
- Animation: `animate-in slide-in-from-top duration-300`
- Staggered delays: `animationDelay: ${index * 50}ms`

### 19.3 Dynamic Animations

**Scroll-based Animations**:
- Sticky opacity: 0 → 1 (on scroll activation)
- Background opacity: 0.8 → 1.0 (over 300px scroll)
- Shadow: 0.1 → 0.15 (over 300px scroll)
- Max-width: 672px → 1072px (over 300px scroll)

**Transition Classes** (150-300ms):
- `transition-colors`: For button color changes
- `transition-shadow`: For shadow changes
- `transition-all`: For input animations
- `hover:shadow-md`: On category cards

---

## 20. RESPONSIVE BREAKPOINTS

### 20.1 Mobile/Tablet Breakpoint (max-width: 768px)
**Key Changes**:
- Search form padding: `px-4 py-2` (down from `px-6 py-3`)
- Icon sizes: `h-4 w-4` (down from `h-5 w-5`)
- Tool buttons: `p-1.5` (down from `p-2`)
- Gap sizes: `gap-0.5` (down from `gap-1`)
- Margin/padding: Reduced by ~25%

### 20.2 Search Container Animations
- Disabled animations on mobile (lines 256-271 in globals.css)
- Width: 100% (instead of animated values)
- No header-container animation
- No search-panel-animate animation

---

## 21. KEY PIXEL VALUES AND TIMINGS

### Dimensions
- Hero section min-height: 90vh
- Outer decorative ring: 2200px × 2200px
- Inner decorative ring: 600px × 600px
- Max content width: 1280px (max-w-7xl)
- Max text width: 896px (max-w-4xl)
- Search bar height: 56px
- Sticky search bar max-width animation: 672px → 1072px
- Modal max-width: 1024px (max-w-5xl)

### Spacing
- Section padding: 96px vertical, 24px horizontal
- Content gap: 32px (space-y-8)
- Form elements gap: 8px (gap-2 in form)
- Sidebar gap: 24px (gap-6)
- Category grid gap: 12px (gap-3)

### Timings
- Placeholder rotation: 3000ms
- Modal focus delay: 100ms
- Scroll expand duration: 300px (for progress)
- Sticky opacity range: 0.8 → 1.0
- Modal animations: 200-300ms
- Category animation stagger: 50ms between items

### Colors (OKLCH)
- Primary: oklch(0.55 0.25 300) = Purple
- Primary at 5% opacity: oklch(0.55 0.25 300 / 0.05) = Very light purple
- Background blur: 12px
- Overlay opacity: 30-40% black
- Icon colors: Blue/Green/Orange/Gray variants

---

## 22. FILE REFERENCES

### Imported Components
- `Button` from "@/components/ui/button"
- `Link` from "next/link"
- `HeaderSearch` from "../header-search"
- Icons from "lucide-react":
  - Search, ChevronRight, Camera, Globe, Link2
  - Upload, Send, Loader2, X

### Routing
- Uses Next.js `useRouter()` from "next/navigation"
- Query parameters: `search=`, `category=`, `mode=`
- SessionStorage for results persistence

### External Assets
- Category images via Vercel Blob Storage
- Emoji Unicode (🎯, 📱, 🪑, 💄, ⚽, 🏡, 👔)

---

## 23. ACCESSIBILITY FEATURES

- Button `title` attributes for tooltips
- Input `placeholder` attributes
- `autoFocus` on modal input
- Click outside detection for dismissal
- Escape key handling
- Semantic HTML structure
- Focus-visible states (via outline-ring/50)

