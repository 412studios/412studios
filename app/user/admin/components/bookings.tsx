"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllBooking } from "@/app/lib/booking";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface Booking {
  bookingId: string;
  roomId: number;
  date: number;
  startTime: number;
  endTime: number;
  user: User;
}

type RoomFilter = "all" | "a" | "b" | "c";

export default function Bookings(): JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [showPrevious, setShowPrevious] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const room: string[] = ["A", "B", "C"];

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async (): Promise<void> => {
      try {
        const data: Booking[] = await getAllBooking();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Get today's date
  const today: Date = new Date();
  const todayFormatted: string = today
    .toISOString()
    .split("T")[0]
    .replace(/-/g, ""); // YYYYMMDD
  const todayAsNumber: number = parseInt(todayFormatted);

  // Filter bookings based on current state
  const filteredBookings: Booking[] = bookings.filter((booking: Booking) => {
    // Filter by room
    if (roomFilter !== "all") {
      const roomIndex: number =
        roomFilter === "a" ? 0 : roomFilter === "b" ? 1 : 2;
      if (booking.roomId !== roomIndex) return false;
    }

    // Filter by time (if showPrevious is false, only show upcoming)
    if (!showPrevious) {
      if (booking.date < todayAsNumber) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
        Loading bookings...
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 mb-4">
        <Select
          value={roomFilter}
          onValueChange={(value: string) => setRoomFilter(value as RoomFilter)}
        >
          <SelectTrigger className="max-w-[180px]">
            <SelectValue placeholder="Studio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="a">A</SelectItem>
            <SelectItem value="b">B</SelectItem>
            <SelectItem value="c">C</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          <Checkbox
            checked={showPrevious}
            onCheckedChange={setShowPrevious}
            id="showPrevious"
          />
          <label htmlFor="showPrevious" className="text-sm font-medium">
            Show Previous
          </label>
        </div>
      </div>
      {filteredBookings.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking: Booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell>{room[booking.roomId]}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.startTime}</TableCell>
                <TableCell>{booking.endTime}</TableCell>
                <TableCell>{booking.user.name ?? ""}</TableCell>
                <TableCell>
                  <Link href={`/user/admin/book/${booking.bookingId}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
          No bookings available
        </div>
      )}
    </>
  );
}
