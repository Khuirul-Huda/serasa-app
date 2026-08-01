import { Skeleton } from '@/components/ui/skeleton';

export function ShopCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy-200/60 bg-white shadow-2xs">
            <Skeleton className="h-44 w-full rounded-none bg-navy-100/60" />
            <div className="relative flex flex-1 flex-col justify-between px-5 pt-0 pb-5">
                <div className="relative">
                    <Skeleton className="absolute -top-10 left-0 h-16 w-16 rounded-2xl border-4 border-white bg-navy-100 shadow-md" />
                    <div className="space-y-3 pt-9">
                        <Skeleton className="h-4 w-24 rounded-lg bg-navy-100" />
                        <Skeleton className="h-5 w-3/4 bg-navy-100" />
                        <Skeleton className="h-3 w-1/3 bg-navy-100" />
                        <Skeleton className="h-4 w-full bg-navy-100" />
                    </div>
                </div>
                <div className="mt-4 space-y-3 border-t border-navy-100 pt-3.5">
                    <Skeleton className="h-3 w-1/2 bg-navy-100" />
                    <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-9 rounded-xl bg-navy-100" />
                        <Skeleton className="h-9 rounded-xl bg-navy-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
