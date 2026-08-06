# Admin Article Publishing CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide full article management capabilities for admins (create, edit, delete, publish toggle) and public pages for reading village news/articles on the Serasa platform.

**Architecture:** Create an `Article` Eloquent model and migration, a dedicated `ArticleController` handling public listing/detail and admin CRUD actions, Inertia React pages for public article reading (`resources/js/pages/articles/index.tsx`, `resources/js/pages/articles/show.tsx`), and integrate an Article Management panel inside the Admin Dashboard (`resources/js/components/admin/ArticlesTab.tsx`).

**Tech Stack:** Laravel 13, PHP 8.5, Pest 4, Inertia.js v3, React 19, Tailwind CSS v4, Lucide React icons.

## Global Constraints

- Use TitleCase for Enums/Models, single quotes for Tinker, explicit return types in PHP.
- All new routes use named routes.
- React components use Tailwind v4 utility classes and support dark mode (`dark:` variants).
- 100% test coverage using Pest PHP (`php artisan test --compact`).

---

### Task 1: Create Article Migration, Model, Factory, Seeder & Tests

**Files:**
- Create: `database/migrations/2026_08_06_000001_create_articles_table.php`
- Create: `app/Models/Article.php`
- Create: `database/factories/ArticleFactory.php`
- Test: `tests/Feature/ArticleTest.php`

**Interfaces:**
- Produces: `App\Models\Article` with fields `id`, `user_id`, `title`, `slug`, `excerpt`, `content`, `cover_image`, `category`, `is_published`, `published_at`

- [ ] **Step 1: Write the failing Pest feature test**

```php
// tests/Feature/ArticleTest.php
<?php

use App\Models\Article;
use App\Models\User;

test('can create an article', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $article = Article::create([
        'id' => 'art-123',
        'user_id' => $admin->id,
        'title' => 'Kabar Desa Samirono',
        'slug' => 'kabar-desa-samirono',
        'excerpt' => 'Ringkasan kabar desa.',
        'content' => '<p>Isi berita lengkap desa Samirono.</p>',
        'category' => 'Berita',
        'is_published' => true,
        'published_at' => now(),
    ]);

    expect($article->title)->toBe('Kabar Desa Samirono');
    expect(Article::count())->toBe(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --compact --filter=ArticleTest`
Expected: FAIL due to missing Article model/migration.

- [ ] **Step 3: Create migration and model**

```php
// database/migrations/2026_08_06_000001_create_articles_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('cover_image')->nullable();
            $table->string('category')->default('Berita');
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
```

```php
// app/Models/Article.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'category',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->id)) {
                $article->id = 'art-' . (string) Str::uuid();
            }
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
```

```php
// database/factories/ArticleFactory.php
<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'id' => 'art-' . (string) Str::uuid(),
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(),
            'content' => '<p>' . fake()->paragraph(3) . '</p>',
            'cover_image' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
            'category' => fake()->randomElement(['Berita', 'Pengumuman', 'Inovasi', 'Edukasi']),
            'is_published' => true,
            'published_at' => now(),
        ];
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test --compact --filter=ArticleTest`
Expected: PASS.

- [ ] **Step 5: Run Pint code formatter**

Run: `vendor/bin/pint --dirty --format agent`

---

### Task 2: Implement ArticleController and Routes

**Files:**
- Create: `app/Http/Controllers/ArticleController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/ArticleControllerTest.php`

**Interfaces:**
- Consumes: `App\Models\Article`
- Produces: Web routes `articles.index`, `articles.show`, `admin.articles.store`, `admin.articles.update`, `admin.articles.destroy`, `admin.articles.toggle-publish`

- [ ] **Step 1: Write the failing controller tests**

```php
// tests/Feature/ArticleControllerTest.php
<?php

use App\Models\Article;
use App\Models\User;

test('public user can list articles', function () {
    Article::factory()->create(['is_published' => true]);

    $response = $this->get(route('articles.index'));
    $response->assertOk();
});

test('admin can create an article', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.articles.store'), [
        'title' => 'Inovasi Peternakan Desa',
        'excerpt' => 'Ringkasan inovasi.',
        'content' => '<p>Detail artikel inovasi peternakan.</p>',
        'category' => 'Inovasi',
        'is_published' => true,
    ]);

    $response->assertRedirect();
    expect(Article::where('title', 'Inovasi Peternakan Desa')->exists())->toBeTrue();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test --compact --filter=ArticleControllerTest`
