import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTable.css";
// import Success from "./Success.js";

const AdminTable = () => {
    const [data, setData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/company-data/");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Handle Edit Button Click (Open Popup)
    const handleEdit = (company) => {
        setSelectedCompany(company);
        setEditData(company);
    };

    // Handle Change in Input Fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            company: {
                ...prev.company,
                [name]: value,
            },
        }));
    };

    // Save Edited Data
    const handleSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/company-data/company.id}/`, editData.company);
            setSelectedCompany(null);
            fetchData(); // Refresh Data
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    // Delete Record
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/company-data/${id}/`);
            fetchData(); // Refresh Data
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
            <div className="table-container">
    <table className="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Type of Company</th>
                <th>Proposed Name 1</th>
                <th>Proposed Name 2</th>
                <th>Proposed Name 3</th>
                <th>Director Name</th>
                <th>Shareholder Name</th>
                <th>Capital Details</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {data.map((companyData) => (
                <tr key={companyData.company.id}>
                    <td>{companyData.company.id}</td>
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>{companyData.company.company_type}</td>
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>{companyData.company.proposed_company_name1}</td>
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>{companyData.company.proposed_company_name2}</td>
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>{companyData.company.proposed_company_name3}</td>
                    
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>
                       <a href="success.js">{companyData.directors}</a>
                        {/* {companyData.directors.length > 0 ? companyData.directors[0].director_last_name : "-"} */}
                    </td>
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>
                            {companyData.shareholders}
                    </td>
                    <td className="cursor-pointer" onClick={() => handleEdit(companyData)}>
                        {companyData.capital.length > 0 ? companyData.capital[0].authorised_share_capital : "-"}
                    </td>
                    <td>
                        <button className="button button-edit" onClick={() => handleEdit(companyData)}>Edit</button>
                        <button className="button button-delete" onClick={() => handleDelete(companyData.company.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


            {/* Edit Popup Modal */}
            {selectedCompany && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Edit Company Details</h2>
                        <label className="block mb-2">Type of Company:</label>
                        <input type="text" name="company_type" value={editData.company.company_type} onChange={handleChange} className="border p-2 w-full mb-3" />

                        <label className="block mb-2">Proposed Name:</label>
                        <input type="text" name="proposed_company_name1" value={editData.company.proposed_company_name1} onChange={handleChange} className="border p-2 w-full mb-3" />

                        <div className="flex justify-end">
                            <button className="bg-gray-500 text-white px-3 py-1 rounded mr-2" onClick={() => setSelectedCompany(null)}>Cancel</button>
                            <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
