import axios from "axios";
import { SetPosts } from "../redux/postSlice";

const API_URl = "http://localhost:8800";

export const axiosClient = axios.create({
  baseURL: API_URl,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await axiosClient(url, {
      method: method || "GET",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log("Detailed error:", err);
    return { status: err?.success, message: err?.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "social_utopia");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/rajusolanki/image/upload`,
      formData
    );
    return response?.data?.secure_url;
  } catch (error) {
    const err = error.response?.data;
    console.log("Details err", err);
  }
};

export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const response = await axiosClient({
      url: uri || "/posts",
      method: "POST",
      data: data || {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(SetPosts(response?.data?.data));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (token, uri, id) => {
  try {
    const response = await axiosClient({
      url: uri || "posts/like" + id,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (token, id) => {
  try {
    const response = await axiosClient({
      url: "posts/" + id,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;

    const response = await axiosClient({
      url: uri,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User Session expired. Login Again.");
      window.location.replace("/#/login");
    }
    return response?.data?.user;
  } catch (error) {
    console.log(error);
  }
};

export const SendFriendRequest = async (token, id) => {
  try {
    const response = await axiosClient({
      url: "users/friend-request",
      method: "POST",
      data: { requestTo: id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const viewUserProfile = async (token, id) => {
  try {
    const response = await axiosClient({
      url: "users/profile-view",
      method: "POST",
      data: { id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

