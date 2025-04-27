import axiosInstance from "../authComponent/axiosConnection";

export const getChatResponse = async (message) => {
  try {
    const response = await axiosInstance.post("/chat", {
      message,
      latestReply: "",
      messageSummary: "",
    });
    return response.data;
  } catch (error) {
    console.error("Error in chat service:", error);
    throw error;
  }
};
