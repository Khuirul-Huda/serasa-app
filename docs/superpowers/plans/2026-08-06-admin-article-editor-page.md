# Dedicated Admin Article Editor Page & Live Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace popup modals for article creation/editing with a dedicated full-page WYSIWYG editor featuring a rich formatting toolbar, live preview mode, and direct navigation from `/admin/dashboard`.

**Architecture:** Create `admin/articles/editor.tsx` Inertia page for both `/admin/articles/create` and `/admin/articles/{id}/edit` routes. Update `ArticleController.php` with `create()` and `edit()` actions. Modify `ArticlesTab.tsx` to use page links instead of modal popups. Update `app.tsx` layout resolver.

**Tech Stack:** Laravel 13, Inertia.js v3, React 19, Tailwind CSS v4, Lucide React, Pest 4.

## Global Constraints
- No modal popups for article writing/editing.
- Real-time WYSIWYG formatting and live preview mode.
- 100% test coverage with `php artisan test --compact`.

---

### Task 1: Backend Routes and Controller Actions for Dedicated Article Editor

**Files:**
- Modify: `app/Http/Controllers/ArticleController.php`
- Modify: `routes/web.php`
- Modify: `resources/js/app.tsx`
- Test: `tests/Feature/ArticleControllerTest.php`

**Interfaces:**
- Produces: `admin.articles.create` (GET `/admin/articles/create`), `admin.articles.edit` (GET `/admin/articles/{id}/edit`)

- [ ] **Step 1: Write Pest tests for create and edit routes**

```php
test('admin can access article create page', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $response = $this->actingAs($admin)->get(route('admin.articles.create'));
    $response->assertOk();
});

test('admin can access article edit page', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $article = Article::factory()->create();
    $response = $this->actingAs($admin)->get(route('admin.articles.edit', $article->id));
    $response->assertOk();
});
```

- [ ] **Step 2: Run Pest test to verify failure**

Run: `php artisan test --compact --filter=ArticleControllerTest`
Expected: FAIL due to missing routes/actions.

- [ ] **Step 3: Update `ArticleController.php`**

Add `create()` and `edit(string $id)` methods:
```php
public function create(): Response
{
    $categories = Article::distinct()->pluck('category')->toArray();
    if (empty($categories)) {
        $categories = ['Berita', 'Pengumuman', 'Inovasi', 'Edukasi'];
    }

    return Inertia::render('admin/articles/editor', [
        'article' => null,
        'categories' => array_values(array_unique(array_merge(['Berita', 'Pengumuman', 'Inovasi', 'Edukasi'], $categories))),
        'settings' => Setting::getAllAsArray(),
    ]);
}

public function edit(string $id): Response
{
    $article = Article::findOrFail($id);
    $categories = Article::distinct()->pluck('category')->toArray();

    return Inertia::render('admin/articles/editor', [
        'article' => $article,
        'categories' => array_values(array_unique(array_merge(['Berita', 'Pengumuman', 'Inovasi', 'Edukasi'], $categories))),
        'settings' => Setting::getAllAsArray(),
    ]);
}
```

- [ ] **Step 4: Register routes in `routes/web.php`**

Inside `can:admin` group:
```php
Route::get('/admin/articles/create', [ArticleController::class, 'create'])->name('admin.articles.create');
Route::get('/admin/articles/{id}/edit', [ArticleController::class, 'edit'])->name('admin.articles.edit');
```

- [ ] **Step 5: Add layout bypass in `resources/js/app.tsx`**

Add `case name.startsWith('admin/articles'):` to `return null;` layout bypass.

- [ ] **Step 6: Run tests to verify pass**

Run: `php artisan test --compact --filter=ArticleControllerTest`
Expected: PASS.

---

### Task 2: Build Dedicated WYSIWYG Editor Page with Live Preview (`admin/articles/editor.tsx`)

**Files:**
- Create: `resources/js/pages/admin/articles/editor.tsx`
- Modify: `resources/js/components/admin/ArticlesTab.tsx`

**Interfaces:**
- Consumes: `{ article?: Article | null, categories: string[], settings: AppSettings }`
- Produces: Dedicated full-page WYSIWYG editor with rich formatting toolbar and real-time live preview toggle

- [ ] **Step 1: Create `resources/js/pages/admin/articles/editor.tsx`**

Build component with:
- Top bar: Back link to `/admin/dashboard` ("&larr; Kembali ke Panel Admin"), Page Title ("Tulis Artikel Baru" / "Edit Artikel"), View Mode Tabs (Edit Mode / Split View / Live Preview), Publish Toggle, Submit Button ("Terbitkan Artikel" / "Simpan Perubahan").
- Form controls:
  - Title input (`text-2xl sm:text-3xl font-bold`)
  - Category selector + custom category input
  - Cover Image URL input with instant preview thumbnail
  - Excerpt textarea
- Rich Text Formatting Toolbar:
  - Heading 2 (`<h2>`), Heading 3 (`<h3>`), Bold (`<b>`), Italic (`<i>`), Underline (`<u>`), Quote (`<blockquote>`), Code block (`<pre>`), Bullet list (`<ul>`), Numbered list (`<ol>`), Link (`<a>`), Horizontal rule (`<hr>`).
- HTML Editor textarea + Interactive Live Preview Container rendering formatted article card & full prose article exactly like public page (`/articles/{slug}`).
- Dark mode support (`dark:bg-navy-950`, `dark:text-navy-100`, `dark:border-navy-800`).

- [ ] **Step 2: Update `resources/js/components/admin/ArticlesTab.tsx`**

- Remove creation/edit modal JSX and state.
- Change "Tulis Artikel Baru" button to Inertia `<Link href="/admin/articles/create">`.
- Change article "Edit" action button to Inertia `<Link href={`/admin/articles/${article.id}/edit`}>`.

- [ ] **Step 3: Run Pest test suite**

Run: `php artisan test --compact`
Expected: PASS.

- [ ] **Step 4: Verify frontend build**

Run: `npm run build`
Expected: SUCCESS.

- [ ] **Step 5: Run Pint code formatter**

Run: `vendor/bin/pint --dirty --format agent`

---
