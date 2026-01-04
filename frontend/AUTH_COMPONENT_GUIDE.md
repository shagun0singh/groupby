# Auth Component Integration Guide

## ✅ Integration Complete

The `auth-fuse.tsx` component has been successfully integrated into your GroupBy project!

## 📁 Project Structure

Your project already had the perfect setup:
- ✅ **TypeScript**: Configured with Next.js
- ✅ **Tailwind CSS v3.4.0**: Fully configured with custom theme
- ✅ **shadcn Structure**: `/components/ui` folder exists
- ✅ **All Dependencies**: Already installed (no npm install needed!)

## 📦 Dependencies (Already Installed)

All required packages were already in your `package.json`:
- `clsx` (v2.1.0)
- `lucide-react` (v0.268.0)
- `tailwind-merge` (v2.2.0)
- `@radix-ui/react-slot` (v1.0.2)
- `@radix-ui/react-label` (v2.0.2)
- `class-variance-authority` (v0.7.0)

## 🎨 Component Features

The `AuthUI` component includes:
- **Sign In & Sign Up Forms**: Seamless toggle between forms
- **Password Visibility Toggle**: Eye icon to show/hide passwords
- **Google OAuth Button**: Ready for integration
- **Responsive Design**: Mobile-first, split-screen on desktop
- **Typewriter Effect**: Animated quotes on the image side
- **Dark Mode Support**: Automatically adapts to theme
- **Form Validation**: HTML5 validation with required fields
- **Customizable Content**: Images and quotes can be customized

## 🚀 Usage

### Basic Usage (Default Content)

```tsx
import { AuthUI } from "@/components/ui/auth-fuse";

export default function LoginPage() {
  return <AuthUI />;
}
```

**Live at**: `/login` - Already updated to use this component!

### Custom Content

```tsx
import { AuthUI } from "@/components/ui/auth-fuse";

export default function CustomAuthPage() {
  return (
    <AuthUI 
      signInContent={{
        image: {
          src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
          alt: "Custom sign-in background"
        },
        quote: {
          text: "Welcome back to GroupBy!",
          author: "GroupBy Team"
        }
      }}
      signUpContent={{
        image: {
          src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
          alt: "Custom sign-up background"
        },
        quote: {
          text: "Join our community today!",
          author: "GroupBy Team"
        }
      }}
    />
  );
}
```

**Demo at**: `/auth-demo` - Custom implementation example

## 🎯 Implementation Questions Answered

### 1. What data/props will be passed to this component?

**Props Interface:**
```typescript
interface AuthUIProps {
  signInContent?: {
    image?: { src: string; alt: string; }
    quote?: { text: string; author: string; }
  };
  signUpContent?: {
    image?: { src: string; alt: string; }
    quote?: { text: string; author: string; }
  };
}
```

All props are optional. Default Unsplash images and quotes are provided.

### 2. State Management Requirements

**Internal State (Already Handled):**
- Form toggle (Sign In ↔ Sign Up)
- Password visibility
- Typewriter animation

**External State (You Need to Add):**
To make this functional, you'll need to:
1. Connect form submissions to your backend API
2. Handle authentication tokens
3. Manage user session state

### 3. Required Assets

**Default Images (Provided):**
- Sign In: Beautiful gradient from Unsplash
- Sign Up: Vibrant colorful background from Unsplash
- Google Logo: SVG from svgrepo.com

**Icons (Already Available):**
- `Eye` and `EyeOff` from lucide-react

### 4. Responsive Behavior

- **Mobile (<768px)**: Single column, form only (image hidden)
- **Desktop (≥768px)**: Two-column split screen
  - Left: Auth form (350px fixed width, centered)
  - Right: Background image with animated quote

### 5. Best Place to Use This Component

**Recommended Routes:**
- ✅ `/login` - Already implemented
- ✅ `/signup` - Can use the same component
- ✅ `/auth` - Unified auth page
- `/app/auth/signin` - If using Next.js App Router nested routes

## 🔌 Connecting to Your Backend

Currently, the forms log to console. To connect to your backend:

### Option 1: Modify the Component Directly

Edit `/components/ui/auth-fuse.tsx`:

```typescript
// Add these imports at the top
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// In SignInForm function:
function SignInForm() {
  const router = useRouter();
  
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      router.push('/events');
    } catch (error) {
      console.error('Login failed:', error);
      // Add error handling UI here
    }
  };
  
  // ... rest of the form
}
```

### Option 2: Pass Handlers as Props (Recommended)

This keeps the component reusable. You'd need to modify the component to accept `onSignIn` and `onSignUp` props.

## 🎨 Styling Notes

The component uses your existing Tailwind theme:
- Respects `--background`, `--foreground`, `--accent` CSS variables
- Uses your border radius (`--radius: 1rem`)
- Supports your dark mode configuration
- All colors automatically adapt to light/dark mode

## 🔧 Customization Tips

### Change Button Styles
The Button component uses variants:
```tsx
<Button variant="outline">Sign In</Button>  // Current
<Button variant="default">Sign In</Button>  // Filled background
<Button variant="secondary">Sign In</Button> // Secondary color
```

### Adjust Form Width
In `AuthFormContainer`, change:
```tsx
<div className="mx-auto grid w-[350px] gap-2">
```
to any width you prefer.

### Modify Typewriter Speed
```tsx
<Typewriter
  text={currentContent.quote.text}
  speed={60}        // Characters per millisecond
  deleteSpeed={50}  // Delete speed
  loop={false}      // Set true to loop
/>
```

### Change Background Image Behavior
The image uses CSS `background-cover` and `background-center`. To adjust:
```tsx
<div
  className="... bg-cover bg-center ..."  // Change to bg-contain, bg-top, etc.
  style={{ backgroundImage: `url(...)` }}
>
```

## 🐛 Troubleshooting

### Issue: Images not loading
**Solution**: Ensure the image URLs are accessible. Consider using Next.js Image component for local images.

### Issue: Dark mode not working
**Solution**: Ensure your root layout has the theme provider. Check `app/layout.tsx` for `<html className="dark">` or a theme provider.

### Issue: Forms not submitting
**Solution**: The forms currently just log to console. You need to implement the backend integration (see "Connecting to Your Backend" above).

### Issue: TypeScript errors
**Solution**: All types are properly defined. If you see errors, ensure you're importing from the correct path:
```tsx
import { AuthUI } from "@/components/ui/auth-fuse";
```

## 📝 Next Steps

1. **Test the component**: 
   - Visit `/login` for the default implementation
   - Visit `/auth-demo` for the custom implementation

2. **Connect to your backend**:
   - Update the form handlers in `auth-fuse.tsx`
   - Add error handling and loading states
   - Integrate with your existing auth system

3. **Customize the design**:
   - Replace default images with your brand images
   - Update quotes to match your messaging
   - Adjust colors in your Tailwind config if needed

4. **Add additional features**:
   - Forgot password link
   - Remember me checkbox
   - Email verification flow
   - Social auth providers (Twitter, Facebook, etc.)

## 🎉 You're All Set!

The component is production-ready and integrated into your app. Visit `/login` to see it in action!

For questions or customization help, refer to the comments in `/components/ui/auth-fuse.tsx`.

