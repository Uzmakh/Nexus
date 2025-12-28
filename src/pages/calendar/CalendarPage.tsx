import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { CalendarComponent } from '../../components/meeting/Calendar';
import { MeetingRequestCard } from '../../components/meeting/MeetingRequestCard';
import { useAuth } from '../../context/AuthContext';
import { AvailabilitySlot, MeetingRequest, Meeting } from '../../types';
import {
  getAvailabilitySlotsForUser,
  getMeetingRequestsForUser,
  getPendingRequestsForUser,
  getConfirmedMeetingsForUser,
  addAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  createMeetingRequest,
  updateMeetingRequestStatus,
  availabilitySlots,
  meetingRequests,
  confirmedMeetings,
} from '../../data/meetings';
import { findUserById, users } from '../../data/users';
import { format } from 'date-fns';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [userSlots, setUserSlots] = useState<AvailabilitySlot[]>([]);
  const [allRequests, setAllRequests] = useState<MeetingRequest[]>([]);
  const [confirmedMeetingsList, setConfirmedMeetingsList] = useState<Meeting[]>([]);
  const [selectedTab, setSelectedTab] = useState<'calendar' | 'requests' | 'meetings'>('calendar');
  const [showSendRequestForm, setShowSendRequestForm] = useState(false);
  const [requestFormData, setRequestFormData] = useState({
    recipientId: '',
    date: '',
    startTime: '',
    endTime: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    setUserSlots(getAvailabilitySlotsForUser(user.id));
    setAllRequests(getMeetingRequestsForUser(user.id));
    setConfirmedMeetingsList(getConfirmedMeetingsForUser(user.id));
  };

  const handleAddSlot = (slot: Omit<AvailabilitySlot, 'id'>) => {
    const newSlot = addAvailabilitySlot(slot);
    loadData();
  };

  const handleUpdateSlot = (slotId: string, updates: Partial<AvailabilitySlot>) => {
    updateAvailabilitySlot(slotId, updates);
    loadData();
  };

  const handleDeleteSlot = (slotId: string) => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      deleteAvailabilitySlot(slotId);
      loadData();
    }
  };

  const handleSendRequest = () => {
    if (!requestFormData.recipientId || !requestFormData.date || !requestFormData.startTime || !requestFormData.endTime || !requestFormData.title) {
      alert('Please fill in all required fields');
      return;
    }

    if (requestFormData.startTime >= requestFormData.endTime) {
      alert('End time must be after start time');
      return;
    }

    createMeetingRequest({
      requesterId: user!.id,
      recipientId: requestFormData.recipientId,
      date: requestFormData.date,
      startTime: requestFormData.startTime,
      endTime: requestFormData.endTime,
      title: requestFormData.title,
      description: requestFormData.description || undefined,
      status: 'pending',
    });

    setShowSendRequestForm(false);
    setRequestFormData({
      recipientId: '',
      date: '',
      startTime: '',
      endTime: '',
      title: '',
      description: '',
    });
    loadData();
  };

  const handleAcceptRequest = (requestId: string) => {
    updateMeetingRequestStatus(requestId, 'accepted');
    loadData();
  };

  const handleDeclineRequest = (requestId: string) => {
    updateMeetingRequestStatus(requestId, 'declined');
    loadData();
  };

  const handleCancelRequest = (requestId: string) => {
    if (window.confirm('Are you sure you want to cancel this meeting request?')) {
      updateMeetingRequestStatus(requestId, 'cancelled');
      loadData();
    }
  };

  if (!user) return null;

  const pendingRequests = getPendingRequestsForUser(user.id);
  const sentRequests = allRequests.filter(req => req.requesterId === user.id && req.status === 'pending');
  const otherUsers = users.filter(u => u.id !== user.id);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Calendar</h1>
          <p className="text-gray-600">Manage your availability and meeting requests</p>
        </div>
        <Button
          leftIcon={<Send size={18} />}
          onClick={() => setShowSendRequestForm(true)}
        >
          Send Meeting Request
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setSelectedTab('calendar')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'calendar'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} />
              Availability Calendar
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={18} />
              Meeting Requests
              {pendingRequests.length > 0 && (
                <Badge variant="primary" className="ml-1">
                  {pendingRequests.length}
                </Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('meetings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'meetings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={18} />
              Confirmed Meetings
              {confirmedMeetingsList.length > 0 && (
                <Badge variant="success" className="ml-1">
                  {confirmedMeetingsList.length}
                </Badge>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Calendar Tab */}
      {selectedTab === 'calendar' && (
        <CalendarComponent
          userId={user.id}
          availabilitySlots={userSlots}
          onAddSlot={handleAddSlot}
          onUpdateSlot={handleUpdateSlot}
          onDeleteSlot={handleDeleteSlot}
        />
      )}

      {/* Requests Tab */}
      {selectedTab === 'requests' && (
        <div className="space-y-6">
          {/* Pending Requests (Received) */}
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Pending Requests (Received)</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {pendingRequests.map(request => {
                  const requester = findUserById(request.requesterId);
                  return (
                    <MeetingRequestCard
                      key={request.id}
                      request={request}
                      currentUserId={user.id}
                      requesterName={requester?.name || 'Unknown'}
                      recipientName={user.name}
                      onAccept={handleAcceptRequest}
                      onDecline={handleDeclineRequest}
                    />
                  );
                })}
              </CardBody>
            </Card>
          )}

          {/* Sent Requests */}
          {sentRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Sent Requests</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {sentRequests.map(request => {
                  const recipient = findUserById(request.recipientId);
                  return (
                    <MeetingRequestCard
                      key={request.id}
                      request={request}
                      currentUserId={user.id}
                      requesterName={user.name}
                      recipientName={recipient?.name || 'Unknown'}
                      onCancel={handleCancelRequest}
                    />
                  );
                })}
              </CardBody>
            </Card>
          )}

          {/* All Requests */}
          {allRequests.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">All Requests</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {allRequests
                  .filter(req => req.status !== 'pending' || (req.requesterId !== user.id && req.recipientId !== user.id))
                  .map(request => {
                    const requester = findUserById(request.requesterId);
                    const recipient = findUserById(request.recipientId);
                    return (
                      <MeetingRequestCard
                        key={request.id}
                        request={request}
                        currentUserId={user.id}
                        requesterName={requester?.name || 'Unknown'}
                        recipientName={recipient?.name || 'Unknown'}
                      />
                    );
                  })}
              </CardBody>
            </Card>
          )}

          {pendingRequests.length === 0 && sentRequests.length === 0 && (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-gray-600">No meeting requests</p>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* Confirmed Meetings Tab */}
      {selectedTab === 'meetings' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Confirmed Meetings</h2>
          </CardHeader>
          <CardBody>
            {confirmedMeetingsList.length > 0 ? (
              <div className="space-y-4">
                {confirmedMeetingsList.map(meeting => {
                  const otherUser = findUserById(
                    meeting.requesterId === user.id ? meeting.recipientId : meeting.requesterId
                  );
                  return (
                    <Card key={meeting.id} className="border-l-4 border-l-success-500">
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {meeting.title}
                            </h3>
                            {meeting.description && (
                              <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                            )}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CalendarIcon size={16} />
                                <span>{format(new Date(meeting.date), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={16} />
                                <span>
                                  {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>With: {otherUser?.name || 'Unknown'}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="success">{meeting.status}</Badge>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No confirmed meetings</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Send Request Modal */}
      {showSendRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Send Meeting Request</h2>
              <button
                onClick={() => setShowSendRequestForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Recipient *
                </label>
                <select
                  value={requestFormData.recipientId}
                  onChange={(e) => setRequestFormData(prev => ({ ...prev, recipientId: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Choose a user...</option>
                  {otherUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role === 'entrepreneur' ? u.startupName : 'Investor'})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Date *"
                type="date"
                value={requestFormData.date}
                onChange={(e) => setRequestFormData(prev => ({ ...prev, date: e.target.value }))}
                fullWidth
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Time *"
                  type="time"
                  value={requestFormData.startTime}
                  onChange={(e) => setRequestFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  fullWidth
                />
                <Input
                  label="End Time *"
                  type="time"
                  value={requestFormData.endTime}
                  onChange={(e) => setRequestFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  fullWidth
                />
              </div>

              <Input
                label="Title *"
                type="text"
                value={requestFormData.title}
                onChange={(e) => setRequestFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Investment Discussion"
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={requestFormData.description}
                  onChange={(e) => setRequestFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSendRequest} className="flex-1">
                  Send Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSendRequestForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

