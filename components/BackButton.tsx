"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";

interface BackButtonProps {
  href: string;
  label: string;
}

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <div className="border-b border-[var(--ijl-border)]">
      <Container>
        <div className="mx-auto max-w-2xl py-3">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-md px-2 py-2 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] hover:bg-[var(--ijl-cta-bg)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {label}
          </Link>
        </div>
      </Container>
    </div>
  );
}
