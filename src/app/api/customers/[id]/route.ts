
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single customer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { message: 'Invalid customer ID' },
      { status: 400 }
    );
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// UPDATE a customer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { message: 'Invalid customer ID' },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    
    // Validation
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { message: 'First name, last name and email are required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check for duplicate email (excluding current customer)
    const duplicateEmail = await prisma.customer.findFirst({
      where: {
        email: data.email,
        id: { not: id },
      },
    });

    if (duplicateEmail) {
      return NextResponse.json(
        { message: 'A different customer with this email already exists' },
        { status: 400 }
      );
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// DELETE a customer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { message: 'Invalid customer ID' },
      { status: 400 }
    );
  }

  try {
    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if customer has active rentals
    const activeRentals = await prisma.rental.findFirst({
      where: {
        customerId: id,
        status: 'ACTIVE',
      },
    });

    if (activeRentals) {
      return NextResponse.json(
        { message: 'Cannot delete customer with active rentals' },
        { status: 400 }
      );
    }

    // Delete customer
    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
