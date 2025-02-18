import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelectCompanyType.css';

const COMPANY_TYPE_CHOICES = [
    { value: 'private limited', label: 'Private Limited Company' },
    { value: 'sole proprietorship', label: 'Solo Proprietorship' },
    { value: 'llp', label: 'LLP' },
    { value: 'public limited', label: 'Public Limited Company' },
    { value: 'section8', label: 'Section 8 Company' },
    { value: 'one person', label: 'One-Person Company' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'any other', label: 'Any Other' }
];

const SelectCompanyType = () => {
    const [selectedType, setSelectedType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedType) {
            alert("Please select a company type.");
            return;
        }
        navigate(`/form2?company_type=${encodeURIComponent(selectedType)}`);
    };

    return (
        <div className="company-container">
            <h2>Select Company Type</h2>
            <form onSubmit={handleSubmit}>
                <div className="company-grid">
                    {COMPANY_TYPE_CHOICES.map(({ value, label }) => (
                        <div 
                            key={value} 
                            className={`company-card ${selectedType === value ? "selected" : ""}`}
                            onClick={() => setSelectedType(value)}
                        >
                            <input
                                type="radio"
                                value={value}
                                name="company_type"
                                id={value}
                                checked={selectedType === value}
                                onChange={(e) => setSelectedType(e.target.value)}
                            />
                            <span className="company-icon">⚡</span>
                            <br></br>
                            <div className="company-info">
                                <label className="company-label">{label}</label>
                                <p className="company-description">
                                    Cupiditate omnis at veniam atque sint fugiat quia ut. Harum exce.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="continue-button">Save & Continue →</button>
            </form>
        </div>
    );
};

export default SelectCompanyType;
