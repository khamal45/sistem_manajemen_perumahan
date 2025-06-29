## 👤 User Akun

| Role                | Email                   | Password   |
| ------------------- | ----------------------- | ---------- |
| **Admin**           | `admin@example.com`     | `password` |
| **Admin Tambang 1** | `tambang1@example.com`  | `password` |
| **Admin Tambang 2** | `tambang2@example.com`  | `password` |
| **Approver 1**      | `approver1@example.com` | `password` |
| **Approver 2**      | `approver2@example.com` | `password` |

> **Catatan:** Semua akun menggunakan password: `password`

## Video Panduan

-   🎥 [Video Instalasi](https://youtu.be/VyTBrNnjTL0)
-   🌐 [Review Website](https://youtu.be/QhfyJIITSBQ)

# Instalasi & Setup Project Laravel

## Prasyarat

Pastikan Anda sudah menginstal:

-   **PHP** versi `8.4.8`
-   **Node.js** versi `v23.10.0`
-   **Database** (contoh: MySQL via XAMPP)
-   **Composer**
-   **VSCode** (opsional, tapi direkomendasikan)

Aktifkan ekstensi PHP berikut:

-   `curl`
-   `fileinfo`
-   `gd`
-   `mbstring`
-   `openssl`
-   `pdo_mysql`
-   `zip`

## Langkah Instalasi

1. Clone repository ini ke folder yang Anda inginkan:

    ```bash
    git clone https://github.com/khamal45/test-sekawan-media
    ```

2. Buka project di Visual Studio Code.

3. Aktifkan database Anda (misalnya melalui XAMPP).

4. Ubah nama file `.env.example` menjadi `.env`:

    ```bash
    mv .env.example .env
    ```

5. Jalankan perintah berikut untuk menginstal dependensi PHP:

    ```bash
    composer install
    ```

6. Instal dependensi JavaScript:

    ```bash
    npm install
    ```

7. Jalankan migrasi database:

    ```bash
    php artisan migrate
    ```

8. Seed data awal:

    ```bash
    php artisan db:seed
    ```

9. Generate application key:

    ```bash
    php artisan key:generate
    ```

10. Jalankan website dalam mode development:

```bash
composer run dev
```

---
