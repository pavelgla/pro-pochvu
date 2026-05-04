import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(
    `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: 53a70f2c26dfd38f</body>
</html>`,
    { headers: { 'Content-Type': 'text/html; charset=UTF-8' } }
  );
}
