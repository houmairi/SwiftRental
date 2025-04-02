
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  // Fetch stats
  const customerCount = await prisma.customer.count();
  const carCount = await prisma.car.count();
  const activeRentalsCount = await prisma.rental.count({
    where: { status: 'ACTIVE' },
  });
  
  // Fetch recent customers
  const recentCustomers = await prisma.customer.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/customers/new">
          <Button>Add New Customer</Button>
        </Link>
      </div>

      {/* Stats Cards */}
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

      {/* Recent Customers */}
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

      {/* Quick Actions */}
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
