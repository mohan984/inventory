import { Package, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/products", label: "Products" },
    { path: "/reports", label: "Reports" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Package className="text-blue-600 h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold text-slate-900">Inventory Management</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`pb-4 transition-colors ${
                  location === item.path
                    ? "text-blue-600 font-medium border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
