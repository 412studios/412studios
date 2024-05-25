"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
}

interface PageProps {
  prices: Price[];
}

export default function Page({ prices: initialPrices }: PageProps) {
  const [prices, setPrices] = useState<Price[]>(initialPrices);

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

  console.log(prices);

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
