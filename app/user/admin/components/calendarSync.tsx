"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, ExternalLink, RotateCcw } from "lucide-react";

export default function CalendarSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [testResult, setTestResult] = useState<any>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setSyncStatus("idle");

    try {
      const response = await fetch("/api/admin/calendar/sync", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSyncStatus("success");
        setLastSync(new Date().toLocaleString());
      } else {
        setSyncStatus("error");
        console.error("Sync failed:", result);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsTestLoading(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/admin/calendar/test");
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error("Test failed:", error);
      setTestResult({ success: false, error: "Test request failed" });
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "This will reset all calendar sync data and allow all bookings to be synced again. Continue?"
      )
    ) {
      return;
    }

    setIsResetLoading(true);

    try {
      const response = await fetch("/api/admin/calendar/reset", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Reset complete! ${result.count} bookings can now be synced again.`);
        setSyncStatus("idle");
        setLastSync(null);
      } else {
        alert(`Reset failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Reset failed:", error);
      alert("Reset failed - check console for details");
    } finally {
      setIsResetLoading(false);
    }
  };

  const getCalendarUrl = () => {
    // This would need to be configured with your actual calendar ID
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    if (calendarId) {
      return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}`;
    }
    return "https://calendar.google.com";
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleTest}
            disabled={isTestLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isTestLoading ? "animate-spin" : ""}`} />
            {isTestLoading ? "Testing..." : "Test Connection"}
          </Button>

          <Button
            onClick={handleSync}
            disabled={isLoading || !testResult?.success}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Syncing..." : "Sync All Bookings"}
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open(getCalendarUrl(), "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Calendar
          </Button>
        </div>

        {lastSync && <p className="text-sm text-muted-foreground">Last sync: {lastSync}</p>}

        {syncStatus === "success" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ All successful bookings have been synced to Google Calendar
            </p>
          </div>
        )}

        {syncStatus === "error" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              ❌ Sync failed. Please check your Google Calendar configuration.
            </p>
          </div>
        )}

        {testResult && (
          <div
            className={`p-3 border rounded-md ${
              testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                testResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {testResult.success ? "✅ Connection Test Successful" : "❌ Connection Test Failed"}
            </p>
            {testResult.success && testResult.calendar && (
              <p className="text-sm text-green-700 mt-1">
                Connected to: {testResult.calendar.summary}
              </p>
            )}
            {!testResult.success && (
              <div className="mt-2 text-sm text-red-700">
                <p>
                  <strong>Error:</strong> {testResult.error}
                </p>
                {testResult.details && (
                  <p>
                    <strong>Details:</strong> {testResult.details}
                  </p>
                )}
                {testResult.missing && (
                  <p>
                    <strong>Missing:</strong> {testResult.missing.join(", ")}
                  </p>
                )}
                <p className="mt-2">
                  <strong>Setup Guide:</strong> See GOOGLE_CALENDAR_SETUP.md in the project root
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
