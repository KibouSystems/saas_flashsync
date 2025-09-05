"use client";
import React from "react";
import Link from "next/link";

const Dashboard = () => {
  const links = [{ label: "Email", href: "/workflows/email" }];
  return (
    <div>
      <nav>
        <h2>SaaS FlashSync</h2>
      </nav>
      <main>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="block border-2 border-gray-300 p-3 rounded-md cursor-pointer text-black no-underline hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
