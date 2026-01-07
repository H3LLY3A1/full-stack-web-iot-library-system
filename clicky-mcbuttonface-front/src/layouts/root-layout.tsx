import { Link, NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const baseItem =
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 bg-black py-1 w-full">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-white">
            <img
              src="/src/assets/library-logo.png"
              alt="Logo"
              className="h-16 w-16"
            />
            <span className="text-base font-semibold tracking-tight text-xl">
              Library
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `${baseItem} ${
                  isActive ? "text-red-400" : "text-white hover:text-zinc-200"
                }`
              }
            >
              Books
            </NavLink>

            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `${baseItem} ${
                  isActive ? "text-red-400" : "text-white hover:text-zinc-200"
                }`
              }
            >
              Clients
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          aria-label={undefined}
        />
      </main>
    </div>
  );
}
