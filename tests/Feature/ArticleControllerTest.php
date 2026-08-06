<?php

use App\Models\Article;
use App\Models\User;

test('public user can list articles', function () {
    Article::factory()->create(['is_published' => true]);

    $response = $this->get(route('articles.index'));
    $response->assertOk();
});

test('public user can view single article', function () {
    $article = Article::factory()->create(['is_published' => true]);

    $response = $this->get(route('articles.show', $article->slug));
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

test('admin can update an article', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $article = Article::factory()->create(['title' => 'Judul Lama']);

    $response = $this->actingAs($admin)->put(route('admin.articles.update', $article->id), [
        'title' => 'Judul Baru',
        'excerpt' => 'Ringkasan baru.',
        'content' => '<p>Isi artikel baru.</p>',
        'category' => 'Berita',
        'is_published' => true,
    ]);

    $response->assertRedirect();
    expect($article->fresh()->title)->toBe('Judul Baru');
});

test('admin can delete an article', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $article = Article::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.articles.destroy', $article->id));

    $response->assertRedirect();
    expect(Article::find($article->id))->toBeNull();
});

test('admin can toggle article publish status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $article = Article::factory()->create(['is_published' => true]);

    $response = $this->actingAs($admin)->post(route('admin.articles.toggle-publish', $article->id));

    $response->assertRedirect();
    expect($article->fresh()->is_published)->toBeFalse();
});

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

test('non-admin user cannot access admin article routes', function () {
    $user = User::factory()->create(['role' => 'user']);
    $article = Article::factory()->create();

    $this->actingAs($user)->get(route('admin.articles.create'))
        ->assertForbidden();

    $this->actingAs($user)->get(route('admin.articles.edit', $article->id))
        ->assertForbidden();

    $this->actingAs($user)->post(route('admin.articles.store'), [
        'title' => 'Judul Tes',
        'content' => 'Isi',
        'category' => 'Berita',
    ])->assertForbidden();

    $this->actingAs($user)->put(route('admin.articles.update', $article->id), [
        'title' => 'Judul Tes',
        'content' => 'Isi',
        'category' => 'Berita',
    ])->assertForbidden();

    $this->actingAs($user)->delete(route('admin.articles.destroy', $article->id))
        ->assertForbidden();

    $this->actingAs($user)->post(route('admin.articles.toggle-publish', $article->id))
        ->assertForbidden();
});
