"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
interface Price {
  room: string;
  dayRate: number;
  hourlyRate: number;
  subscriptionPrice: number;
  engineerPrice: number;
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

  return (
    <>
      {prices.map((val, index) => (
        <TableRow key={index}>
          <TableCell>{val.room}</TableCell>
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
              onChange={(e) =>
                handleChange(index, "hourlyRate", e.target.value)
              }
            />
          </TableCell>
          <TableCell>
            <Input
              name={index + "sub"}
              value={val.subscriptionPrice}
              onChange={(e) =>
                handleChange(index, "subscriptionPrice", e.target.value)
              }
            />
          </TableCell>
          <TableCell>
            <Input
              name={index + "eng"}
              value={val.engineerPrice}
              onChange={(e) =>
                handleChange(index, "engineerPrice", e.target.value)
              }
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
