<!-- Professional Reply Modal - Visual Guide -->

# Professional Reply Modal Redesign - Visual Features

## Modal Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ╔═════════════════════════════════════════════════════╗ │
│ ║ 📋 Respond to Customer Inquiry          [×]         ║ │  ← Gradient Header
│ ║ Professional response management                      ║ │  ← Subtitle
│ ╠═════════════════════════════════════════════════════╣ │
│ ║                                                       ║ │
│ ║  👤 CUSTOMER INFORMATION                             ║ │  ← Section Title with Icon
│ ║  ┌─────────────────────────────────────────────┐    ║ │
│ ║  │ Name: John Doe              │ Email: j@...  │    ║ │  ← Two-Column Layout
│ ║  └─────────────────────────────────────────────┘    ║ │
│ ║  │ Subject: Product Inquiry                   │     ║ │
│ ║                                                       ║ │
│ ║ ─────────────────────────────────────────────────    ║ │  ← Section Divider
│ ║                                                       ║ │
│ ║  📬 ORIGINAL MESSAGE                                 ║ │  ← Section Title
│ ║  ┌─────────────────────────────────────────────┐    ║ │
│ ║  │ *Original message text displayed here*      │    ║ │  ← Read-only Field
│ ║  │ *In italic, muted color*                    │    ║ │
│ ║  └─────────────────────────────────────────────┘    ║ │
│ ║                                                       ║ │
│ ║ ─────────────────────────────────────────────────    ║ │
│ ║                                                       ║ │
│ ║  ✏️  YOUR RESPONSE                  ◄─ Highlighted   ║ │  ← Composition Section
│ ║  ┌─────────────────────────────────────────────┐    ║ │
│ ║  │  Compose Reply                              │    ║ │
│ ║  │ ┌───────────────────────────────────────┐   │    ║ │
│ ║  │ │ [Rich text editor area]               │   │    ║ │  ← Editor with Focus Effect
│ ║  │ │ Type your professional response here  │   │    ║ │
│ ║  │ │                                       │   │    ║ │
│ ║  │ │                                       │   │    ║ │
│ ║  │ └───────────────────────────────────────┘   │    ║ │
│ ║  │ 342/1000 characters                        │    ║ │  ← Character Counter
│ ║  └─────────────────────────────────────────────┘    ║ │
│ ║                                                       ║ │
│ ║  [Cancel]    [✈️ Send Reply] ◄─ Professional        ║ │  ← Gradient Buttons
│ ║                                                       ║ │
│ ╚═════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Header Background**: Linear gradient (secondary-dark-green to darker shade)
- **Accent Color**: Mint Green (#49ca7d)
- **Text Light**: Light gray (#f0f0f0)
- **Text Medium**: Medium gray (#c0c0c0)
- **Borders**: #334f4e
- **Read-only Background**: Semi-transparent black rgba(0,0,0,0.2)

### Button Colors

**Send Reply Button (Success)**
```
Default:  Linear gradient #49ca7d → #5ee898
Hover:    Linear gradient #5ee898 → #7bf5b0 (with glow)
Text:     Dark green (for contrast)
```

**Cancel Button (Secondary)**
```
Default:  Transparent with border
Hover:    Dark green background with mint border
Text:     Light gray
```

## Interactive Features

### 1. Text Editor Focus Effect
```
On Focus:
✓ Border changes to mint green
✓ Glowing shadow appears
✓ Smooth transition (0.3s)
```

### 2. Real-Time Character Counter
```
As User Types:
✓ Counter updates live (0-1000)
✓ Display format: "342/1000 characters"
✓ Auto-truncates at 1000 chars
✓ Color: text-medium gray
```

### 3. Button Hover Effects

**Send Reply (Success)**
```
Hover Animation:
✓ Background brightens
✓ Lifts up 3px (transform translateY)
✓ Glowing box shadow appears (40% opacity mint)
✓ All smooth transitions
```

**Cancel (Secondary)**
```
Hover Animation:
✓ Background becomes dark green
✓ Border becomes mint green
✓ Smooth color transition
```

### 4. Section Separators
```
Between Sections:
✓ 1px border with rgba(73,202,125,0.1) - subtle green
✓ Provides visual organization
✓ Helps section scanning
```

## Field Styling

### Editable Fields
```css
Background: Primary dark green
Border: 1px border-color
Focus: Mint green border, glow shadow
Text Color: Light
Padding: 1rem (generous)
```

### Read-Only Fields
```css
Background: Semi-transparent black
Border: 1px border-color
Opacity: 0.9 (slightly dimmed)
Cursor: default (not text)
Text Color: Light (but appears muted)
```

### Textareas (Message Display)
```css
Style Name: "message-box"
Background: Dark with transparency
Border: 1px border-color
Color: Text medium (italicized appearance)
Read-Only: Yes
Font Style: Italic
```

## Typography

### Headers
```
Primary (h3):
  - Font Size: 1.8rem
  - Color: Mint Green
  - Weight: 600
  - Margin: 0

Subtitle (p.modal-subtitle):
  - Font Size: 0.9rem
  - Color: Text Medium
  - Weight: 400
  - Margin: 0
```

### Section Titles (h4)
```
Font Size: 1.1rem
Color: Text Light
Weight: 600
Margin: 0
Display: Flex with icons
```

### Form Labels
```
Font Size: 1rem (default)
Color: Text Light
Weight: 500
Display: Block
Margin Bottom: 0.5rem
```

## Spacing & Layout

### Modal Dimensions
```
Width: 95% (responsive)
Max Width: 800px
Max Height: 85vh
Margin: 5% auto
```

### Section Padding
```
Header: 2rem
Form: 2.5rem
Sections: Margin-bottom 2.5rem
Section Title: Margin-bottom 1.5rem
Form Group: Margin-bottom 1.5rem
```

### Grid Layouts
```
Two-Column Grid:
- Grid template: repeat(2, 1fr)
- Gap: 1.5rem
- Responsive: Stacks on mobile
```

## Modern Effects

### Gradient Headers
```css
background: linear-gradient(135deg, 
    var(--secondary-dark-green) 0%, 
    rgba(4, 66, 44, 0.8) 100%);
```

### Focus Glow Effect
```css
border-color: mint-green;
box-shadow: 0 0 0 3px rgba(73, 202, 125, 0.1);
```

### Button Hover Elevation
```css
transform: translateY(-3px);
box-shadow: 0 8px 20px rgba(73, 202, 125, 0.4);
```

### Smooth Animations
```css
All transitions: 0.3s ease
Slide down animation: 0.3s ease
Focus effects: 0.3s transition
```

## Accessibility Features

✓ **Color Contrast**: High contrast for readability
✓ **Icon + Text**: Icons paired with text labels
✓ **Focus States**: Clear focus outlines with glow
✓ **Read-only Indication**: Visual distinction
✓ **Character Limit Info**: Clear feedback display
✓ **Semantic HTML**: Proper label associations
✓ **Descriptive Placeholders**: Helpful text guidance

## Mobile Responsiveness

```
Desktop (>768px):
- Two-column grid for contact fields
- Full width 800px
- Standard spacing

Tablet (480px - 768px):
- Two-column grid responsive
- 90% width
- Adjusted spacing

Mobile (<480px):
- Single column layout
- 95% width
- Reduced padding
- Stacked buttons
```

---

## Implementation Checklist

✅ Gradient header with subtitle
✅ Section organization with icons
✅ Two-column contact fields layout
✅ Read-only field styling
✅ Highlighted composition section
✅ Text editor with focus effects
✅ Character counter (0-1000)
✅ Professional button styling
✅ Hover animations
✅ Mobile responsive layout
✅ Color scheme consistency
✅ Accessibility features
✅ Smooth transitions
✅ Icon integration

