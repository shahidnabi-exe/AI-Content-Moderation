"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="font-bold text-lg">
        🛡️ ModerateAI
      </Link>
      <div className="flex gap-6 items-center text-sm">
        {session ? (
          <>
            <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/submit" className="hover:text-gray-300">Submit</Link>
            <Link href="/appeals" className="hover:text-gray-300">My Appeals</Link>
            {isAdmin && (
              <>
                <Link href="/admin/dashboard" className="text-yellow-400 hover:text-yellow-300">Admin</Link>
                <Link href="/admin/appeals" className="text-yellow-400 hover:text-yellow-300">Appeals Queue</Link>
                <Link href="/admin/policies" className="text-yellow-400 hover:text-yellow-300">Policies</Link>
              </>
            )}
            <button onClick={() => signOut()} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}