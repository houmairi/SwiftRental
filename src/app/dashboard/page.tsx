/**
 * Dashboard Page Component
 * 
 * This component serves as the main entry point for the SwiftRental admin dashboard.
 * It provides a high-level overview of key business metrics and quick access to main
 * system functionalities.
 * 
 * Data Flow:
 * - Uses direct Prisma queries to fetch real-time statistics from the database
 * - All database operations are performed server-side during page rendering
 * - No client-side data fetching is used, leveraging Next.js server components
 * 
 * Design Patterns:
 * - Follows a dashboard pattern with statistics cards and recent activity
 * - Uses composition with reusable UI components from the component library
 * - Implements a responsive grid layout for different screen sizes
 * 
 * Performance Considerations:
 * - Count operations on large tables should be monitored as the database grows
 * - Consider implementing caching for statistics that don't need real-time updates
 * - If database grows significantly, pagination or virtual scrolling should be added for recent customers
 * 
 * Future Improvements:
 * - Add data visualization charts for rental trends over time
 * - Implement real-time updates using websockets for active rentals
 * - Add filtering options for different time periods (daily, weekly, monthly statistics)
 * - Consider implementing server-side caching for frequently accessed metrics
 */

import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  // Fetch count statistics for key metrics
  // These queries execute in parallel since they're independent
  const customerCount = await prisma.customer.count();
  const carCount = await prisma.car.count();
  const activeRentalsCount = await prisma.rental.count({
    where: { status: 'ACTIVE' },
  });
  
  // Fetch recent customers for the activity feed
  // Limited to 5 records to prevent performance issues
  const recentCustomers = await prisma.customer.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header section with page title and primary action */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/customers/new">
          <Button>Add New Customer</Button>
        </Link>
      </div>

      {/* Stats Cards Section - Key metrics display
         Responsive grid layout that stacks on mobile and displays in a row on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Customers</CardTitle>
            <CardDescription>All registered customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{customerCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Cars</CardTitle>
            <CardDescription>All vehicles in fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{carCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Rentals</CardTitle>
            <CardDescription>Currently rented vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeRentalsCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers Section - Activity feed showing latest registrations 
         Provides quick access to detailed customer information */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>Newly registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentCustomers.length > 0 ? (
              recentCustomers.map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex justify-between items-center p-3 border rounded hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                  <Link href={`/dashboard/customers/${customer.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No customers found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section - Navigation shortcuts to main system areas
         Provides context-based navigation to essential business functions */}
      <div className="flex gap-4">
        <Link href="/dashboard/customers">
          <Button variant="outline">Manage Customers</Button>
        </Link>
        <Link href="/dashboard/cars">
          <Button variant="outline">Manage Cars</Button>
        </Link>
        <Link href="/dashboard/rentals">
          <Button variant="outline">View Rentals</Button>
        </Link>
      </div>
    </div>
  );
}
