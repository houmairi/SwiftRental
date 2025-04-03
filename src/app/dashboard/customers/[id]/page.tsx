/**
 * Customer Details Page Component
 * 
 * This server component displays comprehensive details about a specific customer,
 * including their personal information and full rental history.
 * 
 * Data Flow:
 * - Extracts customer ID from URL parameters
 * - Queries database for customer details with related rental information
 * - Handles not-found scenarios with appropriate error responses
 * - Renders customer information and rental history in a structured layout
 * 
 * Design Patterns:
 * - Uses dynamic routing pattern with Next.js route parameters
 * - Implements data relationship traversal for nested information display
 * - Follows a consistent layout pattern for detail pages
 * - Uses defensive programming to handle invalid or missing data
 * 
 * Performance Considerations:
 * - Uses eager loading via Prisma's include to fetch related data in a single query
 * - Sorts rental history on the server to avoid client-side processing
 * - Consider implementing pagination for customers with extensive rental histories
 * 
 * Future Improvements:
 * - Implement the delete functionality (button is currently non-functional)
 * - Add a confirmation dialog for delete operations
 * - Enhance rental history with filtering and sorting options
 * - Add ability to initiate a new rental directly from the customer profile
 * - Implement data export functionality (e.g., PDF generation of customer details)
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomerDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Extract and validate customer ID from route parameters
  const customerId = parseInt(params.id);
  // Redirect to 404 page if ID is not a valid number
  if (isNaN(customerId)) notFound();

  // Fetch customer data with related rental information
  // Using Prisma's include for eager loading of related data
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      // Include rental history with car details for each rental
      rentals: {
        include: {
          car: true,
        },
        // Order rentals by start date (newest first)
        orderBy: {
          startDate: 'desc',
        },
      },
    },
  });

  // Handle case where customer ID is valid but not found in database
  if (!customer) notFound();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with page title and primary actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button variant="outline">Edit Customer</Button>
          </Link>
          {/* Delete button (currently non-functional) 
             TODO: Implement delete functionality with confirmation dialog */}
          <Button variant="destructive">
            Delete
          </Button>
        </div>
      </div>

      {/* Customer details card */}
      <Card>
        <CardHeader>
          <CardTitle>{customer.firstName} {customer.lastName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contact information section in a responsive grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{customer.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{customer.phone || 'Not provided'}</p>
            </div>
          </div>
          
          {/* Address information section */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p>{customer.address || 'Not provided'}</p>
          </div>

          {/* Rental history section with dynamic content based on availability */}
          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Rental History</p>
            {customer.rentals.length > 0 ? (
              <div className="space-y-2">
                {customer.rentals.map((rental) => (
                  <div key={rental.id} className="border rounded p-3">
                    <div className="flex justify-between">
                      {/* Left side: Vehicle and date information */}
                      <div>
                        <p className="font-medium">{rental.car.brand} {rental.car.model}</p>
                        <p className="text-sm text-muted-foreground">
                          {/* Format dates for better readability */}
                          {new Date(rental.startDate).toLocaleDateString()} 
                          {rental.endDate && ` - ${new Date(rental.endDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      {/* Right side: Status and usage information */}
                      <div className="text-right">
                        <p className="text-sm">{rental.status}</p>
                        {/* Conditionally display mileage information when available */}
                        {rental.endMileage && rental.startMileage && (
                          <p className="text-sm text-muted-foreground">
                            {rental.endMileage - rental.startMileage} km driven
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No rental history</p>
            )}
          </div>
        </CardContent>
        {/* Footer with navigation back to customer listing */}
        <CardFooter>
          <Link href="/dashboard/customers">
            <Button variant="outline">Back to Customers</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
