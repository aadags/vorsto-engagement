
export const getTools = async (id) => {
    try {
      const response = await fetch('/api/get-tools?botId='+id);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const bots = await response.json();
      return bots;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  