import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const submitCompanyDetails = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submit-company/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("API Response:", response);  // Debugging

        if (response.status === 200) {
            return response.data;  // Return the JSON response properly
        } else {
            console.error("Unexpected API response:", response);
            throw new Error("Unexpected response from the server");
        }
    } catch (error) {
        console.error("Request error:", error);
        throw error;  // Ensure the error is propagated properly
    }
};

export const submitDirectorsData = async (formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/submit-directors/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting director data:", error);
        throw error;
    }
};

export const submitShareHoldersData = async (formData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/submit-shareholders/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting director data:", error);
        throw error;
    }
};

export const submitCapitalData = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submit-paid-up/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error submitting data:", error);
        throw error;
    }
};


