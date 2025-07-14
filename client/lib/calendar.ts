export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  reminders?: {
    method: "email" | "popup";
    minutes: number;
  }[];
  url?: string;
}

export interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  accountEmail?: string;
}

export interface CalendarSyncSettings {
  autoSync: boolean;
  defaultReminders: boolean;
  reminderMinutes: number[];
  syncPastEvents: boolean;
  calendarId?: string;
}

class CalendarService {
  private providers: CalendarProvider[] = [
    {
      id: "google",
      name: "Google Calendar",
      icon: "🟩",
      isConnected: false,
    },
    {
      id: "apple",
      name: "Apple Calendar",
      icon: "🍎",
      isConnected: false,
    },
    {
      id: "outlook",
      name: "Outlook Calendar",
      icon: "🟦",
      isConnected: false,
    },
  ];

  private settings: CalendarSyncSettings = {
    autoSync: true,
    defaultReminders: true,
    reminderMinutes: [30, 60],
    syncPastEvents: false,
  };

  // Provider Management
  getProviders(): CalendarProvider[] {
    return this.providers;
  }

  getConnectedProviders(): CalendarProvider[] {
    return this.providers.filter((p) => p.isConnected);
  }

  async connectProvider(providerId: string): Promise<boolean> {
    const provider = this.providers.find((p) => p.id === providerId);
    if (!provider) return false;

    try {
      switch (providerId) {
        case "google":
          return await this.connectGoogleCalendar();
        case "apple":
          return await this.connectAppleCalendar();
        case "outlook":
          return await this.connectOutlookCalendar();
        default:
          return false;
      }
    } catch (error) {
      console.error(`Failed to connect ${providerId}:`, error);
      return false;
    }
  }

  async disconnectProvider(providerId: string): Promise<boolean> {
    const provider = this.providers.find((p) => p.id === providerId);
    if (!provider) return false;

    try {
      provider.isConnected = false;
      provider.accountEmail = undefined;

      // Clear stored tokens/credentials
      localStorage.removeItem(`calendar_${providerId}_token`);

      return true;
    } catch (error) {
      console.error(`Failed to disconnect ${providerId}:`, error);
      return false;
    }
  }

