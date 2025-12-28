import { AvailabilitySlot, MeetingRequest, Meeting } from '../types';

// Mock availability slots data
// Using actual user IDs from users.ts: e1, e2, e3, e4 (entrepreneurs) and i1, i2, i3 (investors)
export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: 'slot-1',
    userId: 'e1',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true,
  },
  {
    id: 'slot-2',
    userId: 'e1',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    isAvailable: true,
  },
  {
    id: 'slot-3',
    userId: 'i1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: true,
  },
];

// Mock meeting requests data
export const meetingRequests: MeetingRequest[] = [
  {
    id: 'req-1',
    requesterId: 'i1',
    recipientId: 'e1',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    title: 'Investment Discussion',
    description: 'Would like to discuss potential investment opportunities',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-2',
    requesterId: 'e1',
    recipientId: 'i1',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '12:00',
    title: 'Startup Pitch Meeting',
    description: 'Presenting our startup idea and seeking feedback',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock confirmed meetings data
export const confirmedMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    requesterId: 'e1',
    recipientId: 'i1',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:00',
    title: 'Partnership Discussion',
    description: 'Discussing potential partnership opportunities',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'meeting-2',
    requesterId: 'i1',
    recipientId: 'e1',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    title: 'Follow-up Meeting',
    description: 'Follow-up on previous discussion',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper functions
export const getAvailabilitySlotsForUser = (userId: string): AvailabilitySlot[] => {
  return availabilitySlots.filter(slot => slot.userId === userId);
};

export const getMeetingRequestsForUser = (userId: string): MeetingRequest[] => {
  return meetingRequests.filter(
    req => req.requesterId === userId || req.recipientId === userId
  );
};

export const getPendingRequestsForUser = (userId: string): MeetingRequest[] => {
  return meetingRequests.filter(
    req => req.recipientId === userId && req.status === 'pending'
  );
};

export const getConfirmedMeetingsForUser = (userId: string): Meeting[] => {
  return confirmedMeetings.filter(
    meeting => (meeting.requesterId === userId || meeting.recipientId === userId) && meeting.status === 'confirmed'
  );
};

export const addAvailabilitySlot = (slot: Omit<AvailabilitySlot, 'id'>): AvailabilitySlot => {
  const newSlot: AvailabilitySlot = {
    ...slot,
    id: `slot-${Date.now()}`,
  };
  availabilitySlots.push(newSlot);
  return newSlot;
};

export const updateAvailabilitySlot = (slotId: string, updates: Partial<AvailabilitySlot>): AvailabilitySlot | null => {
  const index = availabilitySlots.findIndex(slot => slot.id === slotId);
  if (index === -1) return null;
  availabilitySlots[index] = { ...availabilitySlots[index], ...updates };
  return availabilitySlots[index];
};

export const deleteAvailabilitySlot = (slotId: string): boolean => {
  const index = availabilitySlots.findIndex(slot => slot.id === slotId);
  if (index === -1) return false;
  availabilitySlots.splice(index, 1);
  return true;
};

export const createMeetingRequest = (request: Omit<MeetingRequest, 'id' | 'createdAt' | 'updatedAt'>): MeetingRequest => {
  const newRequest: MeetingRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  meetingRequests.push(newRequest);
  return newRequest;
};

export const updateMeetingRequestStatus = (
  requestId: string,
  status: 'accepted' | 'declined' | 'cancelled'
): MeetingRequest | null => {
  const request = meetingRequests.find(req => req.id === requestId);
  if (!request) return null;
  
  request.status = status;
  request.updatedAt = new Date().toISOString();
  
  // If accepted, create a confirmed meeting
  if (status === 'accepted') {
    const meeting: Meeting = {
      id: `meeting-${Date.now()}`,
      requesterId: request.requesterId,
      recipientId: request.recipientId,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      title: request.title,
      description: request.description,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    confirmedMeetings.push(meeting);
  }
  
  return request;
};

