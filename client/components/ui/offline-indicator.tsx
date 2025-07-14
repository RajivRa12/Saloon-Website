import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useOffline } from "@/hooks/use-offline";

export function OfflineIndicator() {
  const { status, syncBookings } = useOffline();

  if (status.isOnline && status.pendingSyncCount === 0) {
    return null; // Don't show when online and everything is synced
  }

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 flex items-center gap-3 max-w-sm">
        {/* Network Status Icon */}
        <div className="flex-shrink-0">
          {status.isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
        </div>

        {/* Status Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {status.isOnline ? "Online" : "Offline"}
            </span>
            {status.pendingSyncCount > 0 && (
              <Badge className="bg-orange-100 text-orange-700 text-xs">
                {status.pendingSyncCount} pending
              </Badge>
            )}
          </div>

          {status.pendingSyncCount > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {status.isOnline
                ? "Syncing changes..."
                : "Will sync when back online"}
            </p>
          )}
        </div>

        {/* Action Button */}
        {status.isOnline && status.pendingSyncCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={syncBookings}
            disabled={status.isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${status.isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        )}
      </div>
    </div>
  );
}

export function BookingSyncStatus({ bookingId }: { bookingId: string }) {
  const { bookings, forceSyncBooking } = useOffline();
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) return null;

  const getSyncIcon = () => {
    switch (booking.syncStatus) {
      case "synced":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSyncText = () => {
    switch (booking.syncStatus) {
      case "synced":
        return "Synced";
      case "pending":
        return "Syncing...";
      case "failed":
        return "Sync failed";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {getSyncIcon()}
      <span className="text-gray-600">{getSyncText()}</span>
      {booking.syncStatus === "failed" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => forceSyncBooking(bookingId)}
          className="h-6 px-2 text-xs"
        >
          Retry
        </Button>
      )}
    </div>
  );
}

export default OfflineIndicator;
