"use client";
import Link from "next/link";
import Search from "./searchbar";
import { useState, ChangeEvent } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4">
        <Search value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="border-4 rounded-xl overflow-hidden">
        <div className="max-h-[60vh] overflow-y-scroll">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className={`p-4 ${index !== filteredUsers.length - 1 ? "border-b border-dashed" : ""}`}
            >
              <p className="text-wrap">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="w-full whitespace-nowrap hover:underline"
                >
                  <b>Name:</b> {user.name}
                </Link>
              </p>
              <p className="text-wrap">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="w-full whitespace-nowrap hover:underline"
                >
                  <b>Email:</b> {user.email}
                </Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
