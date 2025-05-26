import Image from "next/image";
import { VerifyOtpUpdatePasswordForm } from "../_components/verify-otp-update-password-form";
export default function verifyotpUpdateConfirmPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={100}
                        height={100}
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-lg">
                        <VerifyOtpUpdatePasswordForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:flex justify-start items-center ml-20">
                <Image
                    src="/verify otp.png"
                    alt="Verify-Image"
                    className="rounded-2xl"
                    width={600}
                    height={600}
                />
            </div>
        </div>
    );
}
