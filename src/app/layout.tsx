/**
 * Root Layout Component
 * 
 * This component serves as the application shell and defines the basic HTML structure
 * that wraps all pages. It provides consistent styling, fonts, and UI elements that
 * should appear on every page.
 * 
 * Data Flow:
 * - Receives child components from page routes
 * - Wraps them in common HTML structure
 * - No data fetching occurs at this level
 * 
 * Design Patterns:
 * - Uses React's composition pattern to wrap child components
 * - Implements a shell layout pattern for consistent UI framing
 * - Follows Next.js app router conventions for metadata
 * 
 * Performance Considerations:
 * - Font loading is optimized with next/font
 * - Layout is kept minimal to avoid unnecessary re-renders
 * - Uses CSS variables for theming to minimize style recalculations
 * 
 * Accessibility Considerations:
 * - Sets correct language attribute for screen readers
 * - Uses semantic HTML structure
 * - Ensures proper contrast with background colors
 * 
 * Future Improvements:
 * - Add theme switching capability (light/dark mode)
 * - Implement responsive navigation header
 * - Add user authentication context provider
 * - Consider implementing error boundaries for better error handling
 * - Add analytics tracking at the layout level
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "sonner";

// Load Inter font with optimized subsets
// This improves performance by loading only the characters needed
const inter = Inter({ subsets: ['latin'] });

// Define metadata for SEO and browser display
// This metadata applies to all pages unless overridden
export const metadata: Metadata = {
  title: 'Swift Rental - Car Rental Management',
  description: 'Car rental management system',
};

/**
 * Root layout component that wraps all pages
 * 
 * @param children - React components to be rendered within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Main content container with minimum height to ensure footer positioning */}
        <main className="min-h-screen bg-background">
          {/* Render page-specific content */}
          {children}
          
          {/* Global toast notification container
             Positioned here to ensure notifications appear above all content */}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
