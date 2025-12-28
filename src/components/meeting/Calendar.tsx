import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { AvailabilitySlot } from '../../types';
import { format } from 'date-fns';

interface CalendarComponentProps {
  userId: string;
  availabilitySlots: AvailabilitySlot[];
  onAddSlot: (slot: Omit<AvailabilitySlot, 'id'>) => void;
  onUpdateSlot: (slotId: string, updates: Partial<AvailabilitySlot>) => void;
  onDeleteSlot: (slotId: string) => void;
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  userId,
  availabilitySlots,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  selectedDate,
  onDateSelect,
}) => {
  const [calendarDate, setCalendarDate] = useState<Date>(selectedDate || new Date());
  const [showAddSlotForm, setShowAddSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [formData, setFormData] = useState({
    date: calendarDate.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
  });

  const handleDateChange = (date: Date) => {
    setCalendarDate(date);
    setFormData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    onDateSelect?.(date);
  };

  const handleAddSlot = () => {
    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time');
      return;
    }

    if (editingSlot) {
      onUpdateSlot(editingSlot.id, {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setEditingSlot(null);
    } else {
      onAddSlot({
        userId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isAvailable: true,
      });
    }
    
    setShowAddSlotForm(false);
    setFormData({
      date: calendarDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
    });
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    setShowAddSlotForm(true);
    // Set calendar to the slot's date
    const slotDate = new Date(slot.date);
    setCalendarDate(slotDate);
  };

  const handleCancel = () => {
    setShowAddSlotForm(false);
    setEditingSlot(null);
    setFormData({
      date: calendarDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
    });
  };

  const getSlotsForDate = (date: Date): AvailabilitySlot[] => {
    const dateString = date.toISOString().split('T')[0];
    return availabilitySlots.filter(
      slot => slot.userId === userId && slot.date === dateString && slot.isAvailable
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const slots = getSlotsForDate(date);
    if (slots.length > 0) {
      return 'has-slots';
    }
    return '';
  };

  const selectedDateSlots = getSlotsForDate(calendarDate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Availability Calendar</h2>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setShowAddSlotForm(true);
              setEditingSlot(null);
              setFormData({
                date: calendarDate.toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
              });
            }}
          >
            Add Slot
          </Button>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar */}
            <div className="flex-1">
              <div className="react-calendar-wrapper">
                <Calendar
                  onChange={handleDateChange}
                  value={calendarDate}
                  tileClassName={tileClassName}
                  className="w-full"
                />
              </div>
            </div>

            {/* Availability slots for selected date */}
            <div className="lg:w-80">
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  {format(calendarDate, 'MMMM dd, yyyy')}
                </h3>
                
                {selectedDateSlots.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateSlots.map(slot => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSlot(slot)}
                            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                            title="Edit slot"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteSlot(slot.id)}
                            className="p-1 text-gray-500 hover:text-error-600 transition-colors"
                            title="Delete slot"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No availability slots for this date</p>
                )}
              </div>

              {/* Add/Edit Slot Form */}
              {showAddSlotForm && (
                <Card className="border-primary-200 bg-primary-50">
                  <CardBody className="p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      {editingSlot ? 'Edit Availability Slot' : 'Add Availability Slot'}
                    </h4>
                    
                    <div className="space-y-3">
                      <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        fullWidth
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Start Time"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                          fullWidth
                        />
                        
                        <Input
                          label="End Time"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                          fullWidth
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={handleAddSlot}
                          className="flex-1"
                        >
                          {editingSlot ? 'Update' : 'Add'} Slot
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

