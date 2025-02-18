import React, { useState } from "react";
import axios from "axios";

const EditModal = ({ company, onClose }) => {
    const [formData, setFormData] = useState(company);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/company/${formData.id}/`, formData);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/2">
                <h3 className="text-lg font-bold">Edit Company</h3>
                <input type="text" name="company_type" value={formData.company_type} onChange={handleChange} className="border p-2 w-full my-2" />
                <input type="text" name="proposed_company_name1" value={formData.proposed_company_name1} onChange={handleChange} className="border p-2 w-full my-2" />
                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </div>
    );
};

export default EditModal;
