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
