import React from "react";

const events = [
  {
    start: new Date("2024-01-06"),
    name: "New Year, New Art - Group Exhbit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
  },
  {
    start: new Date("2024-11-14"),
    end: new Date("2024-11-17"),
    name: "Culture Crawl",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
  },
  {
    start: new Date("2025-04-12"),
    name: "Colour Collective: Yellow 🟨 - Group Exhibit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
  },
  {
    start: new Date("2025-06-12"),
    end: new Date("2025-06-15"),
    name: "Man+Machine - Solo Exhibit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
  },
];

const now = new Date();

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getGoogleMapsUrl = (address) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
};

const EventItem = ({ event }) => (
  <li className="mb-4">
    <p className="font-bold">{event.name}</p>
    <p>
      {formatDate(event.start)}
      {event.end && ` - ${formatDate(event.end)}`}
    </p>
    <a
      href={getGoogleMapsUrl(event.location)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {event.location}
    </a>
  </li>
);

export const UpcomingEvents = () => {
  const upcomingEvents = events.filter((event) => event.start > now);

  return (
    <ul>
      {upcomingEvents.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </ul>
  );
};

export const PastEvents = () => {
  const pastEvents = events.filter((event) => (event.end || event.start) < now);

  return (
    <ul>
      {pastEvents.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </ul>
  );
};
