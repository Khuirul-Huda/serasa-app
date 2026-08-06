<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can upload an article image', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);

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

test('updating an article removes orphaned images replaced by admin', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);

    $oldFile = UploadedFile::fake()->image('old-cover.jpg');
    $oldPath = $oldFile->store('articles', 'public');
    $oldUrl = Storage::url($oldPath);

    $article = Article::factory()->create([
        'title' => 'Judul Awal',
        'cover_image' => $oldUrl,
        'content' => "<p>Gambar lama</p><img src=\"{$oldUrl}\" />",
        'category' => 'Berita',
    ]);

    Storage::disk('public')->assertExists($oldPath);

    $newFile = UploadedFile::fake()->image('new-cover.jpg');
    $newPath = $newFile->store('articles', 'public');
    $newUrl = Storage::url($newPath);

    $this->actingAs($admin)->put(route('admin.articles.update', $article->id), [
        'title' => 'Judul Baru',
        'cover_image' => $newUrl,
        'content' => "<p>Gambar baru saja</p><img src=\"{$newUrl}\" />",
        'category' => 'Berita',
        'is_published' => true,
    ]);

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($newPath);
});
