import React from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MeetingRequest } from '../../types';
import { format } from 'date-fns';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  currentUserId: string;
  requesterName: string;
  recipientName: string;
  onAccept?: (requestId: string) => void;
  onDecline?: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({
  request,
  currentUserId,
  requesterName,
  recipientName,
  onAccept,
  onDecline,
  onCancel,
}) => {
  const isRequester = request.requesterId === currentUserId;
  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';
  const isDeclined = request.status === 'declined';

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className={`transition-all duration-200 ${
      isPending ? 'border-l-4 border-l-primary-500' : ''
    }`}>
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
              <Badge 
                variant={
                  isAccepted ? 'success' : 
                  isDeclined ? 'error' : 
                  'primary'
                }
              >
                {request.status}
              </Badge>
            </div>

            {request.description && (
              <p className="text-sm text-gray-600 mb-3 flex items-start gap-2">
                <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                {request.description}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>
                  {isRequester ? (
                    <>Requested with <span className="font-medium">{recipientName}</span></>
                  ) : (
                    <>Requested by <span className="font-medium">{requesterName}</span></>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>{formatDate(request.date)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{formatTime(request.startTime)} - {formatTime(request.endTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
            {!isRequester ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle size={16} />}
                  onClick={() => onAccept?.(request.id)}
                  className="flex-1"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<XCircle size={16} />}
                  onClick={() => onDecline?.(request.id)}
                  className="flex-1"
                >
                  Decline
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<XCircle size={16} />}
                onClick={() => onCancel?.(request.id)}
                className="flex-1"
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

