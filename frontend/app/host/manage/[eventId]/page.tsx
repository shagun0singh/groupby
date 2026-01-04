"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileButton } from "@/components/ui/profile-button";
import { ArrowLeft, Check, X, Loader2, User, Mail, Clock, MessageSquare } from "lucide-react";
import { getAuthToken, API_BASE_URL } from "@/lib/api";
import FooterSection from "@/components/ui/footer";

interface Participant {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
    bio?: string;
    interests?: string[];
  };
  event: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applicationMessage?: string;
  appliedAt: string;
  respondedAt?: string;
  hostResponse?: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
}

export default function ManageParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    loadParticipants();
  }, [eventId, router]);

  const loadParticipants = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      console.log("Loading participants for event:", eventId);
      console.log("API URL:", `${API_BASE_URL}/api/events/${eventId}/participants`);
      console.log("Token:", token ? "Present" : "Missing");

      // Get participants
      const participantsRes = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Participants response status:", participantsRes.status);
      
      if (!participantsRes.ok) {
        const errorText = await participantsRes.text();
        console.log("Error response:", errorText);
      }

      if (!participantsRes.ok) {
        const errorData = await participantsRes.json().catch(() => ({}));
        console.error("Failed to load participants:", errorData);
        throw new Error(errorData.message || "Failed to load participants");
      }

      const participantsData = await participantsRes.json();
      console.log("Loaded participants:", participantsData);
      setParticipants(participantsData);

      // Get event details (for display)
      if (participantsData.length > 0 && participantsData[0].event) {
        const eventData = typeof participantsData[0].event === 'object' 
          ? participantsData[0].event 
          : null;
        if (eventData) {
          setEvent(eventData);
        }
      }
    } catch (err) {
      console.error("Error loading participants:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (participantId: string) => {
    try {
      setProcessingId(participantId);
      const token = getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/participants/${participantId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve");
      }

      // Reload participants
      await loadParticipants();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve participant");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (participantId: string) => {
    const reason = prompt("Optional: Provide a reason for rejection");
    
    try {
      setProcessingId(participantId);
      const token = getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/participants/${participantId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hostResponse: reason || undefined,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject");
      }

      // Reload participants
      await loadParticipants();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject participant");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingParticipants = participants.filter((p) => p.status === "pending");
  const approvedParticipants = participants.filter((p) => p.status === "approved");
  const rejectedParticipants = participants.filter((p) => p.status === "rejected");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              href="/host"
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden sm:inline">Back to Events</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Event Info */}
        {event && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2">{event.title}</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500">Total Applicants:</span>{" "}
                <span className="font-semibold">{participants.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Approved:</span>{" "}
                <span className="font-semibold text-green-600">
                  {approvedParticipants.length} / {event.maxParticipants}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Pending:</span>{" "}
                <span className="font-semibold text-yellow-600">
                  {pendingParticipants.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Pending Applications */}
        {pendingParticipants.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
              Pending Applications ({pendingParticipants.length})
            </h2>
            <div className="space-y-4">
              {pendingParticipants.map((participant) => (
                <ParticipantCard
                  key={participant._id}
                  participant={participant}
                  onApprove={() => handleApprove(participant._id)}
                  onReject={() => handleReject(participant._id)}
                  isProcessing={processingId === participant._id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Approved Participants */}
        {approvedParticipants.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
              Approved Participants ({approvedParticipants.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedParticipants.map((participant) => (
                <ApprovedParticipantCard
                  key={participant._id}
                  participant={participant}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rejected Applications */}
        {rejectedParticipants.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-500 mb-4">
              Rejected ({rejectedParticipants.length})
            </h2>
            <div className="space-y-3">
              {rejectedParticipants.map((participant) => (
                <div
                  key={participant._id}
                  className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {participant.user.profilePic ? (
                      <img
                        src={participant.user.profilePic}
                        alt={participant.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-700">
                        {participant.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rejected on{" "}
                        {new Date(participant.respondedAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {participants.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-500">
              When people apply to join your event, they'll appear here.
            </p>
          </div>
        )}
      </main>
      
      <FooterSection />
    </div>
  );
}

function ParticipantCard({
  participant,
  onApprove,
  onReject,
  isProcessing,
}: {
  participant: Participant;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {participant.user.profilePic ? (
            <img
              src={participant.user.profilePic}
              alt={participant.user.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-lg sm:text-2xl font-bold flex-shrink-0">
              {participant.user.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-black truncate">
              {participant.user.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{participant.user.email}</span>
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              Applied {new Date(participant.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {participant.user.bio && (
        <div className="mb-4">
          <p className="text-sm text-gray-700">{participant.user.bio}</p>
        </div>
      )}

      {participant.user.interests && participant.user.interests.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Interests:</p>
          <div className="flex flex-wrap gap-2">
            {participant.user.interests.map((interest, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {participant.applicationMessage && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Application Message:
          </p>
          <p className="text-sm text-gray-700">{participant.applicationMessage}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={onApprove}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Approve
            </>
          )}
        </button>
        <button
          onClick={onReject}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <X className="w-4 h-4" />
              Reject
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ApprovedParticipantCard({ participant }: { participant: Participant }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-green-200">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        {participant.user.profilePic ? (
          <img
            src={participant.user.profilePic}
            alt={participant.user.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white text-base sm:text-lg font-bold flex-shrink-0">
            {participant.user.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-black text-sm sm:text-base truncate">{participant.user.name}</h4>
          <p className="text-xs text-gray-500 truncate">{participant.user.email}</p>
        </div>
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex-shrink-0">
          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Approved on {new Date(participant.respondedAt || "").toLocaleDateString()}
      </p>
    </div>
  );
}

