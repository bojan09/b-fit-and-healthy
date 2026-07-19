import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
export function SignOutButton({ label }: { label: string }) { return <form action={signOutAction}><Button type="submit" variant="secondary"><LogOut aria-hidden="true" />{label}</Button></form>; }
