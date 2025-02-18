import React, { useState } from "react";
import { submitShareHoldersData } from "../api/api";
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CompanyDetailsForm.css';
import FileUpload from './FileUpload';

const ShareholdersForm = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const company_id = params.get("company_id");
    const navigate = useNavigate();
    const [noOfShareholders, setnoOfShareholders] = useState(0);
    const [selectedShareholder, setSelectedShareholder] = useState(0);
    const [shareholders, setShareholders] = useState([]);
    const [submittedShareholders, setSubmittedShareholders] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of file fields that need to be cleared between shareholders
    const fileFields = [
        "pan_card_file",
        "proof_address_file",
        "bank_statement_file",
        "board_resolution"
    ];

    const getEmptyShareholderObject = () => ({
        company: company_id || "",
        type_of_shareholder: "individual",
        shareholder_first_name: "",
        shareholder_last_name: "",
        entity_name: "",
        cin_number: "",
        authorised_representative: "",
        email: "",
        phone_number: "",
        percentage_of_holding: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        pan_card_file: null,
        proof_address: "",
        proof_address_file: null,
        bank_statement_file: null,
        board_resolution: null
    });

    const handlenoOfShareholdersChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setnoOfShareholders(count);
        setShareholders(
            Array.from({ length: count }, () => getEmptyShareholderObject())
        );
        setSelectedShareholder(0);
        setSubmittedShareholders(new Set());
    };

    const handleShareholderChange = (index, field, value) => {
        const updatedShareholders = [...shareholders];
        updatedShareholders[index] = {
            ...updatedShareholders[index],
            [field]: value
        };
        setShareholders(updatedShareholders);
    };

    const handleFileChange = (index, field, file) => {
        const updatedShareholders = [...shareholders];
        updatedShareholders[index] = {
            ...updatedShareholders[index],
            [field]: file
        };
        setShareholders(updatedShareholders);
    };

    const clearFileFields = (shareholderIndex) => {
        const updatedShareholders = [...shareholders];
        fileFields.forEach(field => {
            if (updatedShareholders[shareholderIndex]) {
                updatedShareholders[shareholderIndex][field] = null;
            }
        });
        setShareholders(updatedShareholders);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            Object.entries(shareholders[selectedShareholder]).forEach(([key, value]) => {
                if (fileFields.includes(key) && value instanceof File) {
                    formData.append(key, value); // Append files correctly
                } else if (fileFields.includes(key) && !value) {
                    console.warn(`Skipping empty file field: ${key}`);
                } else if (key === "percentage_of_holding") {
                    formData.append(key, Number(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            await submitShareHoldersData(formData);
            setSubmittedShareholders(prev => new Set([...prev, selectedShareholder]));

            if (submittedShareholders.size + 1 === noOfShareholders) {
                navigate(`/capital-form?company_id=${company_id}`);
            } else {
                const nextShareholder = selectedShareholder + 1;
                if (nextShareholder < noOfShareholders) {
                    clearFileFields(nextShareholder);
                    setSelectedShareholder(nextShareholder);
                }
            }

            alert(`Shareholder ${selectedShareholder + 1} information saved successfully!`);
        } catch (error) {
            console.error("Error saving shareholder:", error);
            alert(`Failed to save shareholder ${selectedShareholder + 1}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShareholderSelect = (index) => {
        // Clear file fields when switching to a new shareholder
        if (!submittedShareholders.has(index)) {
            clearFileFields(index);
        }
        setSelectedShareholder(index);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
            <h2>Shareholders Information</h2>

            <label>Number of Shareholders:</label>
            <input 
                type="number" 
                min="1" 
                value={noOfShareholders} 
                onChange={handlenoOfShareholdersChange} 
            />

            {noOfShareholders > 0 && (
                <div className="directors-heading">
                    {Array.from({ length: noOfShareholders }).map((_, index) => (
                        <p
                            key={index}
                            className={`director-name ${selectedShareholder === index ? "active" : ""} ${submittedShareholders.has(index) ? "submitted" : ""}`}
                            onClick={() => handleShareholderSelect(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            Shareholder {index + 1} 
                            {submittedShareholders.has(index) && " ✓"}
                        </p>
                    ))}
                </div>
            )}
            {noOfShareholders > 0 && (
                <form onSubmit={handleSubmit} style={{ marginTop: "30px", padding: "50px", border: "1px solid black" }}>
                    {shareholders.length > 0 && (
                        <div key={shareholders[selectedShareholder].id}>
                            <h3>Shareholder {selectedShareholder + 1} Information</h3>
                            <div className="city-containers">
                                <div>
                                    <label>Type Of Shareholder :</label>
                                    <select
                                        value={shareholders[selectedShareholder].type_of_shareholder} name="type_of_shareholder" id="type_of_shareholder" onChange={(e) => handleShareholderChange(selectedShareholder, "type_of_shareholder", e.target.value)} required>
                                        <option value="individual">Individual</option>
                                        <option value="company">Company</option>
                                    </select>
                                </div>
                            </div>
                                
                                {shareholders[selectedShareholder].type_of_shareholder === "individual" && (
                                    <div className="city-containers">
                                    <label>Name of Shareholder :</label>

                                    <input
                                        type="text"
                                        placeholder="First Name :"
                                        value={shareholders[selectedShareholder].shareholder_first_name}
                                        onChange={(e) => handleShareholderChange(selectedShareholder, "shareholder_first_name", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name :"
                                        value={shareholders[selectedShareholder].shareholder_last_name}
                                        onChange={(e) => handleShareholderChange(selectedShareholder, "shareholder_last_name", e.target.value)}
                                    />
                                </div>
                                )}
                                {shareholders[selectedShareholder].type_of_shareholder === "company" && (
                                    <div>
                                        <label>Entity Name :</label>
                                    <input
                                        type="text"
                                        placeholder="Entity Name"
                                        value={shareholders[selectedShareholder].entity_name}
                                        onChange={(e) => handleShareholderChange(selectedShareholder, "entity_name", e.target.value)}
                                    />
                                    <label>CIN Number :</label>
                                    <input
                                        type="text"
                                        placeholder="CIN Number"
                                        value={shareholders[selectedShareholder].cin_number}
                                        onChange={(e) => handleShareholderChange(selectedShareholder, "cin_number", e.target.value)}
                                    />
                                    <label>Authorised Representative :</label>
                                    <input
                                        type="text"
                                        placeholder="Authorised Representative"
                                        value={shareholders[selectedShareholder].authorised_representative}
                                        onChange={(e) => handleShareholderChange(selectedShareholder, "authorised_representative", e.target.value)}
                                    />
                            </div>
                                )}
                            <div>
                                <label>contact email</label>
                                <input placeholder="Email" type="email"
                                    value={shareholders[selectedShareholder].email}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "email", e.target.value)}/>
                                <label>Mobile number</label>
                                <input placeholder="Phone Number"
                                    value={shareholders[selectedShareholder].phone_number}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "phone_number", e.target.value)}/>
                                <label>% of Holding :</label>
                                <input
                                    type="number"
                                    placeholder="Percentage of holdings"
                                    value={shareholders[selectedShareholder].percentage_of_holdings}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "percentage_of_holdings", e.target.value)}
                                />
                            </div>
                            <label>Register Office Address:</label>
                            <div className="address-container">
                                <input placeholder="Address Line-1"
                                    value={shareholders[selectedShareholder].address1}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "address1", e.target.value)}/>
                            </div>
                            <div className="address-container">
                                <input placeholder="Address Line-2"
                                    value={shareholders[selectedShareholder].address2}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "address2", e.target.value)}/>
                            </div>
                            <div className="city-container">
                                <input placeholder="City"
                                    value={shareholders[selectedShareholder].city}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "city", e.target.value)}/>
                                <input placeholder="State"
                                    value={shareholders[selectedShareholder].state}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "state", e.target.value)}/>
                                <input placeholder="Pincode"
                                    value={shareholders[selectedShareholder].pincode}
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "pincode", e.target.value)}/>
                            </div>
                            <div>
                                <FileUpload
                                    key={`pan_${selectedShareholder}`}
                                    label = "Pan"
                                    name="pan_card_file"
                                    value = {shareholders[selectedShareholder]?.pan_card_file}
                                    onChange={(e) => handleFileChange(selectedShareholder,"pan_card_file", e.target.files[0])}
                                />
                            </div>
                            <div>
                                <select 
                                    value={shareholders[selectedShareholder].proof_address} 
                                    name="proof_address" 
                                    id="proof_address" 
                                    onChange={(e) => handleShareholderChange(selectedShareholder, "proof_address", e.target.value)}
                                >
                                    <option value="">Select Proof of Address</option>
                                    <option value="aadhar card">Aadhar Card</option>
                                    <option value="voter id">Voter ID</option>
                                    <option value="passport">Passport</option>
                                    <option value="driving license">Driving License</option>
                                    <option value="utility bill">Utility Bill</option>
                                </select>
                            </div>
                            <div>
                                <FileUpload
                                    key={`proof_address_${selectedShareholder}`} 
                                    label={`Upload ${shareholders[selectedShareholder].proof_address}`}
                                    name="proof_address_file"
                                    value = {shareholders[selectedShareholder]?.proof_address_file}
                                    onChange={(e) => handleFileChange(selectedShareholder,"proof_address_file", e.target.files[0])}
                                />
                            </div>
                            <div>
                                <FileUpload
                                    key={`pan_${selectedShareholder}`}
                                    label = "Bank Statement"
                                    name="bank_statement_file"
                                    value = {shareholders[selectedShareholder]?.bank_statement_file}
                                    onChange={(e) => handleFileChange(selectedShareholder,"bank_statement_file", e.target.files[0])}
                                />
                            </div>
                            {shareholders[selectedShareholder].type_of_shareholder === "company" && (
                                <div>
                                    <FileUpload
                                        key={`pan_${selectedShareholder}`}
                                        label = "Board Resolution"
                                        accept=".pdf,.doc,.docx"  
                                        name="board_resolution"
                                        value = {shareholders[selectedShareholder]?.board_resolution}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleFileChange(selectedShareholder, "board_resolution", file);
                                            }
                                        }}
                                        required={shareholders[selectedShareholder].type_of_shareholder === "company"}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        style={{ marginTop: "20px", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    )
};

export default ShareholdersForm;