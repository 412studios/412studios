"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { H4 } from "@/components/ui/copy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  stripeCustomerId: string | null;
  verifyFormSubmitted: boolean;
  isUserVerified: boolean;
  userBio: string | null;
  acceptedTerms: boolean;
  phone: string | null;
  socialLinks: string | null;
  categories: string | null;
}

export default function Users(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>("");

  // Edited user fields
  const [editedName, setEditedName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedRole, setEditedRole] = useState<string>("");
  const [editedPhone, setEditedPhone] = useState<string>("");
  const [editedUserBio, setEditedUserBio] = useState<string>("");
  const [editedSocialLinks, setEditedSocialLinks] = useState<string>("");
  const [editedCategories, setEditedCategories] = useState<string>("");
  const [editedVerifyFormSubmitted, setEditedVerifyFormSubmitted] =
    useState<boolean>(false);
  const [editedIsUserVerified, setEditedIsUserVerified] =
    useState<boolean>(false);
  const [editedAcceptedTerms, setEditedAcceptedTerms] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/users/detailed");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (searchTerm.trim() === "") return true;
    const searchLower = searchTerm.toLowerCase();
    const userName = user.name?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  const handleViewDetails = (user: User): void => {
    setSelectedUser(user);
    setEditedName(user.name || "");
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setEditedPhone(user.phone || "");
    setEditedUserBio(user.userBio || "");
    setEditedSocialLinks(user.socialLinks || "");
    setEditedCategories(user.categories || "");
    setEditedVerifyFormSubmitted(user.verifyFormSubmitted);
    setEditedIsUserVerified(user.isUserVerified);
    setEditedAcceptedTerms(user.acceptedTerms);
    setSaveError("");
  };

  const handleBackToList = (): void => {
    setSelectedUser(null);
  };

  const handleResetChanges = () => {
    if (selectedUser) {
      setEditedName(selectedUser.name || "");
      setEditedEmail(selectedUser.email);
      setEditedRole(selectedUser.role);
      setEditedPhone(selectedUser.phone || "");
      setEditedUserBio(selectedUser.userBio || "");
      setEditedSocialLinks(selectedUser.socialLinks || "");
      setEditedCategories(selectedUser.categories || "");
      setEditedVerifyFormSubmitted(selectedUser.verifyFormSubmitted);
      setEditedIsUserVerified(selectedUser.isUserVerified);
      setEditedAcceptedTerms(selectedUser.acceptedTerms);
      setSaveError("");
    }
  };

  const hasChanges = () => {
    if (!selectedUser) return false;
    return (
      editedName !== (selectedUser.name || "") ||
      editedEmail !== selectedUser.email ||
      editedRole !== selectedUser.role ||
      editedPhone !== (selectedUser.phone || "") ||
      editedUserBio !== (selectedUser.userBio || "") ||
      editedSocialLinks !== (selectedUser.socialLinks || "") ||
      editedCategories !== (selectedUser.categories || "") ||
      editedVerifyFormSubmitted !== selectedUser.verifyFormSubmitted ||
      editedIsUserVerified !== selectedUser.isUserVerified ||
      editedAcceptedTerms !== selectedUser.acceptedTerms
    );
  };

  const handleSaveChanges = async () => {
    if (!selectedUser || !hasChanges()) return;

    setSaving(true);
    setSaveError("");

    try {
      const response = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          name: editedName || null,
          email: editedEmail,
          role: editedRole,
          phone: editedPhone || null,
          userBio: editedUserBio || null,
          socialLinks: editedSocialLinks || null,
          categories: editedCategories || null,
          verifyFormSubmitted: editedVerifyFormSubmitted,
          isUserVerified: editedIsUserVerified,
          acceptedTerms: editedAcceptedTerms,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update local state
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? updatedUser.user : user
        );
        setUsers(updatedUsers);
        setSelectedUser(updatedUser.user);
      } else {
        setSaveError("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setSaveError("Failed to update user. Please try again.");
    }

    setSaving(false);
  };

  const UserDetailView = ({ user }: { user: User }) => (
    <div className="flex flex-col h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={2}>
              <H4>User Details - {user.name || user.email}</H4>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={2}>User ID: {user.id}</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter name"
                disabled
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>
              <Input
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                type="email"
                disabled
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Phone</TableCell>
            <TableCell>
              <Input
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bio</TableCell>
            <TableCell>
              <Input
                value={editedUserBio}
                onChange={(e) => setEditedUserBio(e.target.value)}
                placeholder="Enter user bio"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Social Links</TableCell>
            <TableCell>
              <Input
                value={editedSocialLinks}
                onChange={(e) => setEditedSocialLinks(e.target.value)}
                placeholder="Enter social media links"
              />
            </TableCell>
          </TableRow>
          {saveError && (
            <TableRow>
              <TableCell colSpan={2}>
                <div className="text-red-500 text-sm">{saveError}</div>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={2}>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToList}
                  className="flex items-center gap-2 pl-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  variant="default"
                  size="default"
                  onClick={handleSaveChanges}
                  disabled={saving || !hasChanges()}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleResetChanges}
                  disabled={saving}
                >
                  Reset
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  if (selectedUser) {
    return <UserDetailView user={selectedUser} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col">
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="h-full flex-1 overflow-auto">
        {filteredUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || "No name"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(user)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
            No users available
          </div>
        )}
      </div>
    </div>
  );
}
