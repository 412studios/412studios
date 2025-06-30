"use server";
import { google } from "googleapis";
import prisma from "@/app/lib/db";

// Types for calendar events
interface BookingEvent {
  bookingId: string;
  roomId: number;
  date: number;
  startTime: number;
  endTime: number;
  userId: string;
  userName?: string;
  userEmail?: string;
  studioName?: string;
  engineerTotal?: number;
  engineerStart?: number;
  totalPrice?: number;
  status?: string;
}

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

// Initialize Google Calendar API
async function getCalendarClient() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // Validate required environment variables
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google service account credentials not configured. Please check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables.');
  }

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  // Authorize the client
  await auth.authorize();

  return google.calendar({ version: 'v3', auth });
}

// Convert booking date/time to ISO string
function formatBookingDateTime(date: number, time: number): string {
  const year = Math.floor(date / 10000);
  const month = Math.floor((date % 10000) / 100) - 1; // Month is 0-indexed
  const day = date % 100;
  
  const bookingDate = new Date(year, month, day, time, 0, 0);
  return bookingDate.toISOString();
}

// Get studio name from room ID
async function getStudioName(roomId: number): Promise<string> {
  try {
    const pricing = await prisma.pricing.findFirst({
      where: { id: roomId.toString() },
      select: { room: true }
    });
    return `Studio ${pricing?.room || roomId}`;
  } catch (error) {
    console.error('Error getting studio name:', error);
    return `Studio ${roomId}`;
  }
}

// Get user details
async function getUserDetails(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });
    return user;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
}

// Create calendar event for booking
export async function createCalendarEvent(booking: BookingEvent): Promise<string | null> {
  try {
    const calendar = await getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      console.error('Google Calendar ID not configured');
      return null;
    }

    // Get additional details
    const user = await getUserDetails(booking.userId);
    const studioName = await getStudioName(booking.roomId);

    // Format times
    const startDateTime = formatBookingDateTime(booking.date, booking.startTime);
    const endDateTime = formatBookingDateTime(booking.date, booking.endTime);

    // Create event description
    let description = `Booking ID: ${booking.bookingId}\n`;
    description += `Studio: ${studioName}\n`;
    description += `Client: ${user?.name || 'Unknown'}\n`;
    description += `Email: ${user?.email || 'Unknown'}\n`;
    description += `Duration: ${booking.endTime - booking.startTime} hours\n`;
    
    if (booking.totalPrice) {
      description += `Price: $${booking.totalPrice}\n`;
    }
    
    if (booking.engineerTotal && booking.engineerTotal > 0) {
      description += `Engineer: ${booking.engineerTotal} hours (starts at ${booking.engineerStart}:00)\n`;
    }
    
    description += `Status: ${booking.status || 'pending'}\n`;
    description += `\nCreated via 412 Studios Booking System`;

    const event: CalendarEvent = {
      summary: `${studioName} - ${user?.name || 'Booking'}`,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Toronto', // Adjust timezone as needed
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Toronto',
      },
    };

    // Note: Not adding attendees because service accounts require Domain-Wide Delegation
    // to invite attendees. Client email is included in the description instead.

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log('Calendar event created:', response.data.id);
    return response.data.id || null;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return null;
  }
}

// Update calendar event
export async function updateCalendarEvent(
  eventId: string, 
  booking: BookingEvent
): Promise<boolean> {
  try {
    const calendar = await getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId || !eventId) {
      return false;
    }

    // Get additional details
    const user = await getUserDetails(booking.userId);
    const studioName = await getStudioName(booking.roomId);

    // Format times
    const startDateTime = formatBookingDateTime(booking.date, booking.startTime);
    const endDateTime = formatBookingDateTime(booking.date, booking.endTime);

    // Update event description
    let description = `Booking ID: ${booking.bookingId}\n`;
    description += `Studio: ${studioName}\n`;
    description += `Client: ${user?.name || 'Unknown'}\n`;
    description += `Email: ${user?.email || 'Unknown'}\n`;
    description += `Duration: ${booking.endTime - booking.startTime} hours\n`;
    
    if (booking.totalPrice) {
      description += `Price: $${booking.totalPrice}\n`;
    }
    
    if (booking.engineerTotal && booking.engineerTotal > 0) {
      description += `Engineer: ${booking.engineerTotal} hours (starts at ${booking.engineerStart}:00)\n`;
    }
    
    description += `Status: ${booking.status || 'pending'}\n`;
    description += `\nUpdated via 412 Studios Booking System`;

    const event: CalendarEvent = {
      summary: `${studioName} - ${user?.name || 'Booking'}`,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Toronto',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Toronto',
      },
    };

    // Note: Not adding attendees because service accounts require Domain-Wide Delegation
    // to invite attendees. Client email is included in the description instead.

    await calendar.events.update({
      calendarId,
      eventId,
      requestBody: event,
    });

    console.log('Calendar event updated:', eventId);
    return true;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return false;
  }
}

// Delete calendar event
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  try {
    const calendar = await getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId || !eventId) {
      return false;
    }

    await calendar.events.delete({
      calendarId,
      eventId,
    });

    console.log('Calendar event deleted:', eventId);
    return true;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return false;
  }
}

// Sync all existing bookings to calendar
export async function syncAllBookingsToCalendar(): Promise<void> {
  try {
    console.log('Starting calendar sync for all bookings...');
    
    // First, get bookings that haven't been synced yet (addDetails is empty)
    const bookings = await prisma.bookings.findMany({
      where: {
        status: 'success',
        addDetails: '', // Only get bookings where addDetails is empty (not synced yet)
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      take: 50, // Limit to 50 bookings at a time to avoid timeouts
    });

    console.log(`Found ${bookings.length} successful bookings to sync`);

    if (bookings.length === 0) {
      console.log('No bookings need syncing - all appear to be already synced');
      return;
    }

    // Process bookings in smaller batches
    const batchSize = 10;
    for (let i = 0; i < bookings.length; i += batchSize) {
      const batch = bookings.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(bookings.length / batchSize)}`);
      
      for (const booking of batch) {
        try {
          const bookingEvent: BookingEvent = {
            bookingId: booking.bookingId,
            roomId: booking.roomId,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            userId: booking.userId,
            userName: booking.user?.name || undefined,
            userEmail: booking.user?.email || '',
            engineerTotal: booking.engineerTotal,
            engineerStart: booking.engineerStart,
            totalPrice: booking.totalPrice,
            status: booking.status,
          };

          const eventId = await createCalendarEvent(bookingEvent);
          
          if (eventId) {
            // Store the calendar event ID in the database for future reference
            await prisma.bookings.update({
              where: { bookingId: booking.bookingId },
              data: { addDetails: eventId },
            });
            
            console.log(`Synced booking ${booking.bookingId} to calendar event ${eventId}`);
          } else {
            console.error(`Failed to sync booking ${booking.bookingId}`);
          }
        } catch (bookingError) {
          console.error(`Error syncing booking ${booking.bookingId}:`, bookingError);
          // Continue with other bookings even if one fails
        }

        // Add delay between each booking to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Shorter delay between batches
      if (i + batchSize < bookings.length) {
        console.log('Waiting before next batch...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('Calendar sync completed');
  } catch (error) {
    console.error('Error syncing bookings to calendar:', error);
    throw error; // Re-throw to let the API endpoint handle it
  }
}