Expected: FAIL with route not defined.

- [ ] **Step 3: Implement ArticleController**

```php
// app/Http/Controllers/ArticleController.php
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
        $settings = Setting::getAllAsArray();
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
        $settings = Setting::getAllAsArray();

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
            'id' => 'art-' . (string) Str::uuid(),
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
            'published_at' => ($validated['is_published'] && !$article->published_at) ? now() : $article->published_at,
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
        $article->is_published = !$article->is_published;
        if ($article->is_published && !$article->published_at) {
            $article->published_at = now();
        }
        $article->save();

        return redirect()->back()->with('success', 'Status publikasi artikel diperbarui!');
    }
}
```

- [ ] **Step 4: Register routes in `routes/web.php`**

Add public routes:
`Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');`
`Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');`

Add admin routes under `can:admin` group:
`Route::post('/admin/articles', [ArticleController::class, 'store'])->name('admin.articles.store');`
`Route::put('/admin/articles/{id}', [ArticleController::class, 'update'])->name('admin.articles.update');`
`Route::delete('/admin/articles/{id}', [ArticleController::class, 'destroy'])->name('admin.articles.destroy');`
`Route::post('/admin/articles/{id}/toggle-publish', [ArticleController::class, 'togglePublish'])->name('admin.articles.toggle-publish');`

- [ ] **Step 5: Run tests to verify pass**

Run: `php artisan test --compact --filter=ArticleControllerTest`
Expected: PASS.

- [ ] **Step 6: Run Pint**

Run: `vendor/bin/pint --dirty --format agent`

---

### Task 3: Build Admin Article Management Tab (`ArticlesTab.tsx`)

**Files:**
- Create: `resources/js/components/admin/ArticlesTab.tsx`
- Modify: `resources/js/pages/admin-dashboard.tsx`
- Modify: `app/Http/Controllers/AdminDashboardController.php`

**Interfaces:**
- Consumes: Articles list from `AdminDashboardController`
- Produces: Article management UI with rich editor / modal for posting articles

- [ ] **Step 1: Pass articles data in `AdminDashboardController::index`**

Update `AdminDashboardController::index`:
Fetch `$articles = Article::latest()->get();` and pass `'articles' => $articles` to the Inertia render response.

- [ ] **Step 2: Create `ArticlesTab.tsx` component**

Include:
- Articles statistics (Total Articles, Published, Drafts)
- "Tulis Artikel Baru" modal button with title, category, cover image URL, excerpt, and content rich editor/textarea.
- Table of articles with thumbnail, title, category, published status toggle button, edit button, and delete button.

- [ ] **Step 3: Update `admin-dashboard.tsx`**

Import `ArticlesTab` and add a new tab button "Artikel & Kabar Desa" with icon `Newspaper` alongside existing tabs.

- [ ] **Step 4: Run Pest test suite to ensure no regressions**

Run: `php artisan test --compact`
Expected: PASS.

---

### Task 4: Build Public Article Pages (`articles/index.tsx` & `articles/show.tsx`) & Navigation Links

**Files:**
- Create: `resources/js/pages/articles/index.tsx`
- Create: `resources/js/pages/articles/show.tsx`
- Modify: `resources/js/components/Navbar.tsx`
- Modify: `resources/js/layouts/marketplace-layout.tsx`

**Interfaces:**
- Consumes: Public article feed, single article view
- Produces: Beautiful, accessible, dark-mode supported news & articles listing and reader pages

- [ ] **Step 1: Create `resources/js/pages/articles/index.tsx`**

Public page with:
- MarketplaceLayout wrapping.
- Hero header "Kabar & Artikel Desa".
- Category chips filter & search bar.
- Grid of article cards (cover image, category badge, title, excerpt, date, read time).
- Pagination bar.

- [ ] **Step 2: Create `resources/js/pages/articles/show.tsx`**

Public page with:
- MarketplaceLayout wrapping.
- Article title, category badge, publication date, author details.
- Article cover image.
- Article HTML content container (`prose dark:prose-invert max-w-none`).
- Sidebar with recent articles & share button.

- [ ] **Step 3: Add Navigation Links**

In `Navbar.tsx` & `MarketplaceLayout.tsx` footer:
Add link to `/articles` ("Kabar Desa").

- [ ] **Step 4: Run full verification suite**

Run: `php artisan test --compact`
Expected: 100% tests passing.

---
