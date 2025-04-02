
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
  const customerId = parseInt(params.id);
  if (isNaN(customerId)) notFound();

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      rentals: {
        include: {
          car: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <div className="flex gap-2">
          <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button variant="outline">Edit Customer</Button>
          </Link>
          <Button variant="destructive" size="icon">
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{customer.firstName} {customer.lastName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p>{customer.address || 'Not provided'}</p>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium mb-2">Rental History</p>
            {customer.rentals.length > 0 ? (
              <div className="space-y-2">
                {customer.rentals.map((rental) => (
                  <div key={rental.id} className="border rounded p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{rental.car.brand} {rental.car.model}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rental.startDate).toLocaleDateString()} 
                          {rental.endDate && ` - ${new Date(rental.endDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{rental.status}</p>
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
        <CardFooter>
          <Link href="/dashboard/customers">
            <Button variant="outline">Back to Customers</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
