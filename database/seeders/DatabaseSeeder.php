<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Setting;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Authenticated Users
        $owner = User::factory()->create([
            'name' => 'Pak Budi Santoso',
            'email' => 'owner@serasa.levitation.web.id',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin Desa Samirono',
            'email' => 'admin@serasa.levitation.web.id',
            'password' => Hash::make('password'),
        ]);

        // 2. Seed App Settings
        $settings = [
            'appName' => 'SERASA',
            'tagline' => 'Etalase Kreatif & Digitalisasi UMKM Desa Samirono',
            'villageName' => 'Desa Samirono',
            'description' => 'Wadah promosi digital terpusat untuk memperkenalkan produk-produk ekonomi kreatif unggulan Desa Samirono. Memperluas jangkauan pasar eksternal dan mendigitalisasi pelaku UMKM lokal agar berdaya saing global.',
            'adminPhone' => '6285725912345',
            'heroBanner' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
        ];

        foreach ($settings as $key => $value) {
            Setting::create(['key' => $key, 'value' => $value]);
        }

        // 3. Seed Categories
        $categories = [
            [
                'id' => 'cat-kuliner',
                'name' => 'Kuliner & Olahan',
                'icon_name' => 'Utensils',
                'description' => 'Makanan tradisional, jajanan pasar khas desa, dan produk olahan lokal.',
                'color' => 'amber',
            ],
            [
                'id' => 'cat-pertanian',
                'name' => 'Pertanian & Susu',
                'icon_name' => 'Sprout',
                'description' => 'Susu sapi segar, keju artisan lokal, dan hasil bumi organik segar.',
                'color' => 'emerald',
            ],
            [
                'id' => 'cat-kerajinan',
                'name' => 'Kriya & Kerajinan',
                'icon_name' => 'Hammer',
                'description' => 'Kerajinan tangan dari bambu, anyaman tradisional, dan dekorasi rumah bernilai seni.',
                'color' => 'orange',
            ],
            [
                'id' => 'cat-wisata',
                'name' => 'Wisata & Jasa',
                'icon_name' => 'Compass',
                'description' => 'Sewa homestay, paket edukasi perah susu, outbound, dan pemandu lokal.',
                'color' => 'blue',
            ],
            [
                'id' => 'cat-fashion',
                'name' => 'Fashion & Kain',
                'icon_name' => 'Shirt',
                'description' => 'Batik lokal, pakaian anyaman rajut, dan kerajinan serat kain alami.',
                'color' => 'purple',
            ],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // 4. Seed Shops (Linking shop-milk to our owner account)
        $shops = [
            [
                'id' => 'shop-milk',
                'name' => 'Susu Segar & Keju Samirono',
                'owner_name' => 'Pak Budi Santoso',
                'description' => 'Pelopor keju artisan lokal dan produk olahan susu murni langsung dari peternakan sapi perah Dusun Bentar. Kami mengutamakan kebersihan, kemurnian susu, dan rasa otentik khas pegunungan.',
                'category' => 'Pertanian & Susu',
                'phone' => '6281234567801',
                'address' => 'Jl. Raya Samirono-Kopeng No. 12, Dusun Bentar, Desa Samirono',
                'dusun' => 'Dusun Bentar',
                'image' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.3822,
                'lng' => 110.4287,
                'working_hours' => '07:00 - 16:30',
                'user_id' => $owner->id,
            ],
            [
                'id' => 'shop-bamboo',
                'name' => 'Kriya Bambu Lestari',
                'owner_name' => 'Pak Joko Waluyo',
                'description' => 'Produksi berbagai perlengkapan rumah, kap lampu dekoratif, dan tas anyaman eksklusif berbahan bambu lokal berkualitas tinggi yang diawetkan secara alami.',
                'category' => 'Kriya & Kerajinan',
                'phone' => '6285744433321',
                'address' => 'Rt 03 / Rw 01, Dusun Samirono Kidul, Desa Samirono',
                'dusun' => 'Dusun Samirono',
                'image' => 'https://images.unsplash.com/photo-1531971589569-0d93700db184?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.3860,
                'lng' => 110.4245,
                'working_hours' => '08:00 - 17:00 (Senin - Sabtu)',
                'user_id' => null,
            ],
            [
                'id' => 'shop-jamur',
                'name' => 'Kelompok Tani Jamur Organik',
                'owner_name' => 'Ibu Sri Wahyuni',
                'description' => 'Budidaya jamur tiram putih organik and produsen camilan keripik jamur aneka rasa yang renyah, gurih, bebas MSG, dan bergizi tinggi.',
                'category' => 'Pertanian & Susu',
                'phone' => '6289988877766',
                'address' => 'Dusun Surowono Rt 02, Desa Samirono',
                'dusun' => 'Dusun Surowono',
                'image' => 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.3795,
                'lng' => 110.4350,
                'working_hours' => '06:00 - 14:00 (Setiap Hari)',
                'user_id' => null,
            ],
            [
                'id' => 'shop-gethuk',
                'name' => 'Gethuk Keju Samirono Nyus',
                'owner_name' => 'Ibu Aminah',
                'description' => 'Menyediakan gethuk goreng ketela khas Samirono dengan sentuhan modern taburan keju melimpah. Manis alami dari gula kelapa dipadu gurihnya keju susu murni.',
                'category' => 'Kuliner & Olahan',
                'phone' => '6281322233344',
                'address' => 'Depan Lapangan Dusun Tawang, Desa Samirono',
                'dusun' => 'Dusun Tawang',
                'image' => 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.3754,
                'lng' => 110.4292,
                'working_hours' => '09:00 - 21:00',
                'user_id' => null,
            ],
            [
                'id' => 'shop-wisata',
                'name' => 'Desa Wisata Outbound Samirono',
                'owner_name' => 'Mas Wahyu Prasetyo',
                'description' => 'Kami mengelola paket wisata edukatif untuk anak sekolah & keluarga, mulai dari jelajah alam desa, edukasi pemerahan susu sapi langsung, hingga penginapan homestay nyaman berudara sejuk.',
                'category' => 'Wisata & Jasa',
                'phone' => '6281234567899',
                'address' => 'Sekretariat Desa Wisata, Dusun Samirono, Desa Samirono',
                'dusun' => 'Dusun Samirono',
                'image' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
                'logo' => 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=150',
                'is_verified' => true,
                'lat' => -7.3888,
                'lng' => 110.4310,
                'working_hours' => '24 Jam (Dengan Reservasi)',
                'user_id' => null,
            ],
        ];

        foreach ($shops as $shop) {
            Shop::create($shop);
        }

        // 5. Seed Products
        $products = [
            [
                'id' => 'prod-susu-murni',
                'shop_id' => 'shop-milk',
                'category_id' => 'cat-pertanian',
                'name' => 'Susu Sapi Segar Murni Pasteurisasi',
                'description' => 'Susu sapi murni segar yang telah melalui proses pasteurisasi higienis tanpa merusak nutrisi aslinya. Tanpa bahan pengawet dan pemanis buatan. Sangat menyehatkan bagi keluarga Anda.',
                'price' => 15000,
                'unit' => 'Liter',
                'image' => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.9,
                'reviews_count' => 2, // seeded count
                'is_available' => true,
            ],
            [
                'id' => 'prod-keju-artisan',
                'shop_id' => 'shop-milk',
                'category_id' => 'cat-pertanian',
                'name' => 'Keju Mozzarella Lokal Samirono',
                'description' => 'Keju mozzarella lokal premium yang diproses secara tradisional menggunakan 100% susu murni sapi pegunungan Samirono. Memiliki tekstur mulur (stretchy) yang sempurna saat meleleh dan rasa gurih yang kaya.',
                'price' => 35000,
                'unit' => '250 gram',
                'image' => 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.8,
                'reviews_count' => 1,
                'is_available' => true,
            ],
            [
                'id' => 'prod-yogurt',
                'shop_id' => 'shop-milk',
                'category_id' => 'cat-pertanian',
                'name' => 'Creamy Fruit Yogurt Stroberi',
                'description' => 'Yogurt kental (Greek style) dengan potongan buah stroberi asli yang difermentasi secara higienis dari susu perah pilihan. Segar, manis-asam pas, dan kaya probiotik baik untuk pencernaan.',
                'price' => 12000,
                'unit' => '250 ml',
                'image' => 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.7,
                'reviews_count' => 0,
                'is_available' => true,
            ],
            [
                'id' => 'prod-bambu-lampu',
                'shop_id' => 'shop-bamboo',
                'category_id' => 'cat-kerajinan',
                'name' => 'Lampu Hias Etnik Bambu Ulir',
                'description' => 'Kap lampu meja bernilai seni tinggi hasil kerajinan tangan terampil warga desa. Menggunakan bambu pilihan yang diukir spiral halus untuk menghasilkan pendaran cahaya yang hangat dan romantis di ruangan Anda.',
                'price' => 125000,
                'unit' => 'Pcs',
                'image' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600',
                'rating' => 5.0,
                'reviews_count' => 1,
                'is_available' => true,
            ],
            [
                'id' => 'prod-bambu-tas',
                'shop_id' => 'shop-bamboo',
                'category_id' => 'cat-kerajinan',
                'name' => 'Tas Anyaman Bambu Jinjing Ayu',
                'description' => 'Tas jinjing cantik dari anyaman kulit bambu luar yang halus. Kuat, elegan, dan ramah lingkungan. Cocok digunakan untuk bepergian, belanja estetik, maupun souvenir kearifan lokal.',
                'price' => 75000,
                'unit' => 'Pcs',
                'image' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.6,
                'reviews_count' => 0,
                'is_available' => true,
            ],
            [
                'id' => 'prod-jamur-keripik',
                'shop_id' => 'shop-jamur',
                'category_id' => 'cat-kuliner',
                'name' => 'Keripik Jamur Tiram Crispy (Original)',
                'description' => 'Camilan keripik jamur sehat dari jamur tiram pilihan hasil budidaya organik warga Dusun Surowono. Digoreng kering dengan tepung bumbu rahasia menghasilkan kriuk yang garing dan nikmat.',
                'price' => 18000,
                'unit' => '150 gram',
                'image' => 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.8,
                'reviews_count' => 0,
                'is_available' => true,
            ],
            [
                'id' => 'prod-jamur-segar',
                'shop_id' => 'shop-jamur',
                'category_id' => 'cat-pertanian',
                'name' => 'Jamur Tiram Putih Segar Organik',
                'description' => 'Jamur tiram putih segar yang langsung dipanen di pagi hari dari baglog budidaya alami. Kaya serat, protein nabati, dan dibudidayakan 100% bebas dari pestisida kimia.',
                'price' => 15000,
                'unit' => 'Kg',
                'image' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.7,
                'reviews_count' => 0,
                'is_available' => true,
            ],
            [
                'id' => 'prod-gethuk-keju',
                'shop_id' => 'shop-gethuk',
                'category_id' => 'cat-kuliner',
                'name' => 'Gethuk Goreng Topping Keju Lumer',
                'description' => 'Perpaduan harmonis antara kuliner tradisional jawa dan susu modern. Gethuk goreng empuk berbahan ketela pohon pilihan yang manis alami, digoreng garing, lalu disajikan dengan parutan keju Samirono melimpah.',
                'price' => 25000,
                'unit' => 'Box (isi 12)',
                'image' => 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.9,
                'reviews_count' => 1,
                'is_available' => true,
            ],
            [
                'id' => 'prod-wisata-sapi',
                'shop_id' => 'shop-wisata',
                'category_id' => 'cat-wisata',
                'name' => 'Paket Wisata Edukasi Perah Susu Sapi',
                'description' => 'Paket seru belajar mengenal peternakan sapi perah secara langsung. Sempurna untuk rombongan sekolah atau keluarga. Termasuk praktek memerah susu, edukasi pakan, makan siang desa, dan susu segar hangat gratis.',
                'price' => 50000,
                'unit' => 'Pax (Minimal 5)',
                'image' => 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600',
                'rating' => 5.0,
                'reviews_count' => 0,
                'is_available' => true,
            ],
            [
                'id' => 'prod-homestay',
                'shop_id' => 'shop-wisata',
                'category_id' => 'cat-wisata',
                'name' => 'Sewa Homestay Merbabu Breeze',
                'description' => 'Rasakan menginap di kaki gunung Merbabu dengan keramahan warga lokal. Homestay bersih dengan fasilitas 2 kamar tidur, air hangat, dapur kecil, wifi, dan pemandangan sunrise yang memukau langsung dari jendela kamar.',
                'price' => 200000,
                'unit' => 'Malam',
                'image' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
                'rating' => 4.8,
                'reviews_count' => 0,
                'is_available' => true,
            ],
        ];

        foreach ($products as $prod) {
            Product::create($prod);
        }

        // 6. Seed Reviews
        $reviews = [
            [
                'id' => 'rev-1',
                'product_id' => 'prod-susu-murni',
                'user_name' => 'Andri Setiawan (Semarang)',
                'rating' => 5,
                'comment' => 'Susu murni paling segar yang pernah saya beli! Pengemasan rapi dan dingin sampai di Salatiga. Pasti langganan.',
            ],
            [
                'id' => 'rev-2',
                'product_id' => 'prod-susu-murni',
                'user_name' => 'Ibu Hartati',
                'rating' => 4,
                'comment' => 'Anak-anak suka sekali susu murninya, rasanya creamy banget beda sama susu supermarket. Mantap sekali UMKM Samirono.',
            ],
            [
                'id' => 'rev-3',
                'product_id' => 'prod-keju-artisan',
                'user_name' => 'Chef Arnold (Yogyakarta)',
                'rating' => 5,
                'comment' => 'Luar biasa! Tidak menyangka ada keju mozzarella lokal dengan kualitas semeleleh ini di lereng Merbabu. Rasa gurih susunya khas sekali.',
            ],
            [
                'id' => 'rev-4',
                'product_id' => 'prod-gethuk-keju',
                'user_name' => 'Siti Rahma',
                'rating' => 5,
                'comment' => 'Gethuknya lembut banget di dalam, luarnya garing manis dipadu keju asin. Kombinasi juara banget wajib coba!',
            ],
            [
                'id' => 'rev-5',
                'product_id' => 'prod-bambu-lampu',
                'user_name' => 'Dewi Lestari',
                'rating' => 5,
                'comment' => 'Finishing bambunya halus sekali, rapi banget garapannya. Lampu tidurnya jadi estetik banget di kamar saya.',
            ],
        ];

        foreach ($reviews as $rev) {
            Review::create($rev);
        }
    }
}
