"use client";

import { useEffect, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Profile from "../../public/profile.png";
import Collaborate from "../../public/collborate-img.png";

import { getInviteCollaboratorService } from "@/service/project-collaborator-service";
import { toast } from "sonner";

import { getUserProfileService } from "@/service/user-service";
import {deleteInviteProjectAction, inviteCollaboratorAction} from "@/actions/ inviteCollaboratorAction";

interface Member {
  id: string;
  name: string;
  role: "Collaborator";
  image: StaticImageData | string;
}

interface Owner {
  id: string;
  name: string;
  role: "Owner";
  image: StaticImageData | string;
}

interface InviteToProjectProps {
  urlProject: string;
}

export function InviteToProject({ urlProject }: InviteToProjectProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const projectId = urlProject.split("/")[2];

  const handleInvite = () => {
    if (!email || !projectId) return;

    setError(null);

    startTransition(async () => {
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Invalid email format.");
          return;
        }

        //Check if email already exists in members list
        const isAlreadyInvited = members.some(
            (member) => member.name.toLowerCase() === email.toLowerCase()
        );

        if (isAlreadyInvited) {
          setError("This email has already been invited.");
          return;
        }

        await inviteCollaboratorAction(projectId, email);

        setMembers((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: email,
            role: "Collaborator",
            image: Collaborate,
          },
        ]);

        setEmail("");
      } catch (err) {
        setError("Failed to invite collaborator. Please try again.");
        console.error(err);
      }
    });
  };


  const handleDelete = async (id: string) => {
    try {
      setMembers((prev) => prev.filter((member) => member.id !== id));
      const message = await deleteInviteProjectAction(id);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete collaborator.");
    }
  };

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const data = await getInviteCollaboratorService(projectId);
        const userData = await getUserProfileService();

        const fetchedMembers: Member[] = Array.isArray(data)
            ? data.map((collab) => ({
              id: collab.projectCollaboratorId,
              name: collab.user?.email ?? "Unknown",
              role: "Collaborator",
              image: collab.user?.profileImage ?? Profile,
            }))
            : [];

        setOwner({
          id: "owner-id",
          name: userData.email,
          role: "Owner",
          image: userData.profileImage ?? Profile,
        });

        setMembers(fetchedMembers);
      } catch (err) {
        console.error("Error fetching collaborators:", err);
      }
    };

    fetchCollaborators();
  }, [projectId]);

  return (
      <>
        {/* Invite Collaborator Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <UserPlus className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Invite to project</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter an email..."
                    className="flex-1"
                />
                <Button
                    onClick={handleInvite}
                    disabled={isPending}
                    className="bg-black text-white"
                >
                  {isPending ? "Inviting..." : "Invite"}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}


              {/*{owner && (*/}
              {/*    <div className="mt-4">*/}
              {/*      <div className="flex items-center space-x-3 mt-2">*/}
              {/*        <Image*/}
              {/*            src={owner.image}*/}
              {/*            alt={owner.name}*/}
              {/*            width={40}*/}
              {/*            height={40}*/}
              {/*            className="rounded-full object-cover"*/}
              {/*        />*/}
              {/*        <div>*/}
              {/*          <p className="text-sm font-medium">{owner.name}</p>*/}
              {/*          <p className="text-xs text-gray-500">{owner.role}</p>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*)}*/}

              {/* Collaborators */}
              <div className="mt-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center space-x-3 mt-2"
                    >
                      <Image
                          src={member.image}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      <button
                          type="button"
                          onClick={() => {
                            setSelectedId(member.id);
                            setConfirmOpen(true);
                          }}
                          className="ml-auto text-red-500 hover:text-red-700"
                          aria-label={`Remove ${member.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                ))}
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirm Delete Dialog */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            </AlertDialogHeader>
            <p className="mb-4">
              Are you sure you want to remove this collaborator?
            </p>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
                No
              </AlertDialogCancel>
              <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!selectedId) return;
                    await handleDelete(selectedId);
                    setConfirmOpen(false);
                    setSelectedId(null);
                  }}
              >
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
