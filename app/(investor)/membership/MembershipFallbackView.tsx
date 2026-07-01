"use client";

import { useRouter } from "next/navigation";
import MembershipModal from "@/components/investor/MembershipModal";

export default function MembershipFallbackView({
  initialError,
}: {
  initialError?: string;
}) {
  const router = useRouter();

  function handleClose() {
    router.push("/opportunities");
  }

  return (
    <MembershipModal
      isOpen={true}
      transparentBackdrop
      initialError={initialError}
      onClose={handleClose}
      onSuccess={handleClose}
    />
  );
}
