// src/middleware.js
import { NextResponse } from "next/server";
import { auth } from "./auth";

export const middleware = async () => {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/login"));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/protected/"],
};