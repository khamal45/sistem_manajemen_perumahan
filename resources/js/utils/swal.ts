import Swal from 'sweetalert2';

export const confirmDelete = (title = 'Yakin ingin menghapus?') => {
    return Swal.fire({
        title,
        text: 'Data tidak bisa dikembalikan setelah dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    });
};

export const alertSuccess = (message: string, title = 'Berhasil!') => {
    return Swal.fire({
        title,
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
    });
};
