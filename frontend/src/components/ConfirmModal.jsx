import React, { useEffect } from "react";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning", // warning, danger, success, info
    showCancel = true
}) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Icon and color based on type
    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    icon: (
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    iconBg: "bg-red-100",
                    iconColor: "text-red-600",
                    buttonClass: "btn-danger"
                };
            case "success":
                return {
                    icon: (
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    iconBg: "bg-green-100",
                    iconColor: "text-green-600",
                    buttonClass: "btn-success"
                };
            case "info":
                return {
                    icon: (
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600",
                    buttonClass: "btn-primary"
                };
            default: // warning
                return {
                    icon: (
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    iconBg: "bg-orange-100",
                    iconColor: "text-orange-600",
                    buttonClass: "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
                {/* Icon */}
                <div className="flex justify-center pt-8 pb-4">
                    <div className={`${styles.iconBg} ${styles.iconColor} p-4 rounded-full`}>
                        {styles.icon}
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-6 text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {title}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="bg-slate-50 px-6 py-4 rounded-b-2xl flex gap-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-all"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3 rounded-lg transition-all ${styles.buttonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
