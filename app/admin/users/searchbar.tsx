"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface SearchProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <div>
      <Input value={value} onChange={onChange} placeholder="Search" />
    </div>
  );
};

export default Search;
