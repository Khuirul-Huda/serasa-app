<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'id' => 'art-'.(string) Str::uuid(),
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(),
            'content' => '<p>'.fake()->paragraph(3).'</p>',
            'cover_image' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
            'category' => fake()->randomElement(['Berita', 'Pengumuman', 'Inovasi', 'Edukasi']),
            'is_published' => true,
            'published_at' => now(),
        ];
    }
}
