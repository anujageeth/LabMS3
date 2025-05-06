import React from 'react'

function DeleteModel({ selectedEquipment, showDeleteModal, setShowDeleteModal, onDelete }) {

    const closeModal = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteItem = () => {
        if (selectedEquipment) {
        onDelete();
        }
    };

    return (
        <div>
            {showDeleteModal && (
                <div>
                    <div className="overlay"></div>
                    <div className="loginBox" id="deleteModal">
                        <h3>Are you sure to delete?</h3><br/>
                        <button onClick={handleDeleteItem} className="loginBtn" id="saveCatBtn">Yes</button>
                        <button onClick={closeModal} className="loginBtn" id="cancelCatBtn">No</button>
                    </div>
                </div>
            )}
        </div>
    )
    }

export default DeleteModel