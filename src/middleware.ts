// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/sign-up"];

const authRoutes = ["/login", "/sign-up"];

const defaultLoginRedirect = "/project";

export default auth((req) => {
	// req.auth now contains the session object if authenticated, or null otherwise
	const isLoggedIn = !!req.auth?.user;
	const { pathname } = req.nextUrl;

	// --- Check if the requested path is public ---
	const isPublicPath = publicPaths.some(
		(path) =>
			pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
		// Example: if you want all /blog posts to be public add:
		// || pathname.startsWith('/blog/')
	);

	// --- Check if the requested path is an auth route ---
	const isAuthPath = authRoutes.includes(pathname);

	// --- Default Protection ---
	// If the path is NOT public and the user is NOT logged in, redirect to login
	if (!isPublicPath && !isLoggedIn) {
		let callbackUrl = pathname;
		// Append search params if they exist
		if (req.nextUrl.search) {
			callbackUrl += req.nextUrl.search;
		}
		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		// Construct login URL with callback
		const loginUrl = new URL("/login", req.nextUrl.origin);
		loginUrl.searchParams.set("callbackUrl", encodedCallbackUrl);

		console.log(
			`Redirecting unauthenticated user from "${pathname}" to login.`
		);
		return NextResponse.redirect(loginUrl.toString());
	}

	// --- Redirect logged-in users from auth routes ---
	// If the user IS logged in and trying to access an auth page (login/signup)
	if (isLoggedIn && isAuthPath) {
		console.log(
			`Redirecting authenticated user from "${pathname}" to ${defaultLoginRedirect}.`
		);
		// Redirect them to the default logged-in page
		return NextResponse.redirect(
			new URL(defaultLoginRedirect, req.nextUrl.origin)
		);
	}

	const res = NextResponse.next(); // Get the default pass-through response
	const searchParams = req.nextUrl.searchParams.toString();
	if (searchParams) {
		res.headers.set("x-search-params", searchParams); // Use 'x-' prefix for custom headers
	}
	return res;
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - Specific image extensions
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
