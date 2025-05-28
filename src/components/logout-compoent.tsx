import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescriptionV2,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitleV2,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import LogoutImage from "../../public/logout_image.png"

export function LogOutPopup() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Logout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent  className="w-[350px] p-8">
                <AlertDialogHeader>
                    <div className="flex justify-center mb-4">
                        <Image
                            src={LogoutImage}
                            alt="Logout Icon"
                            className="rounded-xl border-4 border-white"
                            width={200}
                            height={200}
                        />
                    </div>
                    <AlertDialogTitleV2></AlertDialogTitleV2>
                    <AlertDialogDescriptionV2>
                        Are you sure you want to
                        logout?
                    </AlertDialogDescriptionV2>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button>Logout</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
