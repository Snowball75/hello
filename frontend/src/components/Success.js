import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h2 style={{ textAlign: "center" }}>Form Submitted Successfully! ✅</h2>
            <p>Your company details have been added successfully.</p>
            <button onClick={() => navigate("/")}>Go Back to Home</button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        textAlign: "center"
    }
};

export default Success;
