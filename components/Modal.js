"use client";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay with blur */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal container */}
      <div className="relative w-[75%] md:w-[55%] max-h-[85%] overflow-auto rounded-lg p-8 z-10" style={{ backgroundColor: "#f9e7f7" }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
