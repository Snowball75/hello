import React, { useState } from "react";
import { submitDirectorsData } from "../api/api";
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CompanyDetailsForm.css';
import FileUpload from './FileUpload';

const DirectorsForm = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const company_id = params.get("company_id");
    const navigate = useNavigate();
    const [noOfDirectors, setNoOfDirectors] = useState(0);
    const [selectedDirector, setSelectedDirector] = useState(0);
    const [directors, setDirectors] = useState([]);
    const [submittedDirectors, setSubmittedDirectors] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of file fields that need to be cleared between directors
    const fileFields = [
        "proof_address_file",
        "pan_number_file",
        "aadhar_card_file",
        "passport_size_photo"
    ];

    const getEmptyDirectorObject = () => ({
        company: company_id || "",
        director_first_name: "",
        director_middle_name: "",
        director_last_name: "",
        father_first_name: "",
        father_middle_name: "",
        father_last_name: "",
        gender: "male",
        date_of_birth: "",
        nationality: "",
        education: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        proof_address: "",
        proof_address_file: null,
        email: "",
        phone_number: "",
        pan_number: "",
        pan_number_file: null,
        aadhar_card_number: "",
        aadhar_card_file: null,
        din: "no",
        din_number: "",
        details_of_existing_directorships: "no",
        existing_company_name: "",
        existing_cin: "",
        existing_type_of_company: "",
        existing_position_herd: "",
        existing_date: "",
        passport_size_photo: null,
        dsc: "no",
        role_in_the_company: "",
        director_also_shareholder: "no",
        no_of_shares: "",
        percentage_of_holdings: "",
        paid_up_cash_contribution: ""
    });

    const handleNoOfDirectorsChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setNoOfDirectors(count);
        setDirectors(
            Array.from({ length: count }, () => getEmptyDirectorObject())
        );
        setSelectedDirector(0);
        setSubmittedDirectors(new Set());
    };

    const handleDirectorChange = (index, field, value) => {
        const updatedDirectors = [...directors];
        updatedDirectors[index] = {
            ...updatedDirectors[index],
            [field]: value
        };
        setDirectors(updatedDirectors);
    };

    const handleFileChange = (index, field, file) => {
        const updatedDirectors = [...directors];
        updatedDirectors[index] = {
            ...updatedDirectors[index],
            [field]: file
        };
        setDirectors(updatedDirectors);
    };

    const clearFileFields = (directorIndex) => {
        const updatedDirectors = [...directors];
        fileFields.forEach(field => {
            if (updatedDirectors[directorIndex]) {
                updatedDirectors[directorIndex][field] = null;
            }
        });
        setDirectors(updatedDirectors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            Object.entries(directors[selectedDirector]).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            });

            await submitDirectorsData(formData);
            setSubmittedDirectors(prev => new Set([...prev, selectedDirector]));

            if (submittedDirectors.size + 1 === noOfDirectors) {
                navigate(`/shareholders-form?company_id=${company_id}`);
            } else {
                const nextDirector = selectedDirector + 1;
                if (nextDirector < noOfDirectors) {
                    // Clear file fields for the next director
                    clearFileFields(nextDirector);
                    setSelectedDirector(nextDirector);
                }
            }

            alert(`Director ${selectedDirector + 1} information saved successfully!`);
        } catch (error) {
            console.error("Error saving director:", error);
            alert(`Failed to save director ${selectedDirector + 1}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDirectorSelect = (index) => {
        // Clear file fields when switching to a new director
        if (!submittedDirectors.has(index)) {
            clearFileFields(index);
        }
        setSelectedDirector(index);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
            <h2>Directors Information</h2>

            <label>Number of Directors:</label>
            <input 
                type="number" 
                min="1" 
                value={noOfDirectors} 
                onChange={handleNoOfDirectorsChange} 
            />

            {noOfDirectors > 0 && (
                <div className="directors-heading">
                    {Array.from({ length: noOfDirectors }).map((_, index) => (
                        <p
                            key={index}
                            className={`director-name ${selectedDirector === index ? "active" : ""} ${submittedDirectors.has(index) ? "submitted" : ""}`}
                            onClick={() => handleDirectorSelect(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            Director {index + 1} 
                            {submittedDirectors.has(index) && " ✓"}
                        </p>
                    ))}
                </div>
            )}
            {/* Director Input Fields (Only Show Selected Director) */}
            {noOfDirectors > 0 && (
                <form onSubmit={handleSubmit} style={{ marginTop: "30px", padding: "50px", border: "1px solid black" }}>
                    {directors.length > 0 && (
                        <div key={directors[selectedDirector].id}>
                            <h3>Director {selectedDirector + 1} Information</h3>
                            <label>Name of Director</label>
                            <div className="city-container">
                                
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={directors[selectedDirector].director_first_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "director_first_name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Middle Name"
                                    value={directors[selectedDirector].director_middle_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "director_middle_name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={directors[selectedDirector].director_last_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "director_last_name", e.target.value)}
                                />
                            </div>
                            <label>Father</label>
                            <div className="city-container">
                                
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={directors[selectedDirector].father_first_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "father_first_name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Middle Name"
                                    value={directors[selectedDirector].father_middle_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "father_middle_name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={directors[selectedDirector].father_last_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "father_last_name", e.target.value)}
                                />
                            </div>
                            <div className="business-containerr">
                                <div>
                                    <label>Gender :</label>
                                    <select
                                        value={directors[selectedDirector].gender} name="gender" id="gender" onChange={(e) => handleDirectorChange(selectedDirector, "gender", e.target.value)} required>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Date of Birth:</label>
                                    <input
                                        type="date"
                                        value={directors[selectedDirector].date_of_birth}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "date_of_birth", e.target.value)}
                                        max={new Date().toISOString().split("T")[0]} // Prevents future dates
                                        required
                                    />
                                </div>
                            </div>
                            <div className="business-containerr">
                                <div>
                                    <label>Nationality :</label>
                                    <select
                                        value={directors[selectedDirector].nationality} name="nationality" id="nationality" onChange={(e) => handleDirectorChange(selectedDirector, "nationality", e.target.value)} required>
                                            <option value="">Select Nationality</option>
                                            <option value="indian">Indian</option>
                                            <option value="not a indian">Not a Indian</option>
                                    </select>
                                </div>
                                <div>
                                     <label>Education Qualification:</label>
                                    <select value={directors[selectedDirector].education} name="education" id="education" onChange={(e) => handleDirectorChange(selectedDirector, "education", e.target.value)}>
                                        <option value="">Select Qualification</option>
                                        <option value="no formal education">No Formal Education</option>
                                        <option value="primary education">Primary Education</option>
                                        <option value="secondary education">Secondary Education</option>
                                        <option value="bachelor degree">Bachelor Degree</option>
                                        <option value="master degree">Master Degree</option>
                                        <option value="high education">High Education</option>
                                    </select>
                                </div>
                            </div>
                            <label>Register Office Address:</label>
                            <div className="address-container">
                                <input placeholder="Address Line-1"
                                    value={directors[selectedDirector].address1}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "address1", e.target.value)}/>
                            </div>
                            <div className="address-container">
                                <input placeholder="Address Line-2"
                                    value={directors[selectedDirector].address2}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "address2", e.target.value)}/>
                            </div>
                            <div className="city-container">
                                <input placeholder="City"
                                    value={directors[selectedDirector].city}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "city", e.target.value)}/>
                                <input placeholder="State"
                                    value={directors[selectedDirector].state}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "state", e.target.value)}/>
                                <input placeholder="Pincode"
                                    value={directors[selectedDirector].pincode}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "pincode", e.target.value)}/>
                            </div>
                            <div>
                                <select 
                                    value={directors[selectedDirector].proof_address} 
                                    name="proof_address" 
                                    id="proof_address" 
                                    onChange={(e) => handleDirectorChange(selectedDirector, "proof_address", e.target.value)}
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
                                    key={`proof_address_${selectedDirector}`} 
                                    label={`Upload ${directors[selectedDirector].proof_address}`}
                                    name="proof_address_file"
                                    value = {directors[selectedDirector]?.proof_address_file}
                                    onChange={(e) => handleFileChange(selectedDirector,"proof_address_file", e.target.files[0])}
                                />
                            </div>
                            <label>Contact Information:</label>
                            <div>
                                <input placeholder="Email" type="email"
                                    value={directors[selectedDirector].email}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "email", e.target.value)}/>
                                <input placeholder="Phone Number"
                                    value={directors[selectedDirector].phone_number}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "phone_number", e.target.value)}/>
                            </div>
                            <div>
                                <input placeholder="Pan Number" 
                                    value={directors[selectedDirector].pan_number}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "pan_number", e.target.value)}/>
                            </div>
                            <div>
                                <FileUpload
                                    key={`pan_${selectedDirector}`}
                                    label = "Upload Pan Card"
                                    name="pan_number_file"
                                    value = {directors[selectedDirector]?.pan_number_file}
                                    onChange={(e) => handleFileChange(selectedDirector,"pan_number_file", e.target.files[0])}
                                />
                            </div>
                            <div>
                                 <input placeholder="Aadhar"
                                    value={directors[selectedDirector].aadhar_card_number}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "aadhar_card_number", e.target.value)}/>    
                            </div>
                            <div>
                                <FileUpload
                                    key={`aadhar_${selectedDirector}`} 
                                    label = "Upload Aadhar Card"
                                    name="aadhar_card_file"
                                    value = {directors[selectedDirector]?.aadhar_card_file}
                                    onChange={(e) => handleFileChange(selectedDirector,"aadhar_card_file", e.target.files[0])}
                                />
                            </div>
                            <label>DIN:</label>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name={`din_${selectedDirector}`}
                                        value="yes"
                                        checked={directors[selectedDirector].din === "yes"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "din", e.target.value)}
                                    /> Yes
                                    <input
                                        type="radio"
                                        name={`din_${selectedDirector}`}
                                        value="no"
                                        checked={directors[selectedDirector].din === "no"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "din", e.target.value)}
                                    /> No
                                </label>
                            </div>

                            {/* Show DIN Number Input if "Yes" is selected */}
                            {directors[selectedDirector].din === "yes" && (
                                <input
                                    type="text"
                                    placeholder="DIN Number"
                                    value={directors[selectedDirector].din_number}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "din_number", e.target.value)}
                                />
                            )}

                            <label>Details of Existing Directorship:</label>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name={`existing_directorship_${selectedDirector}`}
                                        value="yes"
                                        checked={directors[selectedDirector].details_of_existing_directorships === "yes"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "details_of_existing_directorships", e.target.value)}
                                    /> Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`existing_directorship_${selectedDirector}`}
                                        value="no"
                                        checked={directors[selectedDirector].details_of_existing_directorships === "no"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "details_of_existing_directorships", e.target.value)}
                                    /> No
                                </label>
                            </div>

                            {/* Show Input for Existing Directorship Details if "Yes" is selected */}
                            {directors[selectedDirector].details_of_existing_directorships === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Enter Company name"
                                    value={directors[selectedDirector].existing_company_name}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "existing_company_name", e.target.value)}
                                />
                            )}
                            {directors[selectedDirector].details_of_existing_directorships === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Enter CIN"
                                    value={directors[selectedDirector].existing_cin}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "existing_cin", e.target.value)}
                                />
                            )}
                            {directors[selectedDirector].details_of_existing_directorships === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Type of Company"
                                    value={directors[selectedDirector].existing_type_of_company}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "existing_type_of_company", e.target.value)}
                                />
                            )}
                            {directors[selectedDirector].details_of_existing_directorships === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Position Herd"
                                    value={directors[selectedDirector].existing_position_herd}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "existing_position_herd", e.target.value)}
                                />
                            )}
                            {directors[selectedDirector].details_of_existing_directorships === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Date of"
                                    value={directors[selectedDirector].existing_date}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "existing_date", e.target.value)}
                                />
                            )}
                            <label>Passport Size Photo</label>
                            <div>
                                <FileUpload
                                    key={`photo_${selectedDirector}`} 
                                    label = "Upload Passport Size Photo"
                                    name="passport_size_photo"
                                    value = {directors[selectedDirector]?.passport_size_photo}
                                    onChange={(e) => handleFileChange(selectedDirector,"passport_size_photo", e.target.files[0])}
                                />
                            </div>
                            <label>
                                DSC:
                            </label>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={directors[selectedDirector].dsc === "yes"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "dsc", e.target.value)}
                                    /> Yes
                                    </label>
                                    <label>
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={directors[selectedDirector].dsc === "no"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "dsc", e.target.value)}
                                    /> No
                                </label>
                            </div>
                            <label>Role in the Company</label>
                            <div>
                                 <input placeholder="Role in the Company"
                                    value={directors[selectedDirector].role_in_the_company}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "role_in_the_company", e.target.value)}/>    
                            </div>

                            <label>Share Holding Details</label>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={directors[selectedDirector].director_also_shareholder === "yes"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "director_also_shareholder", e.target.value)}
                                    /> Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={directors[selectedDirector].director_also_shareholder === "no"}
                                        onChange={(e) => handleDirectorChange(selectedDirector, "director_also_shareholder", e.target.value)}
                                    /> No
                                </label>
                            </div>

                            {/* Show Input for Existing Directorship Details if "Yes" is selected */}
                            {directors[selectedDirector].director_also_shareholder === "yes" && (
                                <input
                                    type="text"
                                    placeholder="No of Shares"
                                    value={directors[selectedDirector].no_of_shares}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "no_of_shares", e.target.value)}
                                />
                            )}
                            {directors[selectedDirector].director_also_shareholder === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Percentage of holdings"
                                    value={directors[selectedDirector].percentage_of_holdings}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "percentage_of_holdings", e.target.value)}
                                />
                            )}
                            {directors[selectedDirector].director_also_shareholder === "yes" && (
                                <input
                                    type="text"
                                    placeholder="Paid up cash contribution"
                                    value={directors[selectedDirector].paid_up_cash_contribution}
                                    onChange={(e) => handleDirectorChange(selectedDirector, "paid_up_cash_contribution", e.target.value)}
                                />
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
    );
};

export default DirectorsForm;
