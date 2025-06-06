"use client";

import { useState, useTransition } from "react";
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
import {inviteCollaboratorAction} from "@/actions/ inviteCollaboratorAction";


interface Member {
  id: number;
  name: string;
  role: string;
  image: StaticImageData;
}

interface InviteToProjectProps {
  urlProject: string;
}

export function InviteToProject({ urlProject }: InviteToProjectProps) {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Teb Yuma (You)", role: "Owner", image: Profile },
    { id: 2, name: "Sovanarith Chun", role: "Collaborator", image: Collaborate },
  ]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const projectId = urlProject;

  const handleInvite = () => {
    if (!email || !projectId) return;

    setError(null);
    startTransition(async () => {
      try {
        await inviteCollaboratorAction(projectId, email);
        setMembers((prev) => [
          ...prev,
          { id: Date.now(), name: email, role: "Collaborator", image: Collaborate },
        ]);
        setEmail("");
      } catch (err) {
        setError("Failed to invite collaborator. Please try again.");
        console.error(err);
      }
    });
  };

  const handleDelete = (id: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
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
                  className="flex-1 mt-1"
              />
              <Button
                  onClick={handleInvite}
                  disabled={isPending}
                  className="mt-1 px-4 py-2 bg-black text-white hover:bg-gray-700"
              >
                {isPending ? "Inviting..." : "Invite"}
              </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">Manage members</h3>
              {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 mt-2">
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
                    {member.role !== "Owner" && (
                        <button
                            type="button"
                            onClick={() => handleDelete(member.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                            aria-label={`Remove ${member.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                  </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}
