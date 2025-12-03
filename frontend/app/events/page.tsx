"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SuggestiveSearch from "@/components/ui/suggestive-search";
import { ProfileButton } from "@/components/ui/profile-button";
import Pagination from "@/components/ui/pagination";
import { Loader2, MapPin, Users, Calendar, Clock } from "lucide-react";
import { getAuthToken, fetchEvents, type Event } from "@/lib/api";

const ITEMS_PER_PAGE = 12;

export default function EventsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchEvents({
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          search: searchTerm || undefined,
        });

        setEvents(data.events);
        setTotalEvents(data.total);
      } catch (err) {
        console.error("Failed to load events:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load events");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.slug}`);
  };

  return (
    <div className="min-h-screen relative bg-white">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-8 py-5">
        <Link href="/" className="text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          GroupBy
        </Link>
        
        <div className="flex-1 max-w-md mx-6">
          <SuggestiveSearch
            suggestions={[
              "Search for workshops",
              "Find meetups near you",
              "Explore cooking classes",
              "Discover photography walks"
            ]}
            effect="typewriter"
            className="w-full"
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-black transition-colors">
              Discover
            </Link>
            <Link href="/host" className="text-gray-700 hover:text-black transition-colors">
              Host Event
            </Link>
            {!isLoggedIn && (
              <Link href="/login" className="text-gray-700 hover:text-black transition-colors">
                Login
              </Link>
            )}
          </nav>
          <ProfileButton />
        </div>
      </header>

      <main className="px-6 lg:px-16 py-12 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
        </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">
              {searchTerm ? "No events found matching your search" : "No events available yet"}
            </p>
            {!searchTerm && (
              <Link
                href="/host"
                className="text-gray-800 hover:text-black underline"
              >
                Be the first to host an event!
              </Link>
            )}
                </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event: Event) => (
                <div
                  key={event._id}
                  onClick={() => handleEventClick(event)}
                  className="cursor-pointer group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {event.image && (
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full">
                          {event.type}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.interests.slice(0, 3).map((interest, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location.city}, {event.location.state}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.currentParticipants}/{event.maxParticipants} joined
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-sm font-semibold text-black">
                        {event.priceType === 'Free' ? 'Free' : `₹${event.price}`}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        event.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status === 'open' ? 'Open' : event.status === 'full' ? 'Full' : event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
}
