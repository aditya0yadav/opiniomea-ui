const axios = require('axios');

class ProfileAPIHandler {
    constructor() {
        this.baseURL = 'https://api.qmapi.com/api/profile';
    }

    // Function to format user data according to API requirements
    formatUserData(userProfile) {
        return {
            email: userProfile.email,
            password: userProfile.password,
            profile: {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                phoneNumber: userProfile.phoneNumber,
                address: userProfile.address,
                city: userProfile.city,
                state: userProfile.state,
                country: userProfile.country,
                postalCode: userProfile.postalCode,
                dateOfBirth: userProfile.dateOfBirth,
                gender: userProfile.gender,
                point: userProfile.point || 0
            }
        };
    }

    // Create new profile
    async createProfile(userData) {
        try {
            const formattedData = this.formatUserData(userData);
            const response = await axios.post(this.baseURL, formattedData);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create profile: ${error.message}`);
        }
    }

    // Update existing profile
    async updateProfile(userId, userData) {
        try {
            const formattedData = this.formatUserData(userData);
            const response = await axios.put(`${this.baseURL}/${userId}`, formattedData);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    // Get profile by ID
    async getProfile(userId) {
        try {
            const response = await axios.get(`${this.baseURL}/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch profile: ${error.message}`);
        }
    }

    // Delete profile
    async deleteProfile(userId) {
        try {
            const response = await axios.delete(`${this.baseURL}/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to delete profile: ${error.message}`);
        }
    }
}

// const apiHandler = new ProfileAPIHandler();

// const createNewProfile = async (userData) => {
//     try {
//         const result = await apiHandler.createProfile(userData);
//         console.log('Profile created:', result);
//     } catch (error) {
//         console.error(error);
//     }
// };

// const updateExistingProfile = async (userId, userData) => {
//     try {
//         const result = await apiHandler.updateProfile(userId, userData);
//         console.log('Profile updated:', result);
//     } catch (error) {
//         console.error(error);
//     }
// };

// const getProfileData = async (userId) => {
//     try {
//         const profile = await apiHandler.getProfile(userId);
//         console.log('Profile data:', profile);
//     } catch (error) {
//         console.error(error);
//     }
// };

// const deleteExistingProfile = async (userId) => {
//     try {
//         const result = await apiHandler.deleteProfile(userId);
//         console.log('Profile deleted:', result);
//     } catch (error) {
//         console.error(error);
//     }
// };


export default ProfileAPIHandler;