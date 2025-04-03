/**
 * Customer API Route Handler
 * 
 * This module provides REST API endpoints for customer-related operations.
 * It implements GET, PUT, and DELETE methods for retrieving, updating, and removing
 * customer records from the database.
 * 
 * Data Flow:
 * - Receives HTTP requests with customer ID in URL parameters
 * - Validates input data and performs business logic checks
 * - Executes database operations via Prisma ORM
 * - Returns appropriate HTTP responses with JSON payloads
 * 
 * Design Patterns:
 * - Follows REST API design principles with standard HTTP methods
 * - Implements consistent error handling with appropriate status codes
 * - Uses middleware pattern for request/response processing
 * - Follows a controller pattern for database operations
 * 
 * Performance Considerations:
 * - Uses database constraints to ensure data integrity
 * - Implements business logic validation to prevent invalid operations
 * - Uses try/catch blocks to handle exceptions gracefully
 * 
 * Security Considerations:
 * - Validates and sanitizes input data to prevent injection attacks
 * - Implements business rules to prevent data corruption
 * - Handles errors without exposing sensitive information
 * 
 * Future Improvements:
 * - Implement input validation using a schema validation library (e.g., zod, joi)
 * - Add authentication and authorization checks
 * - Implement rate limiting to prevent abuse
 * - Add logging middleware for better error tracking
 * - Create a reusable error handler to standardize error responses
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET handler - Retrieve a single customer by ID
 * 
 * @param request - The incoming HTTP request
 * @param params - Object containing route parameters
 * @returns NextResponse with customer data or error information
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Parse and validate ID parameter
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { message: 'Invalid customer ID' },
      { status: 400 }
    );
  }

  try {
    // Attempt to fetch the customer by ID
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    // Handle case where customer is not found
    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Return customer data on success
    return NextResponse.json(customer);
  } catch (error) {
    // Log error for server-side debugging
    console.error('Error fetching customer:', error);
    // Return generic error to client to avoid leaking implementation details
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update an existing customer
 * 
 * @param request - The incoming HTTP request with updated customer data
 * @param params - Object containing route parameters
 * @returns NextResponse with updated customer data or error information
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Parse and validate ID parameter
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { message: 'Invalid customer ID' },
      { status: 400 }
    );
  }

  try {
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    // This is a basic validation; consider using a schema validation library for complex validation
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { message: 'First name, last name and email are required' },
        { status: 400 }
      );
    }

    // Verify customer exists before attempting update
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check for duplicate email addresses across different customers
    // This ensures email uniqueness as a business rule
    const duplicateEmail = await prisma.customer.findFirst({
      where: {
        email: data.email,
        id: { not: id }, // Exclude current customer from duplicate check
      },
    });

    if (duplicateEmail) {
      return NextResponse.json(
        { message: 'A different customer with this email already exists' },
        { status: 400 }
      );
    }

    // Update customer with validated data
    // Handle optional fields by setting them to null if not provided
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

    // Return updated customer data on success
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    // Log error for server-side debugging
    console.error('Error updating customer:', error);
    // Return generic error to client
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Remove a customer record
 * 
 * @param request - The incoming HTTP request
 * @param params - Object containing route parameters
 * @returns NextResponse with success message or error information
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Parse and validate ID parameter
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { message: 'Invalid customer ID' },
      { status: 400 }
    );
  }

  try {
    // Verify customer exists before attempting delete
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Business rule: Prevent deletion of customers with active rentals
    // This protects data integrity and prevents orphaned rental records
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

    // Delete customer record from database
    // Note: Consider soft delete for production applications to preserve history
    await prisma.customer.delete({
      where: { id },
    });

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error for server-side debugging
    console.error('Error deleting customer:', error);
    // Return generic error to client
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
