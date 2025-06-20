import VerifyForm from "@/components/verify-collection";
import React, { Suspense } from "react";
export default function VerifyPage() {
  return (
    <div>
      <Suspense>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