  // Google Calendar Integration
  private async connectGoogleCalendar(): Promise<boolean> {
    try {
      // Initialize Google Calendar API
      if (typeof window.gapi === "undefined") {
        await this.loadGoogleAPI();
      }

      return new Promise((resolve, reject) => {
        window.gapi.load("auth2", () => {
          window.gapi.auth2
            .init({
              client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
              scope: "https://www.googleapis.com/auth/calendar",
            })
            .then(() => {
              const authInstance = window.gapi.auth2.getAuthInstance();
              return authInstance.signIn();
            })
            .then((user: any) => {
              const profile = user.getBasicProfile();
              const provider = this.providers.find((p) => p.id === "google");
              if (provider) {
                provider.isConnected = true;
                provider.accountEmail = profile.getEmail();
              }

              // Store access token
              const token = user.getAuthResponse().access_token;
              localStorage.setItem("calendar_google_token", token);

              resolve(true);
            })
            .catch((error: any) => {
              console.error("Google Calendar connection failed:", error);
              reject(false);
            });
        });
      });
    } catch (error) {
      console.error("Google Calendar initialization failed:", error);
      return false;
    }
  }

  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google API"));
      document.head.appendChild(script);
    });
  }

  // Apple Calendar Integration (EventKit/CalDAV)
  private async connectAppleCalendar(): Promise<boolean> {
    try {
      // For web apps, Apple Calendar integration is limited
      // This would typically use CalDAV or prompt to download .ics files

      const provider = this.providers.find((p) => p.id === "apple");
      if (provider) {
        provider.isConnected = true;
        provider.accountEmail = "icloud@example.com"; // Mock
      }

      return true;
    } catch (error) {
      console.error("Apple Calendar connection failed:", error);
      return false;
    }
  }

  // Outlook Calendar Integration
  private async connectOutlookCalendar(): Promise<boolean> {
    try {
      // Microsoft Graph API integration
      const provider = this.providers.find((p) => p.id === "outlook");
      if (provider) {
        provider.isConnected = true;
        provider.accountEmail = "outlook@example.com"; // Mock
      }

      return true;
    } catch (error) {
      console.error("Outlook Calendar connection failed:", error);
      return false;
    }
  }

  // Event Management
  async createEvent(
    event: Omit<CalendarEvent, "id">,
    providerId?: string,
  ): Promise<string | null> {
    const providers = providerId
      ? [this.providers.find((p) => p.id === providerId)].filter(Boolean)
      : this.getConnectedProviders();

    if (providers.length === 0) {
      throw new Error("No calendar providers connected");
    }

    try {
      const eventId = `event_${Date.now()}`;

      for (const provider of providers) {
        await this.createEventInProvider(
          {
            ...event,
            id: eventId,
          },
          provider.id,
        );
      }

      return eventId;
    } catch (error) {
      console.error("Failed to create calendar event:", error);
      return null;
    }
  }

  private async createEventInProvider(
    event: CalendarEvent,
    providerId: string,
  ): Promise<void> {
    switch (providerId) {
      case "google":
        await this.createGoogleEvent(event);
        break;
      case "apple":
        await this.createAppleEvent(event);
        break;
      case "outlook":
        await this.createOutlookEvent(event);
        break;
    }
  }

  private async createGoogleEvent(event: CalendarEvent): Promise<void> {
    const token = localStorage.getItem("calendar_google_token");
    if (!token) throw new Error("Google Calendar not connected");

    const calendarEvent = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: event.location,
      attendees: event.attendees?.map((email) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: event.reminders?.map((reminder) => ({
          method: reminder.method,
          minutes: reminder.minutes,
        })),
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calendarEvent),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create Google Calendar event");
    }
  }

  private async createAppleEvent(event: CalendarEvent): Promise<void> {
    // For Apple Calendar, we can generate an .ics file for download
    const icsContent = this.generateICSFile(event);
    this.downloadICSFile(icsContent, `${event.title}.ics`);
  }

  private async createOutlookEvent(event: CalendarEvent): Promise<void> {
    // Mock Outlook event creation
    console.log("Creating Outlook event:", event);
  }

  // Event Updates
  async updateEvent(
    eventId: string,
    updates: Partial<CalendarEvent>,
    providerId?: string,
  ): Promise<boolean> {
    try {
      const providers = providerId
        ? [this.providers.find((p) => p.id === providerId)].filter(Boolean)
        : this.getConnectedProviders();

      for (const provider of providers) {
        await this.updateEventInProvider(eventId, updates, provider.id);
      }

      return true;
    } catch (error) {
      console.error("Failed to update calendar event:", error);
      return false;
    }
  }

  private async updateEventInProvider(
    eventId: string,
    updates: Partial<CalendarEvent>,
    providerId: string,
  ): Promise<void> {
    // Implementation for each provider
    console.log(`Updating event ${eventId} in ${providerId}:`, updates);
  }

  // Event Deletion
  async deleteEvent(eventId: string, providerId?: string): Promise<boolean> {
    try {
      const providers = providerId
        ? [this.providers.find((p) => p.id === providerId)].filter(Boolean)
        : this.getConnectedProviders();

      for (const provider of providers) {
        await this.deleteEventInProvider(eventId, provider.id);
      }

      return true;
    } catch (error) {
      console.error("Failed to delete calendar event:", error);
      return false;
    }
  }

  private async deleteEventInProvider(
    eventId: string,
    providerId: string,
  ): Promise<void> {
    // Implementation for each provider
    console.log(`Deleting event ${eventId} from ${providerId}`);
  }

  // Utility Methods
  private generateICSFile(event: CalendarEvent): string {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BeautyBook//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@beautybook.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(event.startTime)}`,
      `DTEND:${formatDate(event.endTime)}`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description}` : "",
      event.location ? `LOCATION:${event.location}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    return icsContent;
  }

  private downloadICSFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // Settings Management
  getSettings(): CalendarSyncSettings {
    const saved = localStorage.getItem("calendar_settings");
    if (saved) {
      return { ...this.settings, ...JSON.parse(saved) };
    }
    return this.settings;
  }

  updateSettings(newSettings: Partial<CalendarSyncSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem("calendar_settings", JSON.stringify(this.settings));
  }

  // Booking Integration
  async createBookingEvent(
    bookingId: string,
    serviceName: string,
    salonName: string,
    startTime: Date,
    duration: number,
    salonAddress?: string,
  ): Promise<string | null> {
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const event: Omit<CalendarEvent, "id"> = {
      title: `${serviceName} at ${salonName}`,
      description: `Beauty appointment at ${salonName}\n\nBooking ID: ${bookingId}\n\nService: ${serviceName}\nDuration: ${duration} minutes`,
      startTime,
      endTime,
      location: salonAddress,
      reminders: this.settings.defaultReminders
        ? this.settings.reminderMinutes.map((minutes) => ({
            method: "popup" as const,
            minutes,
          }))
        : [],
      url: `${window.location.origin}/bookings/${bookingId}`,
    };

    return await this.createEvent(event);
  }

  async updateBookingEvent(
    eventId: string,
    updates: {
      startTime?: Date;
      duration?: number;
      serviceName?: string;
      salonName?: string;
      salonAddress?: string;
    },
  ): Promise<boolean> {
    const eventUpdates: Partial<CalendarEvent> = {};

    if (updates.startTime) {
      eventUpdates.startTime = updates.startTime;
      if (updates.duration) {
        eventUpdates.endTime = new Date(
          updates.startTime.getTime() + updates.duration * 60000,
        );
      }
    }

    if (updates.serviceName && updates.salonName) {
      eventUpdates.title = `${updates.serviceName} at ${updates.salonName}`;
    }

    if (updates.salonAddress) {
      eventUpdates.location = updates.salonAddress;
    }

    return await this.updateEvent(eventId, eventUpdates);
  }

  // Free/Busy Time Checking
  async getFreeBusyTimes(
    startDate: Date,
    endDate: Date,
    providerId?: string,
  ): Promise<{ start: Date; end: Date }[]> {
    // Mock implementation - in real app, this would query calendar APIs
    const busyTimes = [
      {
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 30),
      },
      {
        start: new Date(2024, 0, 15, 14, 0),
        end: new Date(2024, 0, 15, 15, 0),
      },
    ];

    return busyTimes;
  }

  async suggestAvailableSlots(
    preferredDate: Date,
    duration: number,
    providerId?: string,
  ): Promise<Date[]> {
    const busyTimes = await this.getFreeBusyTimes(
      preferredDate,
      new Date(preferredDate.getTime() + 24 * 60 * 60 * 1000),
      providerId,
    );

    // Simple algorithm to find available slots
    const availableSlots: Date[] = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(preferredDate);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);

        const isAvailable = !busyTimes.some(
          (busy) => slotStart < busy.end && slotEnd > busy.start,
        );

        if (isAvailable) {
          availableSlots.push(slotStart);
        }
      }
    }

    return availableSlots;
  }
}

// Global type declarations for Google API
declare global {
  interface Window {
    gapi: any;
  }
}

export const calendarService = new CalendarService();
export default calendarService;
