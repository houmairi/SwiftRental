/**
 * Button Component
 * 
 * A versatile button component that provides consistent styling with
 * multiple variants and sizes. It supports all standard button functionality
 * plus the ability to render as any element through the asChild prop.
 * 
 * Component Features:
 * - Multiple visual variants (default, destructive, outline, etc.)
 * - Different size options
 * - Support for icons inside buttons
 * - Accessible focus states and keyboard navigation
 * - Polymorphic rendering through Radix UI Slot
 * 
 * Design Patterns:
 * - Uses class-variance-authority for type-safe variant management
 * - Implements compound component pattern for flexible usage
 * - Follows atomic design principles as a fundamental UI element
 * - Uses composition pattern to maintain flexibility
 * 
 * Accessibility Considerations:
 * - Proper focus states for keyboard navigation
 * - Visual indication of interactive state
 * - Maintains proper contrast ratios across variants
 * - Supports disabled states with appropriate visual indicators
 * 
 * Usage Guidelines:
 * - Use 'default' variant for primary actions
 * - Use 'destructive' for irreversible actions
 * - Use 'outline' and 'secondary' for less prominent actions
 * - Include icons to enhance visual recognition
 * - Maintain consistent button hierarchy across the application
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variant configuration using class-variance-authority
 * 
 * This defines all possible visual states and combinations:
 * - Base styles applied to all buttons
 * - Variant-specific styles (default, destructive, outline, etc.)
 * - Size-specific styles (default, sm, lg, icon)
 * 
 * The comprehensive class structure ensures:
 * - Consistent spacing and alignment
 * - Proper icon handling
 * - Accessible focus states
 * - Interactive hover/active states
 * - Support for dark mode through Tailwind classes
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary action button - Use for the main action in a section
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // Destructive action button - Use for delete/remove actions
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Outline button - Use for secondary actions that need visibility
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // Secondary button - Use for alternative actions
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        // Ghost button - Use for low-emphasis actions
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // Link button - Use for navigation-like actions
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Default size - Standard button size for most use cases
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        // Small size - Compact button for tight spaces
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        // Large size - Prominent button for key actions
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // Icon size - Square button typically used with just an icon
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component that supports different variants, sizes, and renders
 * 
 * @param className - Additional CSS classes to apply
 * @param variant - Visual style variant
 * @param size - Size variant
 * @param asChild - Whether to render as a slot for custom elements
 * @param props - All other button props (onClick, disabled, etc.)
 * @returns A styled button component
 * 
 * @example
 * ```tsx
 * // Primary action button
 * <Button onClick={handleSubmit}>Submit</Button>
 * 
 * // Destructive action with icon
 * <Button variant="destructive">
 *   <TrashIcon /> Delete
 * </Button>
 * 
 * // Small outline button
 * <Button variant="outline" size="sm">Cancel</Button>
 * 
 * // Button that renders as a link
 * <Button asChild variant="link">
 *   <Link href="/about">Learn more</Link>
 * </Button>
 * ```
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // Use Slot from Radix UI for polymorphic rendering when asChild is true
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
