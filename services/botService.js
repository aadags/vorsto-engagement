
export const getBots = async () => {
    try {
      const response = await fetch('/api/get-bots');
      if (!response.ok) {
        throw new Error('Failed to fetch bots');
      }
      const bots = await response.json();
      return bots;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const getBot = async () => {
    try {
      const response = await fetch('/api/get-bot');
      if (!response.ok) {
        throw new Error('Failed to fetch bots');
      }
      const bot = await response.json();
      return bot;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  