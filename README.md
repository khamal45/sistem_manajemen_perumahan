## Login

Gunakan kredensial berikut untuk masuk ke aplikasi:

- **Email:** `admin@gmail.com`
- **Password:** `root`

---

## Spesifikasi Versi

- **PHP:** `8.4.8`
- **Node.js:** `v23.10.0`

---

## Prasyarat

Pastikan Anda telah menginstal:

- **Database** (misal: MySQL melalui XAMPP)
- **Composer**
- **VSCode** (opsional, namun direkomendasikan)

Aktifkan ekstensi PHP berikut:

- `curl`
- `fileinfo`
- `gd`
- `mbstring`
- `openssl`
- `pdo_mysql`
- `zip`

---

## Langkah Instalasi

1. **Clone repository** ke folder pilihan Anda:

    ```bash
    git clone https://github.com/khamal45/sistem_manajemen_perumahan
    ```

2. **Buka project** di Visual Studio Code.

3. **Aktifkan database** (misal melalui XAMPP).

4. **Ubah nama file** `.env.example` menjadi `.env`:

    ```bash
    mv .env.example .env
    ```

5. **Instal dependensi PHP:**

    ```bash
    composer install
    ```

6. **Instal dependensi JavaScript:**

    ```bash
    npm install
    ```

7. **Jalankan migrasi database:**

    ```bash
    php artisan migrate --seed
    ```

8. **Generate application key:**

    ```bash
    php artisan key:generate
    ```

9. **Jalankan website dalam mode development:**
    ```bash
    composer run dev
    ```

---
