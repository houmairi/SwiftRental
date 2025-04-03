/**
 * Customers Listing Page Component
 * 
 * This component displays a comprehensive listing of all customers in the system,
 * with search functionality and direct actions for customer management.
 * 
 * Data Flow:
 * - Retrieves search parameters from URL query string
 * - Executes filtered database queries using Prisma ORM
 * - Renders server-side HTML with search results
 * - Form submission refreshes the page with new search parameters
 * 
 * Design Patterns:
 * - Uses server-side search processing pattern to ensure data security
 * - Implements a clean table display pattern for data visualization
 * - Follows a consistent action pattern with View/Edit operations
 * - Uses URL-based search state to enable bookmarking and sharing of results
 * 
 * Performance Considerations:
 * - Case-insensitive search with contains may be expensive on large datasets
 * - Consider implementing pagination when customer count exceeds a certain threshold
 * - Database index on search fields (firstName, lastName, email) is recommended
 * - Consider debouncing search in larger implementations to reduce database load
 * 
 * Future Improvements:
 * - Add pagination for better performance with large datasets
 * - Implement more advanced filtering options (by status, date range, etc.)
 * - Add sorting functionality on different columns
 * - Implement client-side filtering for faster response on smaller datasets
 * - Consider implementing bulk actions for efficient customer management
 */

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomersPage({ 
  searchParams 
}: { 
  searchParams?: { 
    q?: string 
  } 
}) {
  // Extract search query from URL parameters - defaults to empty string if not provided
  const query = searchParams?.q || '';
  
  // Fetch customers with optional search criteria
  // Using Prisma's flexible query builder to create dynamic WHERE conditions
  const customers = await prisma.customer.findMany({
    where: query ? {
      OR: [
        // Case-insensitive search across multiple fields
        // This provides a flexible search experience for the user
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    } : undefined,
    // Default sorting by last name ensures consistent ordering
    orderBy: {
      lastName: 'asc',
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page header with main action button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <Link href="/dashboard/customers/new">
          <Button>Add New Customer</Button>
        </Link>
      </div>

      {/* Search Form - Server-side form submission approach
         Using standard HTML form for accessibility and simplicity */}
      <div className="flex gap-2">
        <form className="flex-1 flex gap-2" action="/dashboard/customers" method="GET">
          <Input
            type="search"
            name="q"
            placeholder="Search customers..."
            defaultValue={query}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Customers Table - Main data display component
         Shows a count of results and handles empty state gracefully */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.firstName} {customer.lastName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      {/* Action buttons for each customer record 
                         Consistent pattern of View/Edit operations */}
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/customers/${customer.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/dashboard/customers/${customer.id}/edit`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
