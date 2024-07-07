"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timeSlots } from "@/app/booking/components/timeSlots";

interface BookingTableProps {
  user: {
    name: string | null;
    email: string;
    role: string;
  } | null;
  subs: Array<{
    subscriptionId: string;
    roomId: number;
    status: string;
    availableHours: number;
  }>;
  bookings: Array<{
    bookingId: string;
    roomId: number;
    date: number;
    startTime: number;
    endTime: number;
    status: string;
  }>;
}

export default function BookingTable({
  user,
  subs,
  bookings,
}: BookingTableProps) {
  const [isChecked, setIsChecked] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const filterBookings = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    let filtered = bookings;

    if (isChecked) {
      filtered = filtered.filter((booking) => {
        const bookingDateStr = `${booking.date.toString().slice(0, 4)}-${booking.date
          .toString()
          .slice(4, 6)}-${booking.date.toString().slice(6, 8)}`;
        return bookingDateStr >= todayStr;
      });
    }

    if (selectedRoom !== 0) {
      filtered = filtered.filter(
        (booking) => booking.roomId === selectedRoom - 1,
      );
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    filterBookings();
  }, [isChecked, selectedRoom, bookings]);

  const handleRoomSelect = (value: string) => {
    setSelectedRoom(Number(value));
  };

  const roomName = ["A", "B", "C"];

  function formatDate(numericDate: number) {
    const year = numericDate.toString().slice(0, 4);
    const month = numericDate.toString().slice(4, 6);
    const day = numericDate.toString().slice(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <>
      <Card>
        <CardHeader className="flex w-full justify-between">
          <CardTitle>User Details</CardTitle>
          <span className="flex-end">
            <Link href="/admin/">
              <Button>Back</Button>
            </Link>
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <Badge>{user?.role}</Badge>
            <p className="text-2xl font-bold mt-2">
              {user?.name ?? "No name provided"}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          {subs && subs.length > 0 && (
            <div className="border-t-4 p-4">
              <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subs.map((sub, index) => (
                    <TableRow key={index}>
                      <TableCell>{roomName[sub.roomId]}</TableCell>
                      <TableCell>{sub.status}</TableCell>
                      <TableCell>{sub.availableHours}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/subscriptions/${sub.subscriptionId}`}
                          className="hover:underline"
                        >
                          Edit
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {bookings && bookings.length > 0 && (
            <div className="border-t-4 p-4">
              <h2 className="text-xl font-bold">Bookings</h2>

              <div className="py-4 pl-2">
                <input
                  type="checkbox"
                  id="exampleCheckbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="rounded-lg peer"
                />
                <label
                  htmlFor="exampleCheckbox"
                  className="ml-2 font-bold peer-checked:text-blue-500"
                >
                  Hide Previous Bookings
                </label>
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

              <Table className="h-[60vh]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking, index) => (
                    <TableRow key={index}>
                      <TableCell>{roomName[booking.roomId]}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>
                        {timeSlots[booking.startTime].displayStart}
                      </TableCell>
                      <TableCell>
                        {timeSlots[booking.endTime].displayEnd}
                      </TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/bookings/${String(booking?.bookingId)}`}
                          className="hover:underline"
                        >
                          Delete
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
