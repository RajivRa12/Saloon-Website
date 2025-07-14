import { useState, useEffect } from "react";
import { offlineService, CachedBooking } from "@/lib/offline";

export interface OfflineStatus {
  isOnline: boolean;
  isLoading: boolean;
  pendingSyncCount: number;
  lastSync: string | null;
}

export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: navigator.onLine,
    isLoading: false,
    pendingSyncCount: 0,
    lastSync: null,
  });

  const [bookings, setBookings] = useState<CachedBooking[]>([]);

  useEffect(() => {
    // Initial load
    loadBookings();
    updateStatus();

    // Listen for network changes
    const handleNetworkChange = (event: CustomEvent) => {
      setStatus((prev) => ({
        ...prev,
        isOnline: event.detail.isOnline,
      }));
    };

    window.addEventListener(
      "networkChange",
      handleNetworkChange as EventListener,
    );

    // Listen for service worker messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SYNC_BOOKINGS") {
        syncBookings();
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener(
        "networkChange",
        handleNetworkChange as EventListener,
      );
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, []);

  const loadBookings = () => {
    const cachedBookings = offlineService.getBookings();
    setBookings(cachedBookings);
  };

  const updateStatus = () => {
    setStatus((prev) => ({
      ...prev,
      isOnline: offlineService.getNetworkStatus(),
      pendingSyncCount: offlineService.getPendingSyncCount(),
    }));
  };

  const createBooking = async (
    bookingData: Omit<CachedBooking, "id" | "createdAt" | "syncStatus">,
  ) => {
    setStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      const bookingId = offlineService.cacheBooking(bookingData);
      loadBookings();
      updateStatus();
      return bookingId;
    } finally {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateBooking = (id: string, status: CachedBooking["status"]) => {
    offlineService.updateBookingStatus(id, status);
    loadBookings();
    updateStatus();
  };

  const deleteBooking = (id: string) => {
    offlineService.deleteBooking(id);
    loadBookings();
    updateStatus();
  };

  const syncBookings = async () => {
    if (!status.isOnline) return;

    setStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      await offlineService.syncPendingData();
      loadBookings();
      updateStatus();
    } finally {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const forceSyncBooking = async (bookingId: string) => {
    if (!status.isOnline) return;

    setStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      await offlineService.syncBooking(bookingId);
      loadBookings();
      updateStatus();
    } finally {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    status,
    bookings,
    createBooking,
    updateBooking,
    deleteBooking,
    syncBookings,
    forceSyncBooking,
    refreshBookings: loadBookings,
  };
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
