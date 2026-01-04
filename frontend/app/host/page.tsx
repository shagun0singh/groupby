 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileButton } from "@/components/ui/profile-button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2,
  Mail,
  Phone,
  Clock,
  Navigation,
  DollarSign,
} from "lucide-react";
import { API_BASE_URL, createEvent, deleteEvent, getAuthToken, getMyHostedEvents, updateEvent, type Event } from "@/lib/api";
import FooterSection from "@/components/ui/footer";

const EVENT_TYPES = ['Workshop', 'Meetup', 'Class', 'Social', 'Sports', 'Arts', 'Tech', 'Food', 'Other'];
const CATEGORIES = ['Photography', 'Cooking', 'Fitness', 'Gaming', 'Music', 'Art', 'Tech', 'Book Club', 'Language', 'Dance', 'Other'];

export default function HostEventPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [view, setView] = useState<"list" | "form">("list");
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [isLoadingMyEvents, setIsLoadingMyEvents] = useState(true);
  const [myEventsError, setMyEventsError] = useState("");
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // If not logged in, redirect to landing page
      router.push('/');
    } else {
      setIsLoggedIn(true);
      setIsChecking(false);
    }
  }, [router]);

  const [eventData, setEventData] = useState({
    title: "",
    slug: "",
    type: "Meetup",
    category: "Other",
    description: "",
    image: "",
    date: "",
    time: "",
    duration: "",
    location: {
      address: "",
      city: "",
      state: "",
      coordinates: [] as number[],
    },
    maxParticipants: 10,
    requiresApproval: true,
    interests: [] as string[],
    price: 0,
    priceType: "Free" as "Free" | "Paid" | "Donation",
    visibility: "public" as "public" | "private" | "invite-only",
    requirements: "",
    ageRestriction: {
      minAge: undefined as number | undefined,
      maxAge: undefined as number | undefined,
    },
    tags: [] as string[],
  });

  const [interestInput, setInterestInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Load events hosted by the current user
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    async function loadMyEvents() {
      try {
        setIsLoadingMyEvents(true);
        setMyEventsError("");
        const data = await getMyHostedEvents();
        setMyEvents(data);
      } catch (err: any) {
        setMyEventsError(err.message || "Failed to load your hosted events");
      } finally {
        setIsLoadingMyEvents(false);
      }
    }

    loadMyEvents();
  }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleInputChange = (field: string, value: any) => {
    if (field === "title" && !editingEventId) {
      setEventData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else if (field === "priceType") {
      setEventData((prev) => ({
        ...prev,
        priceType: value,
        price: value === "Free" ? 0 : prev.price,
      }));
    } else {
      setEventData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNestedChange = (parent: "location" | "ageRestriction", field: string, value: any) => {
    setEventData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value,
      },
    }));
  };

  const addInterest = () => {
    if (interestInput.trim() && !eventData.interests.includes(interestInput.trim().toLowerCase())) {
      setEventData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim().toLowerCase()],
      }));
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setEventData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const token = getAuthToken();
          
          const response = await fetch(
            `${API_BASE_URL}/api/location/reverse-geocode?lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to fetch location");
          }

          const data = await response.json();

          setEventData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              city: data.location.city,
              state: data.location.state,
              coordinates: [longitude, latitude],
            },
          }));
        } catch (err: any) {
          setError(err.message || "Could not fetch location details. Please enter manually.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setError("Location access denied. Please enable location permissions.");
        } else {
          setError("Could not get your location. Please enter manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Please login to create an event");
      }

      if (!eventData.title) throw new Error("Event title is required");
      if (!eventData.description) throw new Error("Description is required");
      if (!eventData.date) throw new Error("Date is required");
      if (!eventData.time) throw new Error("Time is required");
      if (!eventData.location.city) throw new Error("City is required");
      if (!eventData.location.state) throw new Error("State is required");
      if (!eventData.maxParticipants || eventData.maxParticipants < 1) throw new Error("At least 1 participant required");

      let event: Event;

      if (editingEventId) {
        event = await updateEvent(editingEventId, eventData);
      } else {
        event = await createEvent(eventData);
      }

      setEditingEventId(null);
      setView("list");
      router.push(`/events/${event.slug}`);
    } catch (err: any) {
      setError(err.message);
      console.error("Event creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 md:py-5">
        <Link href="/" className="text-2xl sm:text-3xl tracking-tight whitespace-nowrap text-black" style={{ fontFamily: 'var(--font-caveat-brush)' }}>
          GroupBy
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-black transition-colors">
              Discover
            </Link>
            <Link href="/host" className="text-black transition-colors">
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

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {view === "list" ? (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black">Your Hosted Events</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage your community gatherings and meetups
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView("form")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Host New Event
              </button>
            </div>

            {myEventsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
                {myEventsError}
              </div>
            )}

            {isLoadingMyEvents ? (
              <div className="flex justify-center items-center py-20 text-gray-500">
                Loading your events...
              </div>
            ) : myEvents.length === 0 ? (
              <div className="py-16 text-center text-gray-500 space-y-4">
                <p className="text-lg">You haven't hosted any events yet.</p>
                <button
                  type="button"
                  onClick={() => setView("form")}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Host your first event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myEvents.map((event) => (
                  <div
                    key={event._id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-all shadow-sm"
                  >
                    <div className="absolute right-3 top-3 flex gap-2 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/host/manage/${event._id}`);
                        }}
                        className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs font-semibold shadow-sm"
                      >
                        Manage ({event.currentParticipants})
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Load event data for editing
                          setEditingEventId(event._id);
                          setEventData({
                            title: event.title,
                            slug: event.slug,
                            type: event.type,
                            category: event.category,
                            description: event.description,
                            image: event.image || "",
                            date: new Date(event.date).toISOString().split('T')[0],
                            time: event.time,
                            duration: event.duration || "",
                            location: {
                              address: event.location.address,
                              city: event.location.city,
                              state: event.location.state,
                              coordinates: event.location.coordinates || [],
                            },
                            maxParticipants: event.maxParticipants,
                            requiresApproval: event.requiresApproval,
                            interests: event.interests,
                            price: event.price,
                            priceType: event.priceType,
                            visibility: event.visibility,
                            requirements: event.requirements || "",
                            ageRestriction: {
                              minAge: event.ageRestriction?.minAge,
                              maxAge: event.ageRestriction?.maxAge
                            },
                            tags: event.tags,
                          });
                          setView("form");
                        }}
                        className="rounded-full bg-white/90 hover:bg-white text-black px-3 py-1 text-xs font-semibold shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm("Are you sure you want to delete this event?")) {
                            return;
                          }
                          try {
                            setDeletingEventId(event._id);
                            await deleteEvent(event._id);
                            setMyEvents((prev) => prev.filter((e) => e._id !== event._id));
                          } catch (err: any) {
                            alert(err.message || "Failed to delete event");
                          } finally {
                            setDeletingEventId(null);
                          }
                        }}
                        className="rounded-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs font-semibold shadow-sm"
                        disabled={deletingEventId === event._id}
                      >
                        {deletingEventId === event._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    
                    <div 
                      className="cursor-pointer"
                      onClick={() => router.push(`/events/${event.slug}`)}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-black line-clamp-2 pr-32">
                        {event.title}
                      </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location.city}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.currentParticipants}/{event.maxParticipants}
                      </span>
                    </div>
                    
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                          {event.type}
                        </span>
                        <span className="text-gray-500">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black">
                  {editingEventId ? "Edit Event" : "Host an Event"}
                  </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {editingEventId ? "Update your event details" : "Create a community gathering"}
            </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setView("list");
                  setEditingEventId(null);
                  }}
                  className="text-sm text-gray-600 hover:text-black underline"
                >
                ← Back to events
                </button>
          </div>

          {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Basic Information */}
            <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Basic Information</h2>
              
                <Input
                  label="Event Title *"
                  placeholder="e.g., Morning Photography Walk"
                  value={eventData.title}
                  onChange={(value) => handleInputChange("title", value)}
                  required
                  size="large"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Event Type *</label>
                    <select
                  required
                      value={eventData.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black bg-white text-black px-3 outline-none"
                    >
                      {EVENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                <div>
                    <label className="block text-sm font-medium text-black mb-2">Category *</label>
                  <select
                    required
                      value={eventData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black bg-white text-black px-3 outline-none"
                  >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                  </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Description *</label>
                  <textarea
                    required
                    value={eventData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full h-32 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black bg-white text-black px-3 py-3 outline-none resize-none"
                    placeholder="Describe your event, what participants will do, and what makes it special..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Cover Image (optional)</label>
                  <FileUpload
                    accept="image/*"
                    fileType="image"
                    label="Upload Image"
                    description="Click to select or drag and drop"
                    onUpload={(url) => handleInputChange("image", url)}
                    value={eventData.image}
                  />
                </div>
              </section>

              {/* Date & Time */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">When</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    label="Date *"
                    type="date"
                    value={eventData.date}
                    onChange={(value) => handleInputChange("date", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="Time *"
                    type="time"
                    value={eventData.time}
                    onChange={(value) => handleInputChange("time", value)}
                    required
                    size="large"
                    prefix={<Clock className="w-4 h-4" />}
                    prefixStyling={false}
                  />
                  <Input
                    label="Duration (optional)"
                    placeholder="e.g., 2 hours"
                    value={eventData.duration}
                    onChange={(value) => handleInputChange("duration", value)}
                    size="large"
                  />
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-black">Where</h2>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  <Navigation className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                  {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
                </button>
              </div>
              
                <Input
                  label="Address *"
                  placeholder="Meeting point or venue address"
                  value={eventData.location.address}
                  onChange={(value) => handleNestedChange("location", "address", value)}
                  required
                  size="large"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City *"
                    placeholder="e.g., Mumbai"
                    value={eventData.location.city}
                    onChange={(value) => handleNestedChange("location", "city", value)}
                    required
                    size="large"
                  />
                  <Input
                    label="State *"
                    placeholder="e.g., Maharashtra"
                    value={eventData.location.state}
                    onChange={(value) => handleNestedChange("location", "state", value)}
                    required
                    size="large"
                  />
              </div>
            </section>

              {/* Participants */}
            <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Participants</h2>
              
                <Input
                  label="Maximum Participants *"
                  type="number"
                  placeholder="10"
                  value={eventData.maxParticipants.toString()}
                  onChange={(value) => handleInputChange("maxParticipants", parseInt(value) || 1)}
                  required
                  size="large"
                  prefix={<Users className="w-4 h-4" />}
                  prefixStyling={false}
                />

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="requiresApproval"
                    checked={eventData.requiresApproval}
                    onChange={(e) => handleInputChange("requiresApproval", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="requiresApproval" className="text-sm text-gray-700">
                    <span className="font-semibold">Require approval</span> - Review and approve participants before they join
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Minimum Age (optional)"
                    type="number"
                    placeholder="18"
                    value={eventData.ageRestriction.minAge?.toString() || ""}
                    onChange={(value) => handleNestedChange("ageRestriction", "minAge", value ? parseInt(value) : undefined)}
                  size="large"
                />
                <Input
                    label="Maximum Age (optional)"
                    type="number"
                    placeholder="65"
                    value={eventData.ageRestriction.maxAge?.toString() || ""}
                    onChange={(value) => handleNestedChange("ageRestriction", "maxAge", value ? parseInt(value) : undefined)}
                  size="large"
                />
              </div>
            </section>

              {/* Interests & Tags */}
            <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Interests & Tags</h2>
              
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Interests (help people find your event)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      placeholder="e.g., photography, outdoors, beginner-friendly"
                      className="flex-1 h-10 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black px-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addInterest}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {eventData.interests.map((interest, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Input
                  label="Requirements (optional)"
                  placeholder="What participants should bring or know"
                  value={eventData.requirements}
                  onChange={(value) => handleInputChange("requirements", value)}
                  size="large"
                />
            </section>

            {/* Pricing */}
            <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Pricing</h2>
              
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Price Type *</label>
                  <select
                    required
                    value={eventData.priceType}
                    onChange={(e) => handleInputChange("priceType", e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black bg-white text-black px-3 outline-none"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                    <option value="Donation">Donation-based</option>
                  </select>
                </div>

                {eventData.priceType !== "Free" && (
                    <Input
                    label="Price (₹) *"
                      type="number"
                      placeholder="500"
                    value={eventData.price.toString()}
                    onChange={(value) => handleInputChange("price", parseInt(value) || 0)}
                    required
                      size="large"
                    prefix={<DollarSign className="w-4 h-4" />}
                      prefixStyling={false}
                    />
                )}
            </section>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setView("list");
                    setEditingEventId(null);
                }}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-black text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading
                    ? editingEventId ? "Saving..." : "Creating..."
                    : editingEventId ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
        )}
      </main>
      
      <FooterSection />
    </div>
  );
}
