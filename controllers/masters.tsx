import axios from "axios";


export default class ApiDataController {
  private header = {
    headers: {
      "Authorization": "",
    },
  };
    

  constructor(token?: string) {
    const formattedToken = token
      ? token.startsWith("Bearer ")
        ? token
        : token.startsWith("SJWT ")
        ? token.replace("SJWT ", "Bearer ")
        : `Bearer ${token}`
      : "";

    this.header = {
      headers: {
        "Authorization": formattedToken,
      },
    };
  }

  GetApi = async (url: any) => {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      throw e;
    }
  };
  GetApiWithToken = async (url: any) => {
    try {
      const { data } = await axios.get(url, this.header);
      return data;
    } catch (e) {
      throw e;
    }
  };

  PostDataApi = async (url: any, value: any) => {
    try {
      const { data } = await axios.post(url, value);
      return data;
    } catch (e) {
      throw e;
    }
  };

  PostApiWithToken = async (url: any, value: any) => {
    try {
      const { data } = await axios.post(url, value, this.header);
      return data;
    } catch (e) {
      throw e;
    }
  };

  PutApiWithToken = async (url: any, value: any) => {
    try {
      const { data } = await axios.put(url, value, this.header);
      return data;
    } catch (e) {
      throw e;
    }
  };

  PatchApiWithToken = async (url: any, value: any) => {
    try {
      const { data } = await axios.patch(url, value, this.header);
      return data;
    } catch (e) {
      throw e;
    }
  };
  DeleteApiWithToken = async (url: any) => {
    try {
      const { data } = await axios.delete(url, this.header);
      return data;
    } catch (e) {
      throw e;
    }
  };
}
