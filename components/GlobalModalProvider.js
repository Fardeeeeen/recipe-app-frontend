// components/GlobalModalProvider.js
"use client";

import { createContext, useContext, useState } from "react";
import Modal from "./Modal";
import PrivacyModalContent from "./PrivacyModalContent";
import TermsModalContent from "./TermsModalContent";

const ModalContext = createContext({
  openModal: (type) => {},
  closeModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export default function GlobalModalProvider({ children }) {
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    console.log("Opening modal of type:", type);
    setModalType(type);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalType(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalType && (
        <Modal onClose={closeModal}>
          {modalType === "privacy" && <PrivacyModalContent />}
          {modalType === "terms" && <TermsModalContent />}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}
