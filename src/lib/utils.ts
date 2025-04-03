/**
 * Utility Functions Module
 * 
 * This module provides reusable utility functions used throughout the application.
 * It centralizes common operations to maintain consistency and reduce code duplication.
 * 
 * Current utilities:
 * - Class name merging with Tailwind CSS optimization
 * 
 * Design Patterns:
 * - Follows the utility pattern for providing reusable, stateless functions
 * - Uses functional programming principles for better testability
 * - Leverages composition for complex operations
 * 
 * Usage Guidelines:
 * - Keep functions pure (no side effects) when possible
 * - Add proper TypeScript typing for all parameters and return values
 * - Document complex logic with comments
 * - Consider performance implications for functions used in render cycles
 * 
 * Future Improvements:
 * - Add date formatting utilities
 * - Add input validation helpers
 * - Implement currency formatting functions for pricing
 * - Add common data transformation utilities
 * - Consider organizing utilities into separate files by category as the app grows
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes efficiently
 * 
 * This function combines the capabilities of clsx and tailwind-merge to:
 * 1. Accept various input types (strings, objects, arrays) via clsx
 * 2. Properly merge Tailwind CSS classes without conflicts via twMerge
 * 
 * Use this helper whenever combining conditional class names with Tailwind,
 * especially when classes might override each other.
 * 
 * @example
 * ```tsx
 * // Basic usage with conditionals
 * <div className={cn(
 *   "base-class",
 *   isActive && "active-class",
 *   isDisabled && "disabled-class"
 * )} />
 * 
 * // Merging potentially conflicting classes
 * <div className={cn(
 *   "px-2 py-1", // Will be overridden by the next class if it contains px/py
 *   isCompact ? "p-1" : "p-4"
 * )} />
 * ```
 * 
 * @param inputs - Class values to be merged
 * @returns Optimized string of CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
