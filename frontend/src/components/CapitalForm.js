import React, { useState } from "react";
import { submitCapitalData } from "../api/api";
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/CapitalForm.css';

const CapitalForm = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const company_id = params.get("company_id");
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        company: company_id || "",
        authorised_share_capital: "",
        paid_up_share_capital: "",
        face_value_per_share: "",
        number_of_shares: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (let key in formData) {
                data.append(key, formData[key]);
            }
            const response = await submitCapitalData(data);
            alert("Data submitted successfully!");
            navigate(`/success`);
            console.log(response);
        } catch (error) {
            alert("Submission failed.");
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Authorized & Paid up capital</h2>
            <form onSubmit={handleSubmit} className="capital-form">
                <div className="form-group">
                    <label>Authorised Share Capital</label>
                    <input type="text" name="authorised_share_capital" value={formData.authorised_share_capital} onChange={handleChange} placeholder="Enter Value" />
                </div>
                <div className="form-group">
                    <label>Paid up share Capital</label>
                    <input type="text" name="paid_up_share_capital" value={formData.paid_up_share_capital} onChange={handleChange} placeholder="Enter Value"/>
                </div>
                <div className="form-group">
                    <label>Face value per share</label>
                    <input type="text" name="face_value_per_share" value={formData.face_value_per_share} onChange={handleChange} placeholder="Enter Value"/>
                </div>
                <div className="form-group">
                    <label>No of shares</label>
                    <input type="text" name="number_of_shares" value={formData.number_of_shares} onChange={handleChange} placeholder="Enter Value"/>
                </div>
                <button type="submit" className="submit-btn">Save</button>
            </form>
        </div>
    );
};

export default CapitalForm;
