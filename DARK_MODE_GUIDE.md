# Dark Mode Implementation Guide

## 🌓 Overview

Stellarc Dynamics now features a complete dark mode implementation with opposite accent colors that provide an elegant alternative theme.

## 🎨 Color Scheme

### Light Mode (Default)
- **Primary Gradients**: Blue → Purple
- **Accent Colors**: Blue, Purple, Yellow
- **Background**: White, Light Gray
- **Text**: Dark Gray, Black

### Dark Mode
- **Primary Gradients**: Orange → Red
- **Accent Colors**: Orange, Red, Pink
- **Background**: Dark Gray, Near Black
- **Text**: White, Light Gray

## 🔧 Implementation Details

### Theme Provider
The dark mode is powered by a React Context provider that:
- Stores theme preference in localStorage
- Applies the `dark` class to the HTML element
- Provides a toggle function accessible throughout the app

**Location**: `app/providers.tsx`

### Theme Toggle Component
A beautiful toggle button that switches between sun and moon icons.

**Location**: `components/ui/theme-toggle.tsx`

**Usage**:
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

<ThemeToggle />
```

### Tailwind Configuration
Dark mode is enabled using the `class` strategy in `tailwind.config.ts`:

```typescript
darkMode: 'class'
```

This allows us to use the `dark:` prefix for dark mode styles.

## 🎯 Styled Components

All major components have been updated with dark mode support:

### Landing Page
- **Hero Section**: Dark purple/orange gradient background
- **Coming Soon Badge**: Orange accent in dark mode
- **Stats Cards**: Semi-transparent with orange borders
- **Product Cards**: Dark gray background with orange/red accents

### Authentication
- **Auth Card**: Dark gray background
- **Input Fields**: Dark gray with orange focus ring
- **Buttons**: Orange/red gradients in dark mode

### Dashboard
- **Header**: Dark gray with orange gradient logo
- **Stats Cards**: Dark background with colored icons
- **Product Cards**: Consistent dark theme
- **Owned Badge**: Green with dark background

### Admin Panel
- **Analytics Cards**: Dark backgrounds
- **Charts**: Orange/red color scheme
- **Metrics**: Consistent dark theme

### UI Components
All base components support dark mode:
- **Button**: Orange/red gradients, dark backgrounds
- **Card**: Dark gray backgrounds, lighter borders
- **Input**: Dark backgrounds with orange focus
- **Theme Toggle**: Positioned in headers

## 📍 Theme Toggle Placement

The theme toggle button is strategically placed in:

1. **Landing Page Hero**: Top-right corner (absolute positioning)
2. **Dashboard Header**: Next to sign out button
3. **Admin Panel Header**: Next to back button

## 🎨 Color Mapping

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Primary Gradient | Blue → Purple | Orange → Red |
| Secondary Accent | Yellow | Orange |
| Success | Green | Green (lighter) |
| Background | White | Gray-900 |
| Card Background | White | Gray-800 |
| Text Primary | Gray-900 | White |
| Text Secondary | Gray-600 | Gray-300 |
| Border | Gray-200 | Gray-700 |

## 💡 Usage Examples

### Adding Dark Mode to New Components

```tsx
// Background
<div className="bg-white dark:bg-gray-800">

// Text
<p className="text-gray-900 dark:text-white">

// Border
<div className="border-gray-200 dark:border-gray-700">

// Gradient
<h1 className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-400 dark:to-red-400">

// Button
<button className="bg-blue-600 dark:bg-orange-600 hover:bg-blue-700 dark:hover:bg-orange-700">
```

### Using the Theme in JavaScript

```tsx
import { useTheme } from '@/app/providers';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## 🔄 Theme Persistence

The theme preference is automatically saved to localStorage and persists across sessions:

```typescript
localStorage.setItem('theme', 'dark'); // or 'light'
```

## 🎯 Best Practices

1. **Always provide dark mode variants**: Use `dark:` prefix for all color-related classes
2. **Test both themes**: Ensure readability and contrast in both modes
3. **Use semantic colors**: Stick to the established color palette
4. **Maintain consistency**: Use the same accent colors throughout
5. **Consider accessibility**: Ensure sufficient contrast ratios

## 🐛 Troubleshooting

### Theme not persisting
- Check if localStorage is enabled
- Verify the ThemeProvider wraps your app
- Ensure suppressHydrationWarning is on the html tag

### Flashing on page load
- The theme is applied after mount to prevent hydration mismatch
- This is expected behavior and minimal

### Colors not changing
- Verify the `dark` class is on the html element
- Check if Tailwind's darkMode is set to 'class'
- Ensure you're using `dark:` prefix correctly

## 🚀 Future Enhancements

Potential improvements for the dark mode:
- [ ] System preference detection (auto-switch based on OS)
- [ ] Multiple theme options (not just light/dark)
- [ ] Custom color picker for accent colors
- [ ] Smooth transition animations
- [ ] Per-page theme preferences

## 📝 Code Locations

Key files for dark mode implementation:

```
stellarc-dynamics/
├── app/
│   ├── providers.tsx              # Theme context provider
│   └── layout.tsx                 # ThemeProvider wrapper
├── components/
│   ├── ui/
│   │   ├── theme-toggle.tsx      # Toggle button component
│   │   ├── button.tsx            # Dark mode button styles
│   │   ├── card.tsx              # Dark mode card styles
│   │   └── input.tsx             # Dark mode input styles
│   └── landing/
│       ├── Hero.tsx              # Dark mode hero section
│       ├── ProductsSection.tsx   # Dark mode products
│       └── AuthSection.tsx       # Dark mode auth
├── app/
│   ├── dashboard/page.tsx        # Dark mode dashboard
│   └── admin/page.tsx            # Dark mode admin
└── tailwind.config.ts            # Dark mode configuration
```

## 🎉 Summary

The dark mode implementation provides:
- ✅ Complete theme coverage across all pages
- ✅ Opposite accent colors (orange/red vs blue/purple)
- ✅ Persistent theme preference
- ✅ Easy-to-use toggle component
- ✅ Consistent design language
- ✅ Accessible color contrasts
- ✅ Professional appearance

The dark mode enhances user experience by:
- Reducing eye strain in low-light environments
- Providing visual variety and personalization
- Maintaining brand identity with custom accent colors
- Ensuring readability in both themes

---

**Stellarc Dynamics** - Excellence in both light and dark. 🌓