import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-200/60 bg-white p-0 shadow-2xs">
            <Skeleton className="aspect-square w-full rounded-none bg-navy-100/60" />
            <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full bg-navy-100" />
                        <Skeleton className="h-3 w-24 bg-navy-100" />
                    </div>
                    <Skeleton className="h-4 w-4/5 bg-navy-100" />
                    <Skeleton className="h-5 w-1/2 bg-navy-100" />
                </div>
                <div className="flex items-center justify-between border-t border-navy-100 pt-2">
                    <Skeleton className="h-3 w-20 bg-navy-100" />
                    <Skeleton className="h-7 w-16 rounded-xl bg-navy-100" />
                </div>
            </div>
        </div>
    );
}
