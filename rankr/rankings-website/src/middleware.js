import { NextResponse } from 'next/server';

export async function middleware(req) {
    // Middleware logic can be added here to handle requests
    // For example, you can log requests or check authentication

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/rankings'], // Apply this middleware only to the rankings API route
};