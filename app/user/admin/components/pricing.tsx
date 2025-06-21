"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Price {
  id: string;
  room: string;
  dayRate: number;
  hourlyRate: number;
  membershipPrice: number;
  engineerPrice: number;
  blocked: boolean;
}

interface PricingProps {
  pricing: Price[];
}

export default function Pricing({ pricing }: PricingProps) {
  const [prices, setPrices] = useState<Price[]>(pricing);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (index: number, field: string, value: string) => {
    if (!isNaN(Number(value)) && value !== "") {
      const newPrices = prices.map((price, i) => {
        if (i === index) {
          return { ...price, [field]: Number(value) };
        }
        return price;
      });
      setPrices(newPrices);
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newPrices = prices.map((price, i) => {
      if (i === index) {
        return { ...price, blocked: checked };
      }
      return price;
    });
    setPrices(newPrices);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/pricing/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prices),
      });

      if (response.ok) {
        alert("Pricing updated successfully!");
      } else {
        alert("Failed to update pricing. Please try again.");
      }
    } catch (error) {
      console.error("Error updating pricing:", error);
      alert("Failed to update pricing. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Update Pricing</h3>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Studio</TableHead>
            <TableHead>Blocked</TableHead>
            <TableHead>Day Rate ($)</TableHead>
            <TableHead>Hourly Rate ($)</TableHead>
            <TableHead>Membership ($)</TableHead>
            <TableHead>Engineer ($)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.map((val, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{val.room}</TableCell>
              <TableCell>
                <Checkbox
                  checked={val.blocked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(index, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={val.dayRate}
                  onChange={(e) => handleChange(index, "dayRate", e.target.value)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={val.hourlyRate}
                  onChange={(e) =>
                    handleChange(index, "hourlyRate", e.target.value)
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={val.membershipPrice}
                  onChange={(e) =>
                    handleChange(index, "membershipPrice", e.target.value)
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={val.engineerPrice}
                  onChange={(e) =>
                    handleChange(index, "engineerPrice", e.target.value)
                  }
                  className="w-20"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}