"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ProfileButton } from "@/components/ui/profile-button";
import { ArrowLeft, MapPin, Calendar, Clock, Users, Mail, Phone, Instagram, Linkedin, Loader2, CheckCircle } from "lucide-react";
import { getAuthToken, fetchEventBySlug, applyToEvent, getMyApplications, type Event, type Participant } from "@/lib/api";
import FooterSection from "@/components/ui/footer";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [myApplication, setMyApplication] = useState<Participant | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        console.error("Failed to load event:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load event");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [slug]);

  // Check if user already applied
  useEffect(() => {
    async function checkApplication() {
      if (!event) return;
      const token = getAuthToken();
      if (!token) return;

      try {
        const applications: Participant[] = await getMyApplications();
        const existing = applications.find((app) => 
          app.event && (typeof app.event === 'object' ? app.event._id === event._id : app.event === event._id)
        );
        if (existing) {
          setMyApplication(existing);
        }
      } catch (err) {
        console.error("Failed to check application status:", err);
      }
    }

    checkApplication();
  }, [event]);

  const handleApplyClick = async () => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    if (!event) {
      alert("Event not found. Please try again.");
      return;
    }

    try {
      setIsApplying(true);
      const application = await applyToEvent(event._id, applicationMessage);
      setMyApplication(application);
      alert(event.requiresApproval 
        ? `Application submitted! The host will review and respond soon.` 
        : `You're in! See you at the event! 🎉`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Application failed";
      alert(message);
    } finally {
      setIsApplying(false);
      setApplicationMessage("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-black">Event not found</h1>
          <Link
            href="/events"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  const isFull = event.currentParticipants >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.currentParticipants;

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="relative w-full h-[40vh] sm:h-[50vh] min-h-[300px] sm:min-h-[400px] overflow-hidden">
        {event.image ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-50">
          <Link
            href="/events"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-gray-900/60 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-900/70 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Events</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 lg:px-16 pb-6 sm:pb-10">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 text-xs font-medium bg-white/90 text-gray-900 rounded-full">
                {event.type}
              </span>
              <span className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 text-xs font-medium bg-white/90 text-gray-900 rounded-full">
                {event.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl line-clamp-2 sm:line-clamp-none">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-white/85">
              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{event.time}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{event.location.city}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{event.currentParticipants}/{event.maxParticipants} joined</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Bar */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-16 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-black truncate">{event.title}</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {event.priceType === 'Free' ? 'Free Event' : `₹${event.price}`}
              {spotsLeft > 0 && spotsLeft <= 5 && <span className="ml-2 text-orange-600">• Only {spotsLeft} spots left!</span>}
            </p>
          </div>
          <div className="flex flex-col sm:flex-col items-stretch sm:items-end gap-1 w-full sm:w-auto">
            {myApplication ? (
              <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {myApplication.status === 'pending' && 'Application Pending'}
                  {myApplication.status === 'approved' && "You're In!"}
                  {myApplication.status === 'rejected' && 'Not Approved'}
                  {myApplication.status === 'cancelled' && 'Cancelled'}
                </span>
              </div>
            ) : (
              <button 
                onClick={() => {
                  const token = getAuthToken();
                  if (!token) {
                    router.push('/login');
                  } else if (event.requiresApproval) {
                    const message = prompt("Why would you like to join this event? (Optional)");
                    if (message !== null) {
                      setApplicationMessage(message);
                      handleApplyClick();
                    }
                  } else {
                    handleApplyClick();
                  }
                }}
                disabled={isApplying || isFull}
                className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : isFull ? (
                  "Event Full"
                ) : event.requiresApproval ? (
                  "Apply to Join"
                ) : (
                  "Join Now"
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">About this event</h3>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </section>

            {/* What to bring/know */}
            {event.requirements && (
              <section className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">What you'll need</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {event.requirements}
                </p>
              </section>
            )}

            {/* Interests */}
            {event.interests && event.interests.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {event.interests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">
                Event Details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">When</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-600">{event.time}</div>
                  {event.duration && <div className="text-sm text-gray-600">Duration: {event.duration}</div>}
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Where</div>
                  <div className="text-sm font-medium text-gray-900">{event.location.address || event.location.city}</div>
                  <div className="text-sm text-gray-600">{event.location.city}, {event.location.state}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Group Size</div>
                  <div className="text-sm font-medium text-gray-900">{event.currentParticipants}/{event.maxParticipants} people</div>
                  {spotsLeft > 0 && spotsLeft <= 5 && (
                    <div className="text-xs text-orange-600 mt-1">Only {spotsLeft} spots remaining</div>
                  )}
                </div>
                {event.ageRestriction && (event.ageRestriction.minAge || event.ageRestriction.maxAge) && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Age</div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.ageRestriction.minAge && event.ageRestriction.maxAge 
                        ? `${event.ageRestriction.minAge}-${event.ageRestriction.maxAge} years`
                        : event.ageRestriction.minAge 
                        ? `${event.ageRestriction.minAge}+ years`
                        : `Up to ${event.ageRestriction.maxAge} years`
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Host Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h4 className="text-sm font-semibold mb-4 text-gray-900 uppercase tracking-wider">
                Hosted by
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {event.hostedBy.profilePic ? (
                    <img src={event.hostedBy.profilePic} alt={event.hostedBy.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                      {event.hostedBy.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{event.hostedBy.name}</p>
                      {event.hostedBy.hostProfile?.verified && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    {event.hostedBy.hostProfile?.rating && (
                      <div className="text-xs text-gray-600">
                        ⭐ {event.hostedBy.hostProfile.rating.toFixed(1)} rating
                      </div>
                    )}
                  </div>
                </div>
                {event.hostedBy.email && (
                  <a
                    href={`mailto:${event.hostedBy.email}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact host
                  </a>
                )}
              </div>
            </div>

            {/* Application Status */}
            {myApplication && (
              <div className={`border rounded-lg p-5 ${
                myApplication.status === 'approved' ? 'bg-green-50 border-green-200' :
                myApplication.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="text-sm font-semibold mb-2">Your Application</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Status: <span className="font-semibold capitalize">{myApplication.status}</span>
                </p>
                {myApplication.hostResponse && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Host's response:</p>
                    <p className="text-sm text-gray-700">{myApplication.hostResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
}
