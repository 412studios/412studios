"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Plus } from "lucide-react";

interface OfferCode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
}

export default function OfferCodes() {
  const [offerCodes, setOfferCodes] = useState<OfferCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<OfferCode | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchOfferCodes();
  }, []);

  const fetchOfferCodes = async () => {
    try {
      const response = await fetch("/api/admin/offer-codes");
      if (response.ok) {
        const data = await response.json();
        setOfferCodes(data.offerCodes);
      }
    } catch (error) {
      console.error("Error fetching offer codes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (code?: OfferCode) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        code: code.code,
        description: code.description || "",
        discountType: code.discountType,
        discountValue: code.discountValue.toString(),
        isActive: code.isActive,
      });
    } else {
      setEditingCode(null);
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCode(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      isActive: true,
    });
  };

  const handleSave = async () => {
    if (!formData.code || !formData.discountValue) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingCode
        ? `/api/admin/offer-codes/${editingCode.id}`
        : "/api/admin/offer-codes";
      const method = editingCode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          editingCode
            ? "Offer code updated successfully!"
            : "Offer code created successfully!"
        );
        handleCloseDialog();
        fetchOfferCodes();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save offer code");
      }
    } catch (error) {
      console.error("Error saving offer code:", error);
      alert("Failed to save offer code. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer code?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/offer-codes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Offer code deleted successfully!");
        fetchOfferCodes();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete offer code");
      }
    } catch (error) {
      console.error("Error deleting offer code:", error);
      alert("Failed to delete offer code. Please try again.");
    }
  };

  const handleToggleActive = async (code: OfferCode) => {
    try {
      const response = await fetch(`/api/admin/offer-codes/${code.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !code.isActive,
        }),
      });

      if (response.ok) {
        fetchOfferCodes();
      } else {
        alert("Failed to update offer code status");
      }
    } catch (error) {
      console.error("Error toggling offer code:", error);
      alert("Failed to update offer code status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Offer Codes</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Offer Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCode ? "Edit Offer Code" : "Create Offer Code"}
              </DialogTitle>
              <DialogDescription>
                {editingCode
                  ? "Update the offer code details below."
                  : "Create a new offer code for customers to use at checkout."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  placeholder="SAVE20"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="20% off all bookings"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountValue">
                  Discount Value *{" "}
                  {formData.discountType === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  min="0"
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  placeholder={
                    formData.discountType === "percentage" ? "20" : "20.00"
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : editingCode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Times Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offerCodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No offer codes yet. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            offerCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono font-medium">
                  {code.code}
                </TableCell>
                <TableCell>{code.description || "-"}</TableCell>
                <TableCell>
                  {code.discountType === "percentage"
                    ? `${code.discountValue}%`
                    : `$${code.discountValue.toFixed(2)}`}
                </TableCell>
                <TableCell>{code._count?.bookings || 0}</TableCell>
                <TableCell>
                  <Button
                    variant={code.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleActive(code)}
                  >
                    {code.isActive ? "Active" : "Inactive"}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(code)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
