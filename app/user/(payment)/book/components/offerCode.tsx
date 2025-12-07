"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H4 } from "@/components/ui/copy";
import { useDashboard } from "../context";
import { Check, X } from "lucide-react";

export const OfferCodeInput: React.FC = () => {
  const { options, setOptions, isMembership, isAdmin } = useDashboard();
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  // Don't show offer code input for membership bookings or admin bookings
  if (isMembership || isAdmin) {
    return null;
  }

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setError("Please enter an offer code");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const response = await fetch("/api/booking/validate-offer-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setOptions((prevOptions) => ({
          ...prevOptions,
          offerCode: data.offerCode.code,
          offerCodeId: data.offerCode.id,
          discountType: data.offerCode.discountType,
          discountValue: data.offerCode.discountValue,
        }));
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Invalid offer code");
        setOptions((prevOptions) => ({
          ...prevOptions,
          offerCode: undefined,
          offerCodeId: undefined,
          discountType: undefined,
          discountValue: undefined,
          discountAmount: undefined,
        }));
      }
    } catch (err) {
      console.error("Error validating offer code:", err);
      setError("Failed to validate offer code");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCode = () => {
    setCode("");
    setError("");
    setOptions((prevOptions) => ({
      ...prevOptions,
      offerCode: undefined,
      offerCodeId: undefined,
      discountType: undefined,
      discountValue: undefined,
      discountAmount: undefined,
    }));
  };

  return (
    <div className="border rounded-lg mt-4 p-4">
      <H4 className="mb-2">Have an Offer Code?</H4>

      {!options.offerCode ? (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyCode();
              }
            }}
            disabled={isValidating}
            className="flex-1"
          />
          <Button
            onClick={handleApplyCode}
            disabled={isValidating || !code.trim()}
          >
            {isValidating ? "Validating..." : "Apply"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-100">
                {options.offerCode} applied
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {options.discountType === "percentage"
                  ? `${options.discountValue}% off`
                  : `$${options.discountValue?.toFixed(2)} off`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCode}
            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
};
