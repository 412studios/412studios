"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H2, H4 } from "@/components/ui/copy";
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
import { Calendar, Clock, User, MapPin, ArrowLeft } from "lucide-react";
import { getAllBooking, deleteBooking } from "@/app/lib/booking";
import { timeSlots } from "@/app/user/(payment)/book/components/timeSlots";

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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editedStartTime, setEditedStartTime] = useState<number>(0);
  const [editedEndTime, setEditedEndTime] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [conflictError, setConflictError] = useState<string>("");

  const room: string[] = ["A", "B", "C"];

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

  const getTimeDisplay = (timeSlotId: number): string => {
    const timeSlot = timeSlots.find((slot) => slot.id === timeSlotId);
    return timeSlot ? timeSlot.displayStart : `${timeSlotId}:00`;
  };

  const getDuration = (startTime: number, endTime: number): string => {
    const duration = endTime - startTime;
    return `${duration} hour${duration !== 1 ? "s" : ""}`;
  };

  const isUpcoming = (dateNum: number): boolean => {
    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0].replace(/-/g, "");
    const todayAsNumber = parseInt(todayFormatted);
    return dateNum >= todayAsNumber;
  };

  const today: Date = new Date();
  const todayFormatted: string = today
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  const todayAsNumber: number = parseInt(todayFormatted);

  const filteredBookings: Booking[] = bookings.filter((booking: Booking) => {
    if (roomFilter !== "all") {
      const roomIndex: number =
        roomFilter === "a" ? 0 : roomFilter === "b" ? 1 : 2;
      if (booking.roomId !== roomIndex) return false;
    }

    if (!showPrevious) {
      if (booking.date < todayAsNumber) return false;
    }

    if (searchTerm.trim() !== "") {
      const userName = booking.user.name?.toLowerCase() || "";
      if (!userName.includes(searchTerm.toLowerCase())) return false;
    }

    return true;
  });

  const handleViewDetails = (booking: Booking): void => {
    setSelectedBooking(booking);
    setEditedStartTime(booking.startTime);
    setEditedEndTime(booking.endTime);
    setConflictError("");
  };

  const handleBackToList = (): void => {
    setSelectedBooking(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.bookingId !== id));
      setSelectedBooking(null);
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const handleResetTimes = () => {
    if (selectedBooking) {
      setEditedStartTime(selectedBooking.startTime);
      setEditedEndTime(selectedBooking.endTime);
      setConflictError("");
    }
  };

  const checkTimeConflict = async (bookingId: string, roomId: number, date: number, startTime: number, endTime: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/booking/check-conflict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, roomId, date, startTime, endTime })
      });
      const result = await response.json();
      return result.hasConflict;
    } catch (error) {
      console.error('Error checking conflict:', error);
      return true;
    }
  };

  const updateBookingTimes = async (bookingId: string, startTime: number, endTime: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/booking/update-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, startTime, endTime })
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating booking:', error);
      return false;
    }
  };

  const validateTimes = (): string | null => {
    if (editedStartTime >= editedEndTime) {
      return "End time must be after start time.";
    }
    if (editedEndTime - editedStartTime < 2) {
      return "Booking must be at least 2 hours long. Please select an end time that is at least 2 hours after the start time.";
    }
    return null;
  };

  const handleStartTimeChange = (value: string) => {
    const newStartTime = parseInt(value);
    
    // Validate the new start time
    if (newStartTime >= editedEndTime || editedEndTime - newStartTime < 2) {
      // Snap back to original start time if invalid
      if (selectedBooking) {
        setEditedStartTime(selectedBooking.startTime);
      }
      return;
    }
    
    setEditedStartTime(newStartTime);
    setConflictError("");
  };

  const handleEndTimeChange = (value: string) => {
    const newEndTime = parseInt(value);
    
    // Validate the new end time
    if (newEndTime <= editedStartTime || newEndTime - editedStartTime < 2) {
      // Snap back to original end time if invalid
      if (selectedBooking) {
        setEditedEndTime(selectedBooking.endTime);
      }
      return;
    }
    
    setEditedEndTime(newEndTime);
    setConflictError("");
  };

  const handleSaveTimeChanges = async () => {
    if (!selectedBooking) return;

    setSaving(true);
    setConflictError("");

    // Validate times
    const validationError = validateTimes();
    if (validationError) {
      setConflictError(validationError);
      setSaving(false);
      return;
    }

    const hasConflict = await checkTimeConflict(
      selectedBooking.bookingId,
      selectedBooking.roomId,
      selectedBooking.date,
      editedStartTime,
      editedEndTime
    );

    if (hasConflict) {
      setConflictError("Time conflict detected. Please choose different times.");
      setSaving(false);
      return;
    }

    const success = await updateBookingTimes(
      selectedBooking.bookingId,
      editedStartTime,
      editedEndTime
    );

    if (success) {
      const updatedBookings = bookings.map(booking => 
        booking.bookingId === selectedBooking.bookingId
          ? { ...booking, startTime: editedStartTime, endTime: editedEndTime }
          : booking
      );
      setBookings(updatedBookings);
      setSelectedBooking({ ...selectedBooking, startTime: editedStartTime, endTime: editedEndTime });
    } else {
      setConflictError("Failed to update booking times. Please try again.");
    }

    setSaving(false);
  };

  const BookingDetailView = ({ booking }: { booking: Booking }) => (
    <div className="flex flex-col h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={2}>
              <H4>Booking Details - Studio {room[booking.roomId]}</H4>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={2}>Booking ID: {booking.bookingId}</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>
              <Input
                value={isUpcoming(booking.date) ? "Upcoming" : "Completed"}
                disabled
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>
              <Input value={formatDate(booking.date)} disabled />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>
              <Input value={booking.user.name || "Unknown User"} disabled />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>
              <Select
                value={editedStartTime.toString()}
                onValueChange={handleStartTimeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {slot.displayStart}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>End Time</TableCell>
            <TableCell>
              <Select
                value={editedEndTime.toString()}
                onValueChange={handleEndTimeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {slot.displayStart}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
          {(conflictError || validateTimes()) && (
            <TableRow>
              <TableCell colSpan={2}>
                <div className="text-red-500 text-sm">{conflictError || validateTimes()}</div>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={2}>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToList}
                  className="flex items-center gap-2 pl-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  variant="default" 
                  size="default"
                  onClick={handleSaveTimeChanges}
                  disabled={saving || (editedStartTime === booking.startTime && editedEndTime === booking.endTime) || validateTimes() !== null}
                >
                  {saving ? "Saving..." : "Save Times"}
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={handleResetTimes}
                  disabled={saving}
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="default"
                  onClick={() => handleDelete(booking.bookingId)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
        Loading bookings...
      </div>
    );
  }

  if (selectedBooking) {
    return <BookingDetailView booking={selectedBooking} />;
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
          <Link href="/user/book">
            <Button>Create</Button>
          </Link>
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
      <div className="h-full flex-1 overflow-auto">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
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
