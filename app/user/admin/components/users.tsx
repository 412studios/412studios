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

interface Membership {
  membershipId: string;
  status: string;
  roomId: number;
  availableHours: number;
  planId: string;
}

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
  memberships: Membership[];
}

export default function Users(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>("");
  const [membershipFilter, setMembershipFilter] = useState<string>("all");

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

  // Membership management state
  const [editedMemberships, setEditedMemberships] = useState<Membership[]>([]);
  const [membershipChanges, setMembershipChanges] = useState<{
    [key: string]: number;
  }>({});

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

  const getActiveMemberships = (user: User): Membership[] => {
    return (
      user.memberships?.filter(
        (membership) => membership.status === "active"
      ) || []
    );
  };

  const filteredUsers = users.filter((user) => {
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      const userName = user.name?.toLowerCase() || "";
      const userEmail = user.email?.toLowerCase() || "";
      if (!userName.includes(searchLower) && !userEmail.includes(searchLower)) {
        return false;
      }
    }

    // Apply membership filter
    if (membershipFilter !== "all") {
      const activeMemberships = getActiveMemberships(user);
      if (membershipFilter === "members" && activeMemberships.length === 0) {
        return false;
      }
      if (membershipFilter === "non-members" && activeMemberships.length > 0) {
        return false;
      }
    }

    return true;
  });

  const getMembershipStatus = (user: User): string => {
    const activeMemberships = getActiveMemberships(user);
    if (activeMemberships.length === 0) return "No Membership";
    if (activeMemberships.length === 1) return "Member";
    return `Member (${activeMemberships.length} studios)`;
  };

  const getMembershipDetails = (user: User): string => {
    const activeMemberships = getActiveMemberships(user);
    if (activeMemberships.length === 0) return "No active memberships";

    const studios = ["A", "B", "C"];
    const details = activeMemberships
      .map(
        (membership) =>
          `Studio ${studios[membership.roomId]}: ${membership.availableHours} hours`
      )
      .join(", ");

    return details;
  };

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
    setEditedMemberships(user.memberships || []);
    setMembershipChanges({});
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
      setEditedMemberships(selectedUser.memberships || []);
      setMembershipChanges({});
      setSaveError("");
    }
  };

  const addMembership = (roomId: number) => {
    const membershipId = `temp_${Date.now()}_${roomId}`;
    const newMembership: Membership = {
      membershipId,
      status: "active",
      roomId,
      availableHours: 16, // Default hours
      planId: "admin_created",
    };
    setEditedMemberships([...editedMemberships, newMembership]);
  };

  const removeMembership = (membershipId: string) => {
    setEditedMemberships(
      editedMemberships.filter((m) => m.membershipId !== membershipId)
    );
    const newChanges = { ...membershipChanges };
    delete newChanges[membershipId];
    setMembershipChanges(newChanges);
  };

  const updateMembershipHours = (membershipId: string, hours: number) => {
    setEditedMemberships(
      editedMemberships.map((m) =>
        m.membershipId === membershipId ? { ...m, availableHours: hours } : m
      )
    );
    setMembershipChanges({ ...membershipChanges, [membershipId]: hours });
  };

  const getAvailableStudios = (): number[] => {
    const existingRooms = editedMemberships
      .filter((m) => m.status === "active")
      .map((m) => m.roomId);
    return [0, 1, 2].filter((roomId) => !existingRooms.includes(roomId));
  };

  const hasChanges = () => {
    if (!selectedUser) return false;

    // Check basic user field changes
    const userFieldsChanged =
      editedName !== (selectedUser.name || "") ||
      editedEmail !== selectedUser.email ||
      editedRole !== selectedUser.role ||
      editedPhone !== (selectedUser.phone || "") ||
      editedUserBio !== (selectedUser.userBio || "") ||
      editedSocialLinks !== (selectedUser.socialLinks || "") ||
      editedCategories !== (selectedUser.categories || "") ||
      editedVerifyFormSubmitted !== selectedUser.verifyFormSubmitted ||
      editedIsUserVerified !== selectedUser.isUserVerified ||
      editedAcceptedTerms !== selectedUser.acceptedTerms;

    // Check membership changes
    const originalMemberships = selectedUser.memberships || [];
    const membershipStructureChanged =
      editedMemberships.length !== originalMemberships.length ||
      editedMemberships.some(
        (em) =>
          !originalMemberships.find((om) => om.membershipId === em.membershipId)
      );

    const membershipHoursChanged = Object.keys(membershipChanges).length > 0;

    return (
      userFieldsChanged || membershipStructureChanged || membershipHoursChanged
    );
  };

  const handleSaveChanges = async () => {
    if (!selectedUser || !hasChanges()) return;

    setSaving(true);
    setSaveError("");

    try {
      // Update basic user information
      const userResponse = await fetch("/api/admin/users/update", {
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

      if (!userResponse.ok) {
        setSaveError("Failed to update user. Please try again.");
        setSaving(false);
        return;
      }

      let updatedUserData = await userResponse.json();

      // Handle membership changes
      const originalMemberships = selectedUser.memberships || [];

      // Find new memberships to create
      const newMemberships = editedMemberships.filter(
        (em) =>
          em.membershipId.startsWith("temp_") &&
          !originalMemberships.find((om) => om.membershipId === em.membershipId)
      );

      // Find memberships to remove
      const removedMemberships = originalMemberships.filter(
        (om) =>
          !editedMemberships.find((em) => em.membershipId === om.membershipId)
      );

      // Find memberships with hour changes
      const modifiedMemberships = editedMemberships.filter((em) => {
        const original = originalMemberships.find(
          (om) => om.membershipId === em.membershipId
        );
        return original && original.availableHours !== em.availableHours;
      });

      // Process membership changes
      for (const membership of newMemberships) {
        const createResponse = await fetch(
          "/api/admin/users/membership/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: selectedUser.id,
              roomId: membership.roomId,
              availableHours: membership.availableHours,
            }),
          }
        );

        if (!createResponse.ok) {
          setSaveError("Failed to create membership. Please try again.");
          setSaving(false);
          return;
        }
      }

      for (const membership of removedMemberships) {
        const deleteResponse = await fetch(
          "/api/admin/users/membership/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              membershipId: membership.membershipId,
            }),
          }
        );

        if (!deleteResponse.ok) {
          setSaveError("Failed to remove membership. Please try again.");
          setSaving(false);
          return;
        }
      }

      for (const membership of modifiedMemberships) {
        const updateResponse = await fetch(
          "/api/admin/users/membership/update",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              membershipId: membership.membershipId,
              availableHours: membership.availableHours,
            }),
          }
        );

        if (!updateResponse.ok) {
          setSaveError("Failed to update membership hours. Please try again.");
          setSaving(false);
          return;
        }
      }

      // Fetch updated user data with memberships
      const refreshResponse = await fetch(`/api/admin/users/detailed`);
      if (refreshResponse.ok) {
        const allUsers = await refreshResponse.json();
        const refreshedUser = allUsers.find(
          (u: User) => u.id === selectedUser.id
        );

        if (refreshedUser) {
          setUsers(allUsers);
          setSelectedUser(refreshedUser);
          setEditedMemberships(refreshedUser.memberships || []);
          setMembershipChanges({});
        }
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
          <TableRow>
            <TableCell>Membership Status</TableCell>
            <TableCell>
              <Input value={getMembershipStatus(user)} disabled />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Membership Management</TableCell>
            <TableCell>
              <div className="space-y-2">
                {editedMemberships
                  .filter((m) => m.status === "active")
                  .map((membership) => {
                    const studios = ["A", "B", "C"];
                    return (
                      <div
                        key={membership.membershipId}
                        className="flex items-center gap-2 p-2 border rounded"
                      >
                        <span className="min-w-16">
                          Studio {studios[membership.roomId]}:
                        </span>
                        <Input
                          type="number"
                          value={membership.availableHours}
                          onChange={(e) =>
                            updateMembershipHours(
                              membership.membershipId,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">hours</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeMembership(membership.membershipId)
                          }
                          className="ml-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}

                {getAvailableStudios().length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">
                      Add membership:
                    </span>
                    {getAvailableStudios().map((roomId) => {
                      const studios = ["A", "B", "C"];
                      return (
                        <Button
                          key={roomId}
                          variant="outline"
                          size="sm"
                          onClick={() => addMembership(roomId)}
                        >
                          Studio {studios[roomId]}
                        </Button>
                      );
                    })}
                  </div>
                )}

                {editedMemberships.filter((m) => m.status === "active")
                  .length === 0 && (
                  <div className="text-gray-500 text-sm">
                    No active memberships
                  </div>
                )}
              </div>
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
          <Select value={membershipFilter} onValueChange={setMembershipFilter}>
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Filter by membership" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="non-members">Non-Members</SelectItem>
              <SelectItem value="members">Members</SelectItem>
            </SelectContent>
          </Select>
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
                <TableHead>Membership</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || "No name"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getMembershipStatus(user)}</TableCell>
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
