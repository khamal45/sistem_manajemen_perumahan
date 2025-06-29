## 🚪 Login

Masuk ke aplikasi dengan kredensial berikut:

- **Email:** `admin@gmail.com`
- **Password:** `root`

---

## 🛠️ Spesifikasi Versi

- **PHP:** `8.4.8`
- **Node.js:** `v23.10.0`

---

## 📋 Prasyarat

Pastikan Anda telah menginstal:

- **Database** (misal: MySQL via XAMPP)
- **Composer**
- **VSCode** (opsional, tapi direkomendasikan)

Aktifkan ekstensi PHP berikut:

- `curl`
- `fileinfo`
- `gd`
- `mbstring`
- `openssl`
- `pdo_mysql`
- `zip`

---

## 🚀 Langkah Instalasi

1. **Clone repository** ke folder pilihan Anda:

    ```bash
    git clone https://github.com/khamal45/sistem_manajemen_perumahan
    ```

2. **Masuk ke direktori project:**

    ```bash
    cd sistem_manajemen_perumahan
    ```

3. **Aktifkan database** (misal melalui XAMPP).

4. **Salin file konfigurasi:**

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

7. **Migrasi & seed database:**

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
