export interface CachedBooking {
  id: string;
  serviceDetails: any;
  personalInfo: any;
  payment: any;
  salon: any;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  syncStatus: "synced" | "pending" | "failed";
}

export interface CachedData {
  bookings: CachedBooking[];
  services: any[];
  salons: any[];
  lastSync: string;
}

const CACHE_KEY = "beautybook_offline_cache";
const CACHE_VERSION = "v1";

class OfflineService {
  private cache: CachedData;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.cache = this.loadCache();
    this.setupNetworkListeners();
    this.registerServiceWorker();
  }

  private loadCache(): CachedData {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Error loading cache:", error);
    }

    return {
      bookings: [],
      services: [],
      salons: [],
      lastSync: new Date().toISOString(),
    };
  }

  private saveCache(): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error("Error saving cache:", error);
    }
  }

  private setupNetworkListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.syncPendingData();
      this.notifyNetworkChange(true);
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.notifyNetworkChange(false);
    });
  }

  private async registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered: ", registration);
      } catch (registrationError) {
        console.log("SW registration failed: ", registrationError);
      }
    }
  }

  private notifyNetworkChange(isOnline: boolean): void {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent("networkChange", {
        detail: { isOnline },
      }),
    );
  }

  // Booking methods
  cacheBooking(
    booking: Omit<CachedBooking, "id" | "createdAt" | "syncStatus">,
  ): string {
    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cachedBooking: CachedBooking = {
      ...booking,
      id,
      createdAt: new Date().toISOString(),
      syncStatus: this.isOnline ? "synced" : "pending",
    };

    this.cache.bookings.unshift(cachedBooking);
    this.saveCache();

    // If online, attempt to sync immediately
    if (this.isOnline) {
      this.syncBooking(id);
    }

    return id;
  }

  getBookings(): CachedBooking[] {
    return this.cache.bookings;
  }

  getBooking(id: string): CachedBooking | null {
    return this.cache.bookings.find((b) => b.id === id) || null;
  }

  updateBookingStatus(id: string, status: CachedBooking["status"]): void {
    const booking = this.cache.bookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      booking.syncStatus = "pending";
      this.saveCache();

      if (this.isOnline) {
        this.syncBooking(id);
      }
    }
  }

  deleteBooking(id: string): void {
    this.cache.bookings = this.cache.bookings.filter((b) => b.id !== id);
    this.saveCache();
  }

  // Data caching methods
  cacheServices(services: any[]): void {
    this.cache.services = services;
    this.cache.lastSync = new Date().toISOString();
    this.saveCache();
  }

  cacheSalons(salons: any[]): void {
    this.cache.salons = salons;
    this.cache.lastSync = new Date().toISOString();
    this.saveCache();
  }

  getServices(): any[] {
    return this.cache.services;
  }

  getSalons(): any[] {
    return this.cache.salons;
  }

  // Sync methods
  async syncBooking(bookingId: string): Promise<void> {
    if (!this.isOnline) return;

    const booking = this.getBooking(bookingId);
    if (!booking) return;

    try {
      // Simulate API call
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (response.ok) {
        booking.syncStatus = "synced";
        this.saveCache();
      } else {
        booking.syncStatus = "failed";
        this.saveCache();
      }
    } catch (error) {
      console.error("Sync failed:", error);
      booking.syncStatus = "failed";
      this.saveCache();
    }
  }

  async syncPendingData(): Promise<void> {
    if (!this.isOnline) return;

    const pendingBookings = this.cache.bookings.filter(
      (b) => b.syncStatus === "pending" || b.syncStatus === "failed",
    );

    for (const booking of pendingBookings) {
      await this.syncBooking(booking.id);
    }
  }

  // Network status
  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  getPendingSyncCount(): number {
    return this.cache.bookings.filter(
      (b) => b.syncStatus === "pending" || b.syncStatus === "failed",
    ).length;
  }

  // Clear cache
  clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
    this.cache = {
      bookings: [],
      services: [],
      salons: [],
      lastSync: new Date().toISOString(),
    };
  }
}

export const offlineService = new OfflineService();
export default offlineService;
