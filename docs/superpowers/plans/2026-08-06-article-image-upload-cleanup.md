# Article Image Upload & Storage Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement image file upload endpoints for article cover images and TipTap content images, plus automated image cleanup for orphaned storage files upon article update and deletion.

**Architecture:** Add `uploadImage` endpoint to `ArticleController.php`. Add `cleanupOrphanedImages` logic when updating or deleting articles. Enhance `resources/js/pages/admin/articles/editor.tsx` with file picker, drag-and-drop, and paste event handlers for TipTap and cover image upload.

**Tech Stack:** Laravel 13, Inertia.js v3, React 19, TipTap 3, Pest 4, Storage facade (`public` disk).

## Global Constraints
- Maximum image size: 5MB (5120 KB). Supported formats: PNG, JPG, JPEG, WEBP, GIF.
- Automated cleanup of unused storage files when deleting or replacing images.
- 100% test coverage with `php artisan test --compact`.

---

### Task 1: Image Upload Endpoint & Storage Cleanup Logic

**Files:**
- Modify: `app/Http/Controllers/ArticleController.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/ArticleImageUploadTest.php`

**Interfaces:**
- Produces: `POST /admin/articles/upload-image` returning `{ "url": "/storage/articles/xyz.jpg" }`

- [ ] **Step 1: Write Pest tests for image upload and cleanup**

Create `tests/Feature/ArticleImageUploadTest.php`:
```php
<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can upload an article image', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'user', 'role' => 'admin']);

    $file = UploadedFile::fake()->image('test-article.jpg', 800, 600);

    $response = $this->actingAs($admin)->post(route('admin.articles.upload-image'), [
        'image' => $file,
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['url']);

    $path = str_replace('/storage/', '', $response->json('url'));
    Storage::disk('public')->assertExists($path);
});

test('deleting an article removes orphaned storage images', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);

    $file = UploadedFile::fake()->image('cover.jpg');
    $path = $file->store('articles', 'public');
    $url = Storage::url($path);

    $article = Article::factory()->create([
        'cover_image' => $url,
        'content' => "<p>Teaser</p><img src=\"{$url}\" />",
    ]);

    Storage::disk('public')->assertExists($path);

    $this->actingAs($admin)->delete(route('admin.articles.destroy', $article->id));

    Storage::disk('public')->assertMissing($path);
});
```

- [ ] **Step 2: Run Pest test to verify failure**

Run: `php artisan test --compact --filter=ArticleImageUploadTest`
Expected: FAIL due to missing route & method.

- [ ] **Step 3: Implement `uploadImage` & `cleanOrphanedImages` in `ArticleController.php`**

```php
public function uploadImage(Request $request): JsonResponse
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
    ]);

    $path = $request->file('image')->store('articles', 'public');

    return response()->json([
        'url' => Storage::url($path),
    ]);
}

private function cleanupOrphanedImages(): void
{
    $allStoredFiles = Storage::disk('public')->files('articles');
    if (empty($allStoredFiles)) {
        return;
    }

    $allContent = Article::pluck('content')->implode(' ') . ' ' . Article::pluck('cover_image')->implode(' ');

    foreach ($allStoredFiles as $file) {
        $fileUrl = Storage::url($file);
        if (! str_contains($allContent, $file) && ! str_contains($allContent, basename($file))) {
            Storage::disk('public')->delete($file);
        }
    }
}
```

- [ ] **Step 4: Register route in `routes/web.php`**

Inside `middleware(['can:admin'])` group:
```php
Route::post('/admin/articles/upload-image', [ArticleController::class, 'uploadImage'])->name('admin.articles.upload-image');
```

- [ ] **Step 5: Run tests to verify pass**

Run: `php artisan test --compact --filter=ArticleImageUploadTest`
Expected: PASS.

---

### Task 2: Frontend File Picker, Drag & Drop, and TipTap Image Upload

**Files:**
- Modify: `resources/js/pages/admin/articles/editor.tsx`

**Interfaces:**
- Consumes: `POST /admin/articles/upload-image`
- Produces: Interactive file upload buttons for cover image and TipTap canvas drag & drop / paste image handler

- [ ] **Step 1: Update `editor.tsx` for Cover Image File Upload**

Add file input button next to Cover Image URL input:
- File input trigger with `Upload` icon.
- Uploads file using `FormData` and `fetch('/admin/articles/upload-image')`.
- Displays loading spinner while uploading.
- Sets `data.cover_image` to the returned storage URL.

- [ ] **Step 2: Update `editor.tsx` for TipTap File Upload, Drag & Drop, and Paste**

Add:
- TipTap image button opens a dual modal/dialog: "Upload dari Komputer" or "Tautan URL".
- Configure `editorProps.handleDrop` and `editorProps.handlePaste` to automatically intercept dropped or pasted image files, upload them to `/admin/articles/upload-image`, and insert them directly into the editor.

- [ ] **Step 3: Run Pest test suite**

Run: `php artisan test --compact`
Expected: PASS.

- [ ] **Step 4: Build Vite bundle**

Run: `npm run build`
Expected: SUCCESS.

- [ ] **Step 5: Format PHP code**

Run: `vendor/bin/pint --dirty --format agent`

---
