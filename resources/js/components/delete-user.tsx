import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6 pt-4 border-t border-navy-100 font-sans">
            <Heading
                variant="small"
                title="Hapus Akun Pengguna"
                description="Hapus akun Anda beserta seluruh data terkait secara permanen"
            />
            <div className="space-y-3 rounded-2xl border border-pastel-coral/30 bg-pastel-coral-light/40 p-4">
                <div className="space-y-0.5 text-pastel-coral">
                    <p className="font-bold text-xs uppercase tracking-wider">Peringatan Penting</p>
                    <p className="text-xs font-normal">
                        Harap berhati-hati, tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                            className="bg-pastel-coral hover:bg-pastel-coral/90 text-white font-bold text-xs rounded-xl"
                        >
                            Hapus Akun Saya
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl font-sans">
                        <DialogTitle className="text-navy-900 font-black">
                            Apakah Anda yakin ingin menghapus akun Anda?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-navy-600 leading-relaxed">
                            Setelah akun Anda dihapus, seluruh data toko, produk,
                            dan riwayat akan terhapus secara permanen. Silakan
                            masukkan kata sandi Anda untuk mengonfirmasi penghapusan permanen ini.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Kata Sandi
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Masukkan kata sandi Anda"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                                className="rounded-xl border border-navy-200"
                                            >
                                                Batal
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                            className="bg-pastel-coral hover:bg-pastel-coral/90 rounded-xl font-bold"
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Ya, Hapus Akun Permanen
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
