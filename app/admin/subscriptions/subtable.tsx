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

interface Subscription {
  subscriptionId: string;
  stripeSessionId: string;
  stripeSubscriptionId: string;
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

interface SubTableProps {
  subscriptions: Subscription[];
}

export default function SubTable({ subscriptions = [] }: SubTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [filteredSubscriptions, setFilteredSubscriptions] =
    useState(subscriptions);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRoomSelect = (value: string) => {
    setSelectedRoom(Number(value));
  };

  const filterSubscriptions = () => {
    let filtered = subscriptions;

    if (selectedRoom !== 0) {
      filtered = filtered.filter(
        (subscription) => subscription.roomId === selectedRoom - 1,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((subscription) =>
        subscription.user.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredSubscriptions(filtered);
  };

  useEffect(() => {
    filterSubscriptions();
  }, [searchQuery, selectedRoom, subscriptions]);

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
          {Array.isArray(filteredSubscriptions) &&
          filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map(
              (subscription: Subscription, index: number) => (
                <TableRow key={index}>
                  <TableCell>{roomName[subscription.roomId]}</TableCell>
                  <TableCell>{subscription.status}</TableCell>
                  <TableCell>
                    {formatDate(subscription.currentPeriodStart)}
                  </TableCell>
                  <TableCell>
                    {formatDate(subscription.currentPeriodEnd)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users/${subscription.userId}`}
                      className="hover:underline"
                    >
                      {subscription.user.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/subscriptions/${subscription.subscriptionId}`}
                      className="hover:underline"
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ),
            )
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                No subscriptions available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
