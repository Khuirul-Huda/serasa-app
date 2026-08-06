<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->query('category');
        $search = $request->query('search');

        $query = Article::where('is_published', true)->latest('published_at');

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $articles = $query->paginate(9)->withQueryString();
        $settings = array_merge($this->getAppSettings(), Setting::getAllAsArray());
        $categories = Article::where('is_published', true)->distinct()->pluck('category');

        return Inertia::render('articles/index', [
            'articles' => $articles,
            'settings' => $settings,
            'categories' => $categories,
            'filters' => [
                'category' => $category,
                'search' => $search,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::where('slug', $slug)->firstOrFail();
        $recentArticles = Article::where('is_published', true)
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->take(3)
            ->get();
        $settings = array_merge($this->getAppSettings(), Setting::getAllAsArray());

        return Inertia::render('articles/show', [
            'article' => $article,
            'recentArticles' => $recentArticles,
            'settings' => $settings,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|url|max:1000',
            'category' => 'required|string|max:100',
            'is_published' => 'boolean',
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $count = 1;
        while (Article::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        Article::create([
            'id' => 'art-'.(string) Str::uuid(),
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'cover_image' => $validated['cover_image'] ?? 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
            'category' => $validated['category'],
            'is_published' => $validated['is_published'] ?? true,
            'published_at' => ($validated['is_published'] ?? true) ? now() : null,
        ]);

        return redirect()->back()->with('success', 'Artikel berhasil diterbitkan!');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|url|max:1000',
            'category' => 'required|string|max:100',
            'is_published' => 'boolean',
        ]);

        if ($article->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;
            while (Article::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }
            $article->slug = $slug;
        }

        $article->update([
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'cover_image' => $validated['cover_image'] ?? $article->cover_image,
            'category' => $validated['category'],
            'is_published' => $validated['is_published'] ?? $article->is_published,
            'published_at' => ($validated['is_published'] && ! $article->published_at) ? now() : $article->published_at,
        ]);

        return redirect()->back()->with('success', 'Artikel berhasil diperbarui!');
    }

    public function destroy(string $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return redirect()->back()->with('success', 'Artikel berhasil dihapus!');
    }

    public function togglePublish(string $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->is_published = ! $article->is_published;
        if ($article->is_published && ! $article->published_at) {
            $article->published_at = now();
        }
        $article->save();

        return redirect()->back()->with('success', 'Status publikasi artikel diperbarui!');
    }
}
