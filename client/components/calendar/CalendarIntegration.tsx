import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Settings,
  Plus,
  Check,
  X,
  ExternalLink,
  Bell,
  Download,
  Smartphone,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  calendarService,
  CalendarProvider,
  CalendarSyncSettings,
} from "@/lib/calendar";

interface CalendarIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails?: {
    id: string;
    serviceName: string;
    salonName: string;
    startTime: Date;
    duration: number;
    salonAddress?: string;
  };
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  isOpen,
  onClose,
  bookingDetails,
}) => {
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [settings, setSettings] = useState<CalendarSyncSettings | null>(null);
  const [currentView, setCurrentView] = useState<
    "overview" | "providers" | "settings" | "availability"
  >("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [eventCreated, setEventCreated] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const loadedProviders = calendarService.getProviders();
      const loadedSettings = calendarService.getSettings();

      setProviders(loadedProviders);
      setSettings(loadedSettings);
    } catch (error) {
      console.error("Failed to load calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderConnect = async (providerId: string) => {
    setIsLoading(true);
    try {
      const success = await calendarService.connectProvider(providerId);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to connect provider:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderDisconnect = async (providerId: string) => {
    setIsLoading(true);
    try {
      const success = await calendarService.disconnectProvider(providerId);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to disconnect provider:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBookingEvent = async () => {
    if (!bookingDetails) return;

    setIsLoading(true);
    try {
      const eventId = await calendarService.createBookingEvent(
        bookingDetails.id,
        bookingDetails.serviceName,
        bookingDetails.salonName,
        bookingDetails.startTime,
        bookingDetails.duration,
        bookingDetails.salonAddress,
      );

      if (eventId) {
        setEventCreated(eventId);
      }
    } catch (error) {
      console.error("Failed to create calendar event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async () => {
    setIsLoading(true);
    try {
      const slots = await calendarService.suggestAvailableSlots(
        selectedDate,
        60, // 1 hour duration
      );
      setAvailableSlots(slots);
      setCurrentView("availability");
    } catch (error) {
      console.error("Failed to check availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<CalendarSyncSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    calendarService.updateSettings(newSettings);
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return "🟩";
      case "apple":
        return "🍎";
      case "outlook":
        return "🟦";
      default:
        return "📅";
    }
  };

  const connectedProviders = providers.filter((p) => p.isConnected);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-rose-500" />
              <div>
                <h2 className="text-lg font-semibold">Calendar Integration</h2>
                <p className="text-sm text-gray-600">
                  Sync your bookings with your calendar
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={currentView === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("overview")}
            >
              Overview
            </Button>
            <Button
              variant={currentView === "providers" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("providers")}
            >
              Providers
            </Button>
            <Button
              variant={currentView === "settings" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("settings")}
            >
              Settings
            </Button>
            <Button
              variant={currentView === "availability" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("availability")}
            >
              Availability
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Overview */}
          {currentView === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              {bookingDetails && !eventCreated && (
                <Card className="bg-gradient-to-r from-rose-50 to-purple-50 border-rose-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add to Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium">
                          {bookingDetails.serviceName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          at {bookingDetails.salonName}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {bookingDetails.startTime.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {bookingDetails.startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {connectedProviders.length > 0 ? (
                        <Button
                          onClick={createBookingEvent}
                          disabled={isLoading}
                          className="w-full bg-rose-500 hover:bg-rose-600"
                        >
                          {isLoading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="mr-2 h-4 w-4" />
                          )}
                          Add to Calendar
                        </Button>
                      ) : (
                        <div className="text-center py-4">
                          <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-3">
                            Connect a calendar provider to add events
                          </p>
                          <Button
                            onClick={() => setCurrentView("providers")}
                            variant="outline"
                          >
                            Connect Calendar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success Message */}
              {eventCreated && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-900">
                          Event Added Successfully!
                        </h4>
                        <p className="text-sm text-green-700">
                          Your booking has been added to your calendar
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Connected Providers */}
              <div>
                <h3 className="font-semibold mb-3">Connected Calendars</h3>
                {connectedProviders.length > 0 ? (
                  <div className="space-y-2">
                    {connectedProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {getProviderIcon(provider.id)}
                          </span>
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            {provider.accountEmail && (
                              <div className="text-sm text-gray-600">
                                {provider.accountEmail}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No calendars connected</p>
                    <Button
                      onClick={() => setCurrentView("providers")}
                      className="mt-3"
                      variant="outline"
                    >
                      Connect Calendar
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={checkAvailability}
                  className="h-auto p-4 justify-start"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Check Availability</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Find free slots in your calendar
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentView("settings")}
                  className="h-auto p-4 justify-start"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Sync Settings</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Configure reminders & sync
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Providers */}
          {currentView === "providers" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Calendar Providers</h3>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <Card
                    key={provider.id}
                    className={
                      provider.isConnected ? "border-green-200 bg-green-50" : ""
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getProviderIcon(provider.id)}
                          </span>
                          <div>
                            <h4 className="font-medium">{provider.name}</h4>
                            {provider.accountEmail && (
                              <p className="text-sm text-gray-600">
                                {provider.accountEmail}
                              </p>
                            )}
                            {!provider.isConnected && (
                              <p className="text-sm text-gray-500">
                                Sync your bookings automatically
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {provider.isConnected ? (
                            <>
                              <Badge className="bg-green-100 text-green-700">
                                <Check className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleProviderDisconnect(provider.id)
                                }
                                disabled={isLoading}
                              >
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleProviderConnect(provider.id)}
                              disabled={isLoading}
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-600"
                            >
                              {isLoading ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Connect
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Provider Features */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Auto-sync events
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Reminders
                        </Badge>
                        {provider.id === "google" && (
                          <Badge variant="secondary" className="text-xs">
                            Free/busy check
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alternative Methods */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Manual Download
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Download calendar file (.ics) to import into any calendar
                    app
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download ICS File
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings */}
          {currentView === "settings" && settings && (
            <div className="space-y-6">
              <h3 className="font-semibold">Sync Settings</h3>

              {/* Auto Sync */}
              <div className="space-y-3">
                <h4 className="font-medium">Automatic Sync</h4>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.autoSync}
                    onChange={(e) =>
                      updateSettings({ autoSync: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">
                    Automatically add bookings to calendar
                  </span>
                </label>
              </div>

              {/* Reminders */}
              <div className="space-y-3">
                <h4 className="font-medium">Default Reminders</h4>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.defaultReminders}
                    onChange={(e) =>
                      updateSettings({ defaultReminders: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Add default reminders</span>
                </label>

                {settings.defaultReminders && (
                  <div className="ml-6 space-y-2">
                    <p className="text-sm text-gray-600">Reminder times:</p>
                    <div className="flex flex-wrap gap-2">
                      {[15, 30, 60, 120].map((minutes) => (
                        <label
                          key={minutes}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={settings.reminderMinutes.includes(minutes)}
                            onChange={(e) => {
                              const newReminders = e.target.checked
                                ? [...settings.reminderMinutes, minutes]
                                : settings.reminderMinutes.filter(
                                    (m) => m !== minutes,
                                  );
                              updateSettings({
                                reminderMinutes: newReminders,
                              });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}{" "}
                            before
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Past Events */}
              <div className="space-y-3">
                <h4 className="font-medium">Past Events</h4>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.syncPastEvents}
                    onChange={(e) =>
                      updateSettings({ syncPastEvents: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">
                    Include past bookings when syncing
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Availability */}
          {currentView === "availability" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Check Availability</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkAvailability}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Available Slots */}
              {availableSlots.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Available Times</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {slot.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {connectedProviders.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Connect a calendar to check availability
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;
