/**
 * New Customer Form Component
 * 
 * This client-side component provides a form interface for creating new customer records.
 * It handles form submission, validation, error handling, and success feedback.
 * 
 * Data Flow:
 * - Collects form data from user inputs
 * - Submits data to the API endpoint via fetch
 * - Processes API response and provides user feedback
 * - Redirects to customer listing on success
 * 
 * Design Patterns:
 * - Uses React's controlled components pattern for form handling
 * - Implements client-side form submission with loading state
 * - Follows a consistent form layout with logical field grouping
 * - Uses toast notifications for non-intrusive feedback
 * - Implements optimistic UI updates with router.refresh() after successful operations
 * 
 * Performance Considerations:
 * - Minimizes state usage to only track submission status
 * - Uses browser's native form validation for basic field requirements
 * - Avoids unnecessary re-renders by keeping form values in the DOM
 * 
 * Future Improvements:
 * - Implement more robust client-side validation with a form library (e.g., react-hook-form, formik)
 * - Add field-level error messages for better user feedback
 * - Implement autosave functionality for large forms
 * - Add support for customer image uploads
 * - Consider form state persistence to prevent data loss on accidental navigation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const router = useRouter();
  // Single state variable tracks form submission status
  // Used to disable the submit button and show loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Form submission handler
   * Collects form data and sends it to the API
   * 
   * @param event - Form submission event
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Using FormData API to collect input values from the form
    // This approach is more efficient than maintaining controlled inputs for each field
    const formData = new FormData(event.currentTarget);
    const customerData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };

    try {
      // API request to create a new customer
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      // Handle unsuccessful responses
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }

      // Success notification
      toast("Success", {
        description: "Customer has been created successfully"
      });
      
      // Redirect to customer listing and refresh the data
      router.push('/dashboard/customers');
      router.refresh(); // Invalidates Next.js cache to ensure fresh data
    } catch (error) {
      // Error notification with specific message when available
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to create customer"
      });
    } finally {
      // Reset submission state regardless of outcome
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Name fields in a two-column layout for efficient space usage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              
              {/* Contact information section */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              
              {/* Address information with multi-line input */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" rows={3} />
              </div>
            </CardContent>
            
            {/* Form actions - consistent pattern of Cancel/Submit buttons */}
            <CardFooter className="flex justify-between">
              <Link href="/dashboard/customers">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Customer'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
