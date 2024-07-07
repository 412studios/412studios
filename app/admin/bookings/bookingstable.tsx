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
import { timeSlots } from "@/app/booking/components/timeSlots";

const roomName = ["A", "B", "C"];

const numericToDate = (numericDate: string): string => {
  if (numericDate.length !== 8) return "";

  const year = numericDate.substring(0, 4);
  const month = parseInt(numericDate.substring(4, 6), 10) - 1;
  const day = numericDate.substring(6, 8);

  const date = new Date(parseInt(year), month, parseInt(day));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface Booking {
  bookingId: string;
  roomId: number;
  date: number;
  startTime: number;
  endTime: number;
  status: string;
  userId: string;
  user: {
    name: string | null;
  };
}

interface BookingsTableProps {
  bookings: Booking[];
}

export default function BookingsTable({ bookings = [] }: BookingsTableProps) {
  const [isChecked, setIsChecked] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleRoomSelect = (value: string) => {
    setSelectedRoom(Number(value));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filterBookings = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Ensure comparison is done in UTC

    let filtered = bookings;

    if (isChecked) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(
          Date.UTC(
            Number(booking.date.toString().slice(0, 4)),
            Number(booking.date.toString().slice(4, 6)) - 1,
            Number(booking.date.toString().slice(6, 8)),
          ),
        );
        return bookingDate >= today;
      });
    }

    if (selectedRoom !== 0) {
      filtered = filtered.filter(
        (booking) => booking.roomId === selectedRoom - 1,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((booking) =>
        booking.user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    filterBookings();
  }, [isChecked, selectedRoom, searchQuery, bookings]);

  return (
    <>
      <div>
        <Search value={searchQuery} onChange={handleSearchChange} />
      </div>

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

      <Table className="h-[40vh]">
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
            filteredBookings.map((booking: Booking, index: number) => (
              <TableRow key={index}>
                <TableCell>{roomName[booking.roomId]}</TableCell>
                <TableCell>{numericToDate(booking.date.toString())}</TableCell>
                <TableCell>
                  {timeSlots[booking.startTime].displayStart}
                </TableCell>
                <TableCell>{timeSlots[booking.endTime].displayEnd}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/users/${booking.userId}`}
                    className="hover:underline"
                  >
                    {booking.user.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/bookings/${booking.bookingId}`}
                    className="hover:underline"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={7}>
                No bookings available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
