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
import { Input } from "@/components/ui/input";
import { getAllBooking } from "@/app/lib/booking";
import { timeSlots } from "@/app/user/(payment)/book/components/timeSlots";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
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

  // Helper function to format date from YYYYMMDD to readable format
  const formatDate = (dateNum: number): string => {
    const dateStr = dateNum.toString();
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get time display from time slot ID
  const getTimeDisplay = (timeSlotId: number): string => {
    const timeSlot = timeSlots.find((slot) => slot.id === timeSlotId);
    return timeSlot ? timeSlot.displayStart : `${timeSlotId}:00`;
  };

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

    // Filter by user name
    if (searchTerm.trim() !== "") {
      const userName = booking.user.name?.toLowerCase() || "";
      if (!userName.includes(searchTerm.toLowerCase())) return false;
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
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div className="flex gap-4 mb-4 flex-wrap">
          <Select
            value={roomFilter}
            onValueChange={(value: string) =>
              setRoomFilter(value as RoomFilter)
            }
          >
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Studio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Studios</SelectItem>
              <SelectItem value="a">Studio A</SelectItem>
              <SelectItem value="b">Studio B</SelectItem>
              <SelectItem value="c">Studio C</SelectItem>
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
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Search by user name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="h-full flex-1">
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
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{getTimeDisplay(booking.startTime)}</TableCell>
                  <TableCell>{getTimeDisplay(booking.endTime)}</TableCell>
                  <TableCell>{booking.user.name ?? ""}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
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
      </div>
    </div>
  );
}
