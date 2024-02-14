import React, { useRef, useEffect } from "react";
import styles from "./ModalNoMatchingUser.module.css";

const Modal = ({ onClose }) => {
  const modalRef = useRef();

  const handleClickInside = (event) => {
    // 모달 내부를 클릭한 경우 이벤트 전파를 중지시킴
    event.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={modalRef} className={styles.modal} onClick={handleClickInside}>
      <div className={styles.modalContent}>
        <span className={styles.noButton} onClick={onClose}>
          &times;
        </span>
        <p>일치하는 사용자가 존재하지 않습니다.</p>
      </div>
    </div>
  );
};

export default Modal;
