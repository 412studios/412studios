"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
interface Price {
  room: string;
  dayRate: number;
  hourlyRate: number;
  membershipPrice: number;
  engineerPrice: number;
  blocked: boolean;
}
interface PageProps {
  prices: Price[];
}

export default function Page(data: any) {
  const [prices, setPrices] = useState<Price[]>(data.prices);

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

  return (
    <>
      {prices.map((val, index) => (
        <TableRow key={index}>
          <TableCell>{val.room}</TableCell>
          <TableCell>
            <Checkbox
              name={index + "blocked"}
              checked={val.blocked}
              value="true"
              onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
            />
          </TableCell>
          <TableCell>
            <Input
              name={index + "day"}
              value={val.dayRate}
              onChange={(e) => handleChange(index, "dayRate", e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Input
              name={index + "hour"}
              value={val.hourlyRate}
              onChange={(e) => handleChange(index, "hourlyRate", e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Input
              name={index + "membership"}
              value={val.membershipPrice}
              onChange={(e) => handleChange(index, "membershipPrice", e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Input
              name={index + "eng"}
              value={val.engineerPrice}
              onChange={(e) => handleChange(index, "engineerPrice", e.target.value)}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
