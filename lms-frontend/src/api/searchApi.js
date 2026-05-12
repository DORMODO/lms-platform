import axiosInstance from "./axiosInstance"

export const searchApi = {
  semanticCourseSearch: async (query) => {
    const response = await axiosInstance.post("/nlu/search", { query })
    return response.data
  },
}
