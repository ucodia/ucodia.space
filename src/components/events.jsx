import React from "react";

const events = [
  {
    start: new Date("2024-01-06"),
    name: "New Year, New Art - Group Exhbit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
    description:
      "Join me for my first exibit and artistic debut on this new year!",
  },
  {
    start: new Date("2024-11-14"),
    end: new Date("2024-11-17"),
    name: "Man + Machine live installation - Culture Crawl Exhibit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
    description:
      "Come check out unique algorithmic art coming to life as I collaborate with my trusty drawing machine. You may even be able to create your own and bring it home!.",
  },
  {
    start: new Date("2025-04-12"),
    name: "Colour Collective: Yellow 🟨 - Group Exhibit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
  },
  {
    start: new Date("2025-06-12"),
    end: new Date("2025-06-15"),
    name: "Code is a paintbrush 🎨 - Solo Exhibit",
    location: "Slice of Life, 1636 Venables St, Vancouver, BC V5L 2H2",
    description:
      "Discover a collection of works that started from code and travelled to our world through various means of transformation, it is a tale of what occurs when navigating between realms and the unique manifestations of machine co-creation.",
  },
  {
    start: new Date("2025-08-20"),
    name: "Wattsup - MUTEK AI Ecologies Lab Exhibit",
    location: "Monument-National, 1182 St Laurent Blvd, Montreal, Quebec H2X 2S5",
    description:
      "Wattsup shines a light on AI energy usage by measuring, interpreting and offerring recommendations for a more efficient usage of AI and a sustainable future.",
  },
  {
    start: new Date("2025-10-26"),
    name: "Mycologue Demo - 44th Annual Fall Mushroom Show",
    location: "VanDusen Botanical Garden, 5251 Oak St, Vancouver, BC V6M 4H1",
    description:
      "Come discover Mycologue, a 3D catalog of mushrooms for the modern era.",
  },
];

const now = new Date();

const formatDate = (date) => {
  return date.toLocaleString(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
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
    {event.description && <p className="italic">{event.description}</p>}
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
  const upcomingEvents = events
    .filter((event) => event.start > now)
    .sort((a, b) => a.start - b.start);

  return (
    <ul>
      {upcomingEvents.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </ul>
  );
};

export const PastEvents = () => {
  const pastEvents = events
    .filter((event) => (event.end || event.start) < now)
    .sort((a, b) => (b.start) - (a.start));

  return (
    <ul>
      {pastEvents.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </ul>
  );
};
