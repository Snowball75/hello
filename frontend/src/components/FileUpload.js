import React, { useState } from 'react';
import '../styles/CompanyDetailsForm.css';

const FileUpload = ({ label, name, onChange }) => {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : ""); // Set filename when a file is selected
        onChange(e);
    };

    return (
        <div>
            <div className="file-upload-container">
                <span className="upload-label">{label}</span>
                <label className="upload-button">
                    <input type="file" name={name} onChange={handleFileChange} />
                    Upload
                </label>
            </div>
            {fileName && <p className="file-name">{fileName}</p>} {/* Show file name below */}
        </div>
    );
};

export default FileUpload;
