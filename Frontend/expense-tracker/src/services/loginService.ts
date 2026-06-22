
export const loginUser = async (
  email: string,
  password: string
 ) => {
  try {
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    return response;
  } catch (error) {
    console.error;
  }
};

export const registerUser = async ( 
  email: string,
  password: string 
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    return response;
  } catch (error) {
    console.error;
  }
};
