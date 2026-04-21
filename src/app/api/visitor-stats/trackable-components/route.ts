import { NextResponse } from 'next/server';

export async function GET() {
  const trackableComponents = [
    { name: 'hero', label: 'Hero Section', tracked: true },
    { name: 'about', label: 'About Section', tracked: true },
    { name: 'portfolio', label: 'Portfolio Section', tracked: true },
    { name: 'contact', label: 'Contact Section', tracked: true },
    { name: 'admin', label: 'Admin Panel', tracked: false },
    { name: 'admin-login', label: 'Admin Login', tracked: false },
    { name: 'admin-messages', label: 'Admin Messages', tracked: false },
  ];
  return NextResponse.json(trackableComponents.filter((c) => c.tracked));
}
