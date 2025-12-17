export interface Room {
  name: string;
  dayImage: string;
  nightImage: string;
  links: Array<{
    x: number;
    y: number;
    href: string;
    label: string;
  }>;
}

export const rooms: Room[] = [
  {
    name: "Studio A",
    dayImage: "/renders/room-a-day.png",
    nightImage: "/renders/room-a-night.png",
    links: [{ x: 50.5, y: 83.8, href: "/booking", label: "Book Now" }],
  },
  {
    name: "Live Room",
    dayImage: "/renders/live-room-day.png",
    nightImage: "/renders/live-room-night.png",
    links: [],
  },
  {
    name: "Lounge",
    dayImage: "/renders/lounge-day.png",
    nightImage: "/renders/lounge-night.png",
    links: [{ x: 24.6, y: 22, href: "/booking", label: "Book Now" }],
  },
  {
    name: "Kitchen",
    dayImage: "/renders/kitchen-day.png",
    nightImage: "/renders/kitchen-night.png",
    links: [],
  },
];
