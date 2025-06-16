import VerifyForm from "@/components/ui/verify-form";
import {Suspense} from "react";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
export default async function Page() {

    const session = await auth()

    if (!session) {
        redirect("/login");
    }
    return <Suspense fallback={<div>Loading...</div>}>
            <VerifyForm/>
    </Suspense>
}
