import { useAppearance } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group font-sans"
            position="bottom-right"
            expand={false}
            richColors={false}
            icons={{
                success: <CheckCircle2 className="h-5 w-5 shrink-0 text-pastel-teal" />,
                error: <AlertCircle className="h-5 w-5 shrink-0 text-pastel-coral" />,
                info: <Info className="h-5 w-5 shrink-0 text-pastel-teal" />,
                warning: <AlertTriangle className="h-5 w-5 shrink-0 text-pastel-peach" />,
                loading: <Loader2 className="h-5 w-5 shrink-0 animate-spin text-pastel-teal" />,
            }}
            toastOptions={{
                classNames: {
                    toast: 'group flex items-center gap-3 rounded-2xl border border-navy-200/80 bg-white/95 p-4 text-xs font-bold text-navy-900 shadow-2xl backdrop-blur-md transition-all dark:border-navy-800 dark:bg-navy-900/95 dark:text-white',
                    title: 'text-xs font-extrabold tracking-wide text-navy-900 dark:text-white',
                    description: 'text-[11px] font-medium text-navy-500 dark:text-navy-400',
                    actionButton: 'rounded-xl bg-pastel-teal px-3 py-1.5 text-xs font-extrabold text-white shadow-xs hover:bg-pastel-teal/90',
                    cancelButton: 'rounded-xl border border-navy-200 bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-600 hover:bg-navy-100 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-300',
                    success: '!border-pastel-teal/40 !bg-pastel-teal-light/50 dark:!bg-navy-950/95',
                    error: '!border-pastel-coral/40 !bg-pastel-coral-light/50 dark:!bg-navy-950/95',
                    info: '!border-pastel-teal/30 !bg-navy-50/90 dark:!bg-navy-950/95',
                    warning: '!border-pastel-peach/40 !bg-pastel-peach-light/50 dark:!bg-navy-950/95',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
