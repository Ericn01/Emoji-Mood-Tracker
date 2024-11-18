export class ModalManager {
    constructor() {
        this.activeModal = null;
    }

    closeActiveModal() {
        if (this.activeModal) {
            const modalOverlay = this.activeModal.querySelector('.modal-overlay');
            modalOverlay.classList.add('closing');
            setTimeout(() => {
                this.activeModal.remove();
                this.activeModal = null;
            }, 300);
        }
    }

    showModal(modalHTML, onSave = null) {
        // Close any existing modal first
        this.closeActiveModal();

        // Create and append the new modal
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        this.activeModal = modalContainer;

        // Set up event listeners
        const modalOverlay = modalContainer.querySelector('.modal-overlay');
        const closeBtn = modalContainer.querySelector('.modal-close');
        const cancelBtn = modalContainer.querySelector('.cancel-btn');
        const saveBtn = modalContainer.querySelector('.save-btn');
        const confirmDeleteBtn = modalContainer.querySelector('.confirm-delete-btn');

        const closeModal = () => this.closeActiveModal();

        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) closeModal();
        });
        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);

        if (saveBtn && onSave) {
            saveBtn.addEventListener('click', () => {
                onSave();
                closeModal();
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                onSave?.();
                closeModal();
            });
        }

        return modalContainer;
    }
}

