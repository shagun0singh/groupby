export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: "user" | "host";
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
}

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.errors?.[0]?.msg || "Sign up failed");
  }

  return response.json();
}

export async function signIn(data: SignInData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

// Event API Types
export interface Event {
  _id: string;
  title: string;
  slug: string;
  type: 'Workshop' | 'Meetup' | 'Class' | 'Social' | 'Sports' | 'Arts' | 'Tech' | 'Food' | 'Other';
  category: string;
  description: string;
  image?: string;
  hostedBy: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
    hostProfile?: {
      rating: number;
      verified: boolean;
    };
  };
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: number[];
  };
  date: Date | string;
  time: string;
  duration?: string;
  maxParticipants: number;
  currentParticipants: number;
  requiresApproval: boolean;
  interests: string[];
  price: number;
  priceType: 'Free' | 'Paid' | 'Donation';
  visibility: 'public' | 'private' | 'invite-only';
  status: 'open' | 'full' | 'cancelled' | 'completed';
  requirements?: string;
  ageRestriction?: {
    minAge?: number;
    maxAge?: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  skip: number;
  limit: number;
}

export interface Participant {
  _id: string;
  user: string;
  event: Event;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'attended';
  applicationMessage?: string;
  appliedAt: Date | string;
  respondedAt?: Date | string;
  hostResponse?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// Event API Functions
export async function fetchEvents(params?: {
  skip?: number;
  limit?: number;
  category?: string;
  type?: string;
  city?: string;
  interests?: string;
  search?: string;
}): Promise<EventsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.city) queryParams.append('city', params.city);
  if (params?.interests) queryParams.append('interests', params.interests);
  if (params?.search) queryParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/api/events?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function fetchEventBySlug(slug: string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/api/events/${slug}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Event not found");
  }

  return response.json();
}

export async function createEvent(data: any): Promise<Event> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create event");
  }

  return response.json();
}

export async function updateEvent(eventId: string, data: any): Promise<Event> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update event");
  }

  return response.json();
}

export async function deleteEvent(eventId: string): Promise<void> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete event");
  }
}

export async function getMyHostedEvents(): Promise<Event[]> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/events/user/my-events`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch hosted events");
  }

  return response.json();
}

// Participant API Functions
export async function applyToEvent(eventId: string, applicationMessage?: string): Promise<Participant> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/participants/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId, applicationMessage }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Application failed");
  }

  return response.json();
}

export async function getMyApplications(): Promise<Participant[]> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/participants/my-applications`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
}

export async function approveParticipant(participantId: string, hostResponse?: string): Promise<Participant> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/approve`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ hostResponse }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve participant");
  }

  return response.json();
}

export async function rejectParticipant(participantId: string, hostResponse?: string): Promise<Participant> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/participants/${participantId}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ hostResponse }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reject participant");
  }

  return response.json();
}

