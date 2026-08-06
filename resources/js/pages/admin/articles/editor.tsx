/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, useForm, router } from '@inertiajs/react';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    ArrowLeft,
    Save,
    Eye,
    Edit3,
    Columns,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading2,
    Heading3,
    Quote,
    Code,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Undo,
    Redo,
    Upload,
    Loader2,
    X,
    Sparkles,
    Calendar,
    Clock,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, ArticleItem } from '@/types';

interface ArticleEditorProps {
    article?: ArticleItem | null;
    categories: string[];
    settings?: AppSettings;
}

const DEFAULT_COVER =
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';

export default function ArticleEditor({
    article = null,
    categories = ['Berita', 'Pengumuman', 'Inovasi', 'Edukasi'],
    settings,
}: ArticleEditorProps) {
    const isEditing = Boolean(article && article.id);
    const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
    const [customCategory, setCustomCategory] = useState('');
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [isUploadingInline, setIsUploadingInline] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const coverFileInputRef = useRef<HTMLInputElement>(null);
    const inlineFileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: article?.title || '',
        category: article?.category || 'Berita',
        cover_image: article?.coverImage || article?.cover_image || '',
        excerpt: article?.excerpt || '',
        content:
            article?.content ||
            `<h2>Latar Belakang & Informasi Utama</h2><p>Tuliskan paragraf pembuka artikel di sini. Jelaskan latar belakang inovasi, warta kegiatan, atau pengumuman penting bagi warga desa.</p><h3>Poin Penting Ringkasan</h3><ul><li><p>Manfaat utama produk atau kegiatan lokal warga</p></li><li><p>Jadwal pelaksanaan atau ketersediaan stok produk</p></li><li><p>Dukungan pemerintah desa dan kelompok tani/UMKM</p></li></ul><blockquote><p>"Membeli produk warga lokal adalah langkah nyata membangun kemandirian ekonomi Desa Samirono."</p></blockquote><p>Tuliskan paragraf penutup dan ajakan tindak (Call to Action) bagi pembaca.</p>`,
        is_published: article?.isPublished ?? true,
    });

    const uploadFileToServer = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/admin/articles/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                toast.error(errData.message || 'Gagal mengunggah gambar!');
                return null;
            }

            const result = await response.json();
            return result.url;
        } catch {
            toast.error('Gagal mengunggah gambar!');
            return null;
        }
    };

    // TipTap Editor instance
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            UnderlineExtension,
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl my-4 w-full object-cover shadow-sm',
                },
            }),
            PlaceholderExtension.configure({
                placeholder: 'Tuliskan isi berita atau artikel secara lengkap di sini...',
            }),
        ],
        content: data.content,
        onUpdate: ({ editor }) => {
            setData('content', editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-navy dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-4 text-sm leading-relaxed text-navy-900 dark:text-navy-100 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-pastel-teal [&_blockquote]:bg-navy-50/70 [&_blockquote]:p-4 [&_blockquote]:italic dark:[&_blockquote]:bg-navy-950/80',
            },
            handleDrop: (view, event, _slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        setIsUploadingInline(true);
                        uploadFileToServer(file).then((url) => {
                            setIsUploadingInline(false);
                            if (url && editor) {
                                editor.chain().focus().setImage({ src: url }).run();
                                toast.success('Gambar berhasil diunggah!');
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
            handlePaste: (_view, event) => {
                if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
                    const file = event.clipboardData.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        setIsUploadingInline(true);
                        uploadFileToServer(file).then((url) => {
                            setIsUploadingInline(false);
                            if (url && editor) {
                                editor.chain().focus().setImage({ src: url }).run();
                                toast.success('Gambar berhasil diunggah dari clipboard!');
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
    });

    const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingCover(true);
        const url = await uploadFileToServer(file);
        setIsUploadingCover(false);

        if (url) {
            setData('cover_image', url);
            toast.success('Gambar sampul berhasil diunggah!');
        }

        if (e.target) e.target.value = '';
    };

    const handleInlineFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingInline(true);
        const url = await uploadFileToServer(file);
        setIsUploadingInline(false);

        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
            toast.success('Gambar artikel berhasil diunggah!');
            setIsImageModalOpen(false);
        }

        if (e.target) e.target.value = '';
    };

    const handleInsertImageUrl = () => {
        if (!imageUrlInput.trim()) {
            toast.error('URL Gambar tidak boleh kosong!');
            return;
        }

        if (editor) {
            editor.chain().focus().setImage({ src: imageUrlInput }).run();
            toast.success('Gambar disisipkan!');
            setImageUrlInput('');
            setIsImageModalOpen(false);
        }
    };

    const setLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL Tautan:', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.title.trim()) {
            toast.error('Judul artikel tidak boleh kosong!');
            return;
        }

        const htmlContent = editor ? editor.getHTML() : data.content;
        if (!htmlContent.trim() || htmlContent === '<p></p>') {
            toast.error('Isi artikel tidak boleh kosong!');
            return;
        }

        const finalCategory =
            data.category === 'custom' ? customCategory || 'Berita' : data.category;

        const payload = {
            ...data,
            content: htmlContent,
            category: finalCategory,
        };

        if (isEditing && article) {
            put(route('admin.articles.update', article.id), {
                onSuccess: () => {
                    toast.success('Artikel berhasil diperbarui!');
                    router.visit('/admin/dashboard');
                },
                onError: () => toast.error('Gagal memperbarui artikel, periksa form input.'),
            });
        } else {
            post(route('admin.articles.store'), {
                onSuccess: () => {
                    toast.success('Artikel berhasil diterbitkan!');
                    router.visit('/admin/dashboard');
                },
                onError: () => toast.error('Gagal menerbitkan artikel, periksa form input.'),
            });
        }
    };

    const calculateReadTime = (content: string) => {
        const text = content.replace(/<[^>]+>/g, '');
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    return (
        <MarketplaceLayout settings={settings} categories={[]} activeTab="admin">
            <SEOHead
                title={`${isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'} - TipTap Editor`}
                description="Editor TipTap WYSIWYG dan Live Preview Artikel Desa Samirono"
            />

            <div className="min-h-screen bg-navy-50/50 font-sans text-navy-900 dark:bg-navy-950 dark:text-navy-100">
                {/* TOP EDITOR HEADER BAR */}
                <header className="sticky top-16 z-40 border-b border-navy-200/80 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-navy-800 dark:bg-navy-900/90 sm:px-6">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                        {/* Left Action & Title */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/dashboard"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200/80 bg-white text-navy-700 transition-all hover:bg-navy-100 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200 dark:hover:bg-navy-700"
                                title="Kembali ke Panel Admin"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>

                            <div>
                                <h1 className="text-base font-black tracking-tight text-navy-900 dark:text-white sm:text-lg">
                                    {isEditing ? 'Edit Artikel Desa' : 'Tulis Artikel Baru'}
                                </h1>
                                <p className="text-[11px] font-medium text-navy-500 dark:text-navy-400">
                                    {isEditing
                                        ? `Memperbarui: ${article.title}`
                                        : 'Editor TipTap dengan Upload Gambar & Live Preview'}
                                </p>
                            </div>
                        </div>

                        {/* Center View Mode Switcher */}
                        <div className="flex items-center gap-1 rounded-xl border border-navy-200 bg-navy-100/70 p-1 dark:border-navy-800 dark:bg-navy-950">
                            <button
                                type="button"
                                onClick={() => setViewMode('edit')}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                    viewMode === 'edit'
                                        ? 'bg-white text-navy-900 shadow-xs dark:bg-navy-800 dark:text-white'
                                        : 'text-navy-600 hover:text-navy-900 dark:text-navy-400 dark:hover:text-white'
                                }`}
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Editor</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode('split')}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                    viewMode === 'split'
                                        ? 'bg-white text-navy-900 shadow-xs dark:bg-navy-800 dark:text-white'
                                        : 'text-navy-600 hover:text-navy-900 dark:text-navy-400 dark:hover:text-white'
                                }`}
                            >
                                <Columns className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Split Live</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode('preview')}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                    viewMode === 'preview'
                                        ? 'bg-white text-navy-900 shadow-xs dark:bg-navy-800 dark:text-white'
                                        : 'text-navy-600 hover:text-navy-900 dark:text-navy-400 dark:hover:text-white'
                                }`}
                            >
                                <Eye className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Pratinjau</span>
                            </button>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-3">
                            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-navy-700 dark:text-navy-300">
                                <input
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="h-4 w-4 rounded-md border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                                />
                                <span>Publikasikan Artikel</span>
                            </label>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl bg-pastel-teal px-5 py-2 text-xs font-extrabold text-white shadow-md transition-all hover:bg-pastel-teal/90 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT WORKSPACE */}
                <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    <div
                        className={`grid gap-6 ${
                            viewMode === 'split'
                                ? 'grid-cols-1 lg:grid-cols-2'
                                : 'grid-cols-1'
                        }`}
                    >
                        {/* EDITOR WORKSPACE (Visible in Edit & Split Mode) */}
                        {viewMode !== 'preview' && (
                            <div className="space-y-5 rounded-3xl border border-navy-200/80 bg-white p-6 shadow-xs dark:border-navy-800 dark:bg-navy-900">
                                {/* Article Title */}
                                <div>
                                    <label className="block text-xs font-black tracking-wider text-navy-400 uppercase dark:text-navy-500">
                                        Judul Artikel *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan Judul Artikel..."
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1.5 w-full rounded-2xl border border-navy-200/80 bg-navy-50/50 p-3.5 text-lg font-bold text-navy-900 placeholder-navy-400 focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-xs text-pastel-coral">{errors.title}</p>
                                    )}
                                </div>

                                {/* Category & Cover Image URL Row */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-black tracking-wider text-navy-400 uppercase dark:text-navy-500">
                                            Kategori Artikel *
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="mt-1.5 w-full rounded-xl border border-navy-200/80 bg-navy-50/50 p-2.5 text-xs font-bold text-navy-800 focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-200"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                            <option value="custom">+ Tambah Kategori Lain</option>
                                        </select>

                                        {data.category === 'custom' && (
                                            <input
                                                type="text"
                                                placeholder="Ketik Kategori Baru..."
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-navy-200 p-2 text-xs font-medium text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                            />
                                        )}
                                    </div>

                                    {/* Cover Image Upload & Input */}
                                    <div>
                                        <label className="block text-xs font-black tracking-wider text-navy-400 uppercase dark:text-navy-500">
                                            Gambar Sampul Artikel
                                        </label>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="URL atau Upload file..."
                                                value={data.cover_image}
                                                onChange={(e) => setData('cover_image', e.target.value)}
                                                className="w-full rounded-xl border border-navy-200/80 bg-navy-50/50 p-2.5 text-xs font-medium text-navy-800 focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-200"
                                            />
                                            <input
                                                ref={coverFileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverFileUpload}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => coverFileInputRef.current?.click()}
                                                disabled={isUploadingCover}
                                                className="flex shrink-0 cursor-pointer items-center gap-1 rounded-xl border border-pastel-teal/30 bg-pastel-teal/10 px-3 py-2.5 text-xs font-bold text-pastel-teal transition-all hover:bg-pastel-teal/20 disabled:opacity-50"
                                                title="Upload Gambar Sampul"
                                            >
                                                {isUploadingCover ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Upload className="h-4 w-4" />
                                                )}
                                                <span className="hidden sm:inline">Upload</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="block text-xs font-black tracking-wider text-navy-400 uppercase dark:text-navy-500">
                                        Ringkasan Singkat / Excerpt (Opsional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Ringkasan singkat 1-2 kalimat untuk tampil di kartu artikel..."
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-navy-200/80 bg-navy-50/50 p-3 text-xs leading-relaxed text-navy-800 focus:border-pastel-teal focus:bg-white focus:ring-2 focus:ring-pastel-teal/15 focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-200"
                                    />
                                </div>

                                {/* TIPTAP EDITOR CONTAINER */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-black tracking-wider text-navy-400 uppercase dark:text-navy-500">
                                            Isi Artikel Lengkap (TipTap Editor) *
                                        </label>
                                        <span className="text-[11px] font-medium text-navy-400 dark:text-navy-500">
                                            Dukungan Drag & Drop / Paste Gambar
                                        </span>
                                    </div>

                                    {/* TipTap Floating Toolbar */}
                                    {editor && (
                                        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-navy-200/80 bg-navy-50/80 p-1.5 dark:border-navy-800 dark:bg-navy-950 mb-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('heading', { level: 2 })
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Heading 2"
                                            >
                                                <Heading2 className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('heading', { level: 3 })
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Heading 3"
                                            >
                                                <Heading3 className="h-4 w-4" />
                                            </button>

                                            <div className="h-4 w-px bg-navy-200 dark:bg-navy-800" />

                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleBold().run()}
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('bold')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Bold"
                                            >
                                                <Bold className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('italic')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Italic"
                                            >
                                                <Italic className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleUnderline().run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('underline')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Underline"
                                            >
                                                <UnderlineIcon className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('strike')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Strikethrough"
                                            >
                                                <Strikethrough className="h-4 w-4" />
                                            </button>

                                            <div className="h-4 w-px bg-navy-200 dark:bg-navy-800" />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleBulletList().run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('bulletList')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Bullet List"
                                            >
                                                <List className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleOrderedList().run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('orderedList')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Ordered List"
                                            >
                                                <ListOrdered className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleBlockquote().run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('blockquote')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Blockquote"
                                            >
                                                <Quote className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().toggleCodeBlock().run()
                                                }
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('codeBlock')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Code Block"
                                            >
                                                <Code className="h-4 w-4" />
                                            </button>

                                            <div className="h-4 w-px bg-navy-200 dark:bg-navy-800" />

                                            <button
                                                type="button"
                                                onClick={setLink}
                                                className={`rounded-lg p-1.5 transition-colors ${
                                                    editor.isActive('link')
                                                        ? 'bg-pastel-teal text-white'
                                                        : 'text-navy-700 hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800'
                                                }`}
                                                title="Tambah Tautan"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setIsImageModalOpen(true)}
                                                className="rounded-lg p-1.5 text-navy-700 transition-colors hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800"
                                                title="Sisipkan / Upload Gambar"
                                            >
                                                <ImageIcon className="h-4 w-4 text-pastel-teal" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor.chain().focus().setHorizontalRule().run()
                                                }
                                                className="rounded-lg p-1.5 text-navy-700 transition-colors hover:bg-white dark:text-navy-300 dark:hover:bg-navy-800"
                                                title="Horizontal Rule"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <div className="h-4 w-px bg-navy-200 dark:bg-navy-800" />

                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().undo().run()}
                                                disabled={!editor.can().undo()}
                                                className="rounded-lg p-1.5 text-navy-700 transition-colors hover:bg-white disabled:opacity-30 dark:text-navy-300 dark:hover:bg-navy-800"
                                                title="Undo"
                                            >
                                                <Undo className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().redo().run()}
                                                disabled={!editor.can().redo()}
                                                className="rounded-lg p-1.5 text-navy-700 transition-colors hover:bg-white disabled:opacity-30 dark:text-navy-300 dark:hover:bg-navy-800"
                                                title="Redo"
                                            >
                                                <Redo className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}

                                    {/* TipTap Editor Body Surface */}
                                    <div className="relative overflow-hidden rounded-2xl border border-navy-200/80 bg-navy-50/50 shadow-inner focus-within:border-pastel-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-pastel-teal/15 dark:border-navy-700 dark:bg-navy-950 dark:focus-within:bg-navy-950">
                                        {isUploadingInline && (
                                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs dark:bg-navy-950/70">
                                                <div className="flex items-center gap-2 rounded-2xl bg-navy-900 px-4 py-2 text-xs font-bold text-white shadow-xl">
                                                    <Loader2 className="h-4 w-4 animate-spin text-pastel-teal" />
                                                    <span>Mengunggah Gambar ke Server...</span>
                                                </div>
                                            </div>
                                        )}
                                        <EditorContent editor={editor} />
                                    </div>
                                    {errors.content && (
                                        <p className="mt-1 text-xs text-pastel-coral">{errors.content}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* LIVE PREVIEW CONTAINER (Visible in Split & Preview Mode) */}
                        {viewMode !== 'edit' && (
                            <div className="space-y-4 rounded-3xl border border-navy-200/80 bg-white p-6 shadow-xs dark:border-navy-800 dark:bg-navy-900">
                                <div className="flex items-center justify-between border-b border-navy-100 pb-3 dark:border-navy-800">
                                    <div className="flex items-center gap-2 text-xs font-black tracking-wider text-pastel-teal uppercase">
                                        <Sparkles className="h-4 w-4" />
                                        <span>Pratinjau Langsung Publik</span>
                                    </div>
                                    <span className="rounded-full bg-pastel-teal/10 px-2.5 py-0.5 text-[10px] font-bold text-pastel-teal">
                                        {calculateReadTime(data.content)} min waktu baca
                                    </span>
                                </div>

                                {/* Rendered Article Header & Content */}
                                <article className="space-y-6 pt-2">
                                    {/* Cover Image Banner */}
                                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-navy-200/70 bg-navy-100 dark:border-navy-800 dark:bg-navy-950">
                                        <img
                                            src={data.cover_image || DEFAULT_COVER}
                                            alt={data.title || 'Pratinjau Gambar'}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = DEFAULT_COVER;
                                            }}
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-xl bg-pastel-teal px-3 py-1 text-xs font-black text-white shadow-xs">
                                                {data.category === 'custom'
                                                    ? customCategory || 'Berita'
                                                    : data.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Article Title */}
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight text-navy-900 dark:text-white sm:text-3xl">
                                            {data.title || 'Judul Artikel Anda...'}
                                        </h1>
                                        <div className="mt-2 flex items-center gap-4 text-xs font-medium text-navy-500 dark:text-navy-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-pastel-teal" />
                                                Hari ini
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-pastel-teal" />
                                                {calculateReadTime(data.content)} min baca
                                            </span>
                                        </div>
                                    </div>

                                    {/* Excerpt quote */}
                                    {data.excerpt && (
                                        <p className="rounded-2xl border-l-4 border-pastel-teal bg-pastel-teal-light/30 p-4 text-sm italic leading-relaxed text-navy-800 dark:bg-navy-950 dark:text-navy-200">
                                            {data.excerpt}
                                        </p>
                                    )}

                                    {/* HTML Content Body */}
                                    <div
                                        className="prose prose-navy max-w-none text-sm leading-relaxed text-navy-800 dark:prose-invert dark:text-navy-200 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-900 dark:[&_h2]:text-white [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-pastel-teal [&_blockquote]:bg-navy-50 [&_blockquote]:p-4 [&_blockquote]:italic dark:[&_blockquote]:bg-navy-950"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                data.content ||
                                                '<p class="italic text-navy-400">Mulai ketik isi artikel di editor TipTap...</p>',
                                        }}
                                    />
                                </article>
                            </div>
                        )}
                    </div>
                </main>

                {/* MODAL IMAGE UPLOAD DIALOG FOR TIPTAP */}
                {isImageModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
                        <div className="relative w-full max-w-md rounded-3xl border border-navy-200/80 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900">
                            <div className="flex items-center justify-between border-b border-navy-100 pb-3 dark:border-navy-800">
                                <h3 className="flex items-center gap-2 text-sm font-black text-navy-900 uppercase dark:text-white">
                                    <ImageIcon className="h-4 w-4 text-pastel-teal" />
                                    <span>Sisipkan Gambar ke Artikel</span>
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsImageModalOpen(false)}
                                    className="rounded-xl p-1 text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4">
                                {/* Option A: Upload File */}
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Option 1: Upload File dari Perangkat
                                    </label>
                                    <input
                                        ref={inlineFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleInlineFileUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => inlineFileInputRef.current?.click()}
                                        disabled={isUploadingInline}
                                        className="mt-1.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pastel-teal/40 bg-pastel-teal/5 py-4 text-xs font-bold text-pastel-teal transition-all hover:bg-pastel-teal/10"
                                    >
                                        {isUploadingInline ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Mengunggah...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />
                                                <span>Pilih Gambar dari Komputer</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
                                    <span className="text-[10px] font-bold text-navy-400 uppercase">atau</span>
                                    <div className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
                                </div>

                                {/* Option B: Paste URL */}
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Option 2: Input URL Tautan Gambar
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-navy-200/80 bg-navy-50/50 p-2.5 text-xs text-navy-800 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleInsertImageUrl}
                                        className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-pastel-teal py-2 text-xs font-extrabold text-white shadow-xs hover:bg-pastel-teal/90"
                                    >
                                        <span>Sisipkan URL Gambar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MarketplaceLayout>
    );
}
