import { Button } from "@/components/ui/button"; import { markAllNotificationsReadAction, markNotificationReadAction } from "@/features/tracking/actions";
export function MarkNotificationRead({ id, label }: { id: string; label: string }) { return <form action={markNotificationReadAction}><input type="hidden" name="id" value={id} /><Button type="submit" variant="quiet">{label}</Button></form>; }
export function MarkAllNotificationsRead({ label }: { label: string }) { return <form action={markAllNotificationsReadAction}><Button type="submit" variant="secondary">{label}</Button></form>; }
