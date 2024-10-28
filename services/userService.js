

  export const getUser = async (id) => {
    try {
      const response = await fetch('/api/get-user-details');
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      const user = await response.json();
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  