import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center" onClick={handleBackdropClick}>
            <div className="relative overflow-hidden rounded-md border-2 bg-white p-6 shadow-2xl">
                <button className="absolute -top-1 -right-0 z-50 h-7 w-7 bg-red-500 text-center" onClick={() => onClose()}>
                    x
                </button>
                {children}
            </div>
            <div
                className="fixed top-0 left-0 -z-10 flex h-full w-full items-center justify-center bg-black opacity-30"
                onClick={handleBackdropClick}
            ></div>
        </div>
    );
};

export default CustomModal;
