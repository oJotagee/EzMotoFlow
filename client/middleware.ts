import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const token = req.cookies.get('user-auth');
	const verifiedToken = token! && !!token.value.length;

	if (req.nextUrl.pathname === '/' && !verifiedToken) {
		req.cookies.delete('user-auth');
		return;
	}

	if (!verifiedToken) {
		req.cookies.delete('user-auth');
		return NextResponse.rewrite(new URL('/', req.url));
	}

	return;
}

export const config = {
	matcher: ['/', '/backoffice/:path*', '/backoffice/:path*/:path*'],
};
