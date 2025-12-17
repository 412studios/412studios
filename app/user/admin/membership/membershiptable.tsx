"use client";
import { useState, useEffect, ChangeEvent } from "react";
import Search from "./searchbar";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

function formatDate(numericDate: number) {
  const dateStr = numericDate.toString();
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface Membership {
  membershipId: string;
  stripeSessionId: string;
  stripeMembershipId: string;
  interval: string;
  status: string;
  planId: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  roomId: number;
  availableHours: number;
  weekMax: boolean;
  userId: string;
  user: {
    name: string | null;
  };
}

interface MembershipTableProps {
  memberships: Membership[];
}

export default function MembershipTable({ memberships = [] }: MembershipTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [filteredMemberships, setFilteredMemberships] = useState(memberships);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRoomSelect = (value: string) => {
    setSelectedRoom(Number(value));
  };

  const filterMemberships = () => {
    let filtered = memberships;

    if (selectedRoom !== 0) {
      filtered = filtered.filter((membership) => membership.roomId === selectedRoom - 1);
    }

    if (searchQuery) {
      filtered = filtered.filter((membership) =>
        membership.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMemberships(filtered);
  };

  useEffect(() => {
    filterMemberships();
  }, [searchQuery, selectedRoom, memberships]);

  const roomName = ["A", "B", "C"];

  return (
    <>
      <div className="mb-4">
        <Search value={searchQuery} onChange={handleSearchChange} />
      </div>

      <div className="w-full mb-4">
        <Select onValueChange={handleRoomSelect}>
          <SelectTrigger>
            <SelectValue placeholder="All Rooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Rooms</SelectItem>
            <SelectItem value="1">Room A</SelectItem>
            <SelectItem value="2">Room B</SelectItem>
            <SelectItem value="3">Room C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="h-[40vh]">
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(filteredMemberships) && filteredMemberships.length > 0 ? (
            filteredMemberships.map((membership: Membership, index: number) => (
              <TableRow key={index}>
                <TableCell>{roomName[membership.roomId]}</TableCell>
                <TableCell>{membership.status}</TableCell>
                <TableCell>{formatDate(membership.currentPeriodStart)}</TableCell>
                <TableCell>{formatDate(membership.currentPeriodEnd)}</TableCell>
                <TableCell>
                  <Link href={`/admin/users/${membership.userId}`} className="hover:underline">
                    {membership.user.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/memberships/${membership.membershipId}`}
                    className="hover:underline"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                No memberships available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
