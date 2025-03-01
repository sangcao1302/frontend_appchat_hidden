import React, { useEffect, useState } from "react";

const AutoModal = () => {
    const policyAccepted = localStorage.getItem('policyAccepted') === 'true';

    useEffect(() => {
        // Check if the user has seen the modal before

        if (policyAccepted && !localStorage.getItem("hasSeenChatModal")) {
            localStorage.setItem("hasSeenChatModal", "true"); // Set flag in localStorage
            const modalElement = document.getElementById("autoModal");
            if (modalElement) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    }, [policyAccepted]);

   

    return (
        <div
            className="modal fade"
            id="autoModal"
            tabIndex="-1"
            aria-labelledby="autoModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">Khi tạo ra ứng dụng chat này mục tiêu của chúng tôi là xây dựng một nền tảng giúp kết nối mọi người một cách dễ dàng và hiệu quả, đồng thời đảm bảo rằng mọi người đều cảm thấy được tôn trọng và bảo vệ . Ứng dụng có thể tìm và kết nối bạn với những người phù hợp.               </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoModal;
