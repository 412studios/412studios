"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function NumberInput({ initialNum }: { initialNum: number }) {
  const [num, setNum] = useState(initialNum);

  useEffect(() => {
    setNum(initialNum);
  }, [initialNum]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 100) {
      // Regular expression to allow only digits and value less than or equal to 100
      setNum(Number(value));
    }
  };

  return <Input name="num" type="text" value={num} onChange={handleChange} />;
}
