import React, { useEffect, useState } from "react";
import axios from "axios";
import EditModal from "./EditModal";

const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/company/");
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const handleEdit = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = async (companyId) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/company/${companyId}/`);
                fetchCompanies();
            } catch (error) {
                console.error("Error deleting company:", error);
            }
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold my-4">Company Data</h2>
            <table className="w-full border-collapse border border-black">
    <thead>
        <tr className="bg-gray-200 border border-black">
            <th className="border border-black p-2">ID</th>
            <th className="border border-black p-2">Type of Company</th>
            <th className="border border-black p-2">Proposed Name</th>
            <th className="border border-black p-2">Actions</th>
        </tr>
    </thead>
    <tbody>
        {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-100 border border-black">
                <td className="border border-black p-2">{company.id}</td>
                <td className="border border-black p-2 cursor-pointer" onClick={() => handleEdit(company)}>{company.company_type}</td>
                <td className="border border-black p-2 cursor-pointer" onClick={() => handleEdit(company)}>{company.proposed_company_name1}</td>
                <td className="border border-black p-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEdit(company)}>Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(company.id)}>Delete</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>


            {isModalOpen && selectedCompany && <EditModal company={selectedCompany} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default CompanyTable;
