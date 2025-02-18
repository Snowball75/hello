import React, { useState } from 'react';
import { submitCompanyDetails } from '../api/api';
import { useLocation,useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import '../styles/CompanyDetailsForm.css';


const CompanyDetailsForm = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const companyType = params.get("company_type");
    const [formData, setFormData] = useState({
        company_type: companyType || "", 
        proposed_company_name1: "",
        proposed_company_name2: "",
        proposed_company_name3: "",
        business_objective: "",
        business_activity: "a",
        nic_code: "",
        address1: "",
        address2: "",
        ownership_type: "ownership1",
        city: "",
        state: "",
        pincode: "",
        utility_bill: null,
        noc: null,
        rental_agreement: null,
        property_tax_receipt: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleChange1 = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (let key in formData) {
                data.append(key, formData[key]);
            }
           const response = await submitCompanyDetails(data);            
            if (response && response.company_id) {
                console.log("Company ID received:", response.company_id);
                alert("Company details saved successfully!");
                navigate(`/directors-form?company_id=${response.company_id}`);
            } else {
                console.error("No company_id in response:", response);
                alert("Failed to save company details. Please try again.");
            }
        } catch (error) {
            console.log(JSON.stringify(error))
            console.error("Submission Error:", error);
            alert("Error submitting company details. Please check the console for details.");
        }
    };
    
    
    return (
        <div className="form-container">
            <h2>Company Details</h2>
            <form onSubmit={handleSubmit}>
                <label>Company Type:</label>
                <input type="text" value={companyType} readOnly className="readOnly" />
                <input type="hidden" name="company_type" value={companyType} />

                <label>Proposed Company Names:</label>
                <input type="text" name="proposed_company_name1" onChange={handleChange1} required placeholder="Option-1" />
                <input type="text" name="proposed_company_name2" onChange={handleChange} placeholder="Option-2" />
                <input type="text" name="proposed_company_name3" onChange={handleChange} placeholder="Option-3" />

                <label>Business Objectives:</label>
                <textarea name="business_objective" onChange={handleChange} required placeholder="Describe your business objectives"></textarea>

                <div className="business-container">
                    <div>
                        <label>Business Activity:</label>
                        <select name="business_activity" id="business_activity" onChange={handleChange} required>
                            <option value="a">A</option>
                            <option value="b">B</option>
                            <option value="c">C</option>
                            <option value="d">D</option>
                            <option value="e">E</option>
                        </select>
                    </div>
                    <div>
                        <label>NIC Code:</label>
                        <input type="text" name="nic_code" onChange={handleChange} placeholder="Enter Code" />
                    </div>
                </div>

                <label>Register Office Address:</label>
                <div className="address-container">
                    <input type="text" name="address1" className="address-line" onChange={handleChange} placeholder="Address Line -1" />
                    <select name="ownership_type" id="ownership_type" onChange={handleChange} required>
                        <option value="ownership1">Ownership 1</option>
                        <option value="ownership2">Ownership 2</option>
                        <option value="ownership3">Ownership 3</option>
                    </select>
                </div>
                <input type="text" name="address2" onChange={handleChange} placeholder="Address Line -2" />

                <div className="city-container">
                    <input type="text" name="city" onChange={handleChange} placeholder="City" />
                    <input type="text" name="state" onChange={handleChange} placeholder="State" />
                    <input type="text" name="pincode" onChange={handleChange} placeholder="Pincode" />
                </div>

                <label>Address Proof Upload:</label>
                <FileUpload label="Utility Bill" name="utility_bill" onChange={handleFileChange} />
                <FileUpload label="NOC" name="noc" onChange={handleFileChange} />
                <FileUpload label="Rental Agreement" name="rental_agreement" onChange={handleFileChange} />
                <FileUpload label="Property Tax Receipt" name="property_tax_receipt" onChange={handleFileChange} />

                <button type="submit">Save & Continue →</button>
            </form>
        </div>
    );
};

export default CompanyDetailsForm;
