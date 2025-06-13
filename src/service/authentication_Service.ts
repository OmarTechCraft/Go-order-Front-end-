import api from "../api/api.ts";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/Auth/login", {
    email: email,
    password: password,
  });

  // Return the data directly
  const userData = response.data;

  if (userData && userData.token) {
    localStorage.setItem("token", userData.token);
  }

  if (userData && userData.id) {
    localStorage.setItem("id", userData.id);
  }

  return userData;
};

export const register = async (registerData: {
  email: string;
  password: string;
  Name: string;
  phoneNumber: string;
  gender: string;
  businessAccount: boolean;
  businessName: string;
  globalCategoryId: number;
}) => {
  const response = await api.post("/api/Auth/register", registerData);
  return response.data;
};

// Step 1: Forgot Password - Send email to get reset code
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/api/Auth/ForgetPassword", {
      email: email,
    });
    return response.data;
  } catch (error) {
    console.error("Forgot password API error:", error);
    throw error;
  }
};

// Step 2: Confirm Email by Code - Verify the OTP code and get userId/token
export const confirmEmailByCode = async (code: number) => {
  try {
    const response = await api.post("/api/Auth/ConfirmEmailByCode", {
      code: code,
    });

    // The API should return userId and token for the password reset step
    // If the API doesn't return these, we might need to adjust the implementation
    return response.data;
  } catch (error) {
    console.error("Confirm email by code API error:", error);
    throw error;
  }
};

// Step 3: Password Reset - Reset password with userId, token, and new password
export const resetPassword = async (
  userId: string,
  token: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/api/Auth/PasswordReset", {
      userId: userId,
      token: token,
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Password reset API error:", error);
    throw error;
  }
};

// Additional utility function for resending verification code if needed
export const resendVerificationCode = async () => {
  try {
    const response = await api.post("/api/Auth/ResendVerificationCode");
    return response.data;
  } catch (error) {
    console.error("Resend verification code API error:", error);
    throw error;
  }
};

// Additional utility function for email confirmation via URL if needed
export const confirmEmail = async (userId: string, token: string) => {
  try {
    const response = await api.get("/api/Auth/ConfirmEmail", {
      params: {
        userId: userId,
        token: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Confirm email API error:", error);
    throw error;
  }
};
