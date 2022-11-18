import axios from "axios";
import { AXIOS } from "./Axios";

export async function getPicture(id) {
  const post = new FormData();
  post.append("id", id);
  return await AXIOS.post(`/user_picture/get_picture`, post);
}

export async function uploadPicture(body) {
  const { id, name, selectedFile, keypass, picture_id } = body;
  const post = new FormData();
  post.append("keypass", keypass);
  post.append("file", selectedFile);
  post.append("name", name);
  post.append("id", id);
  post.append("picture_id", picture_id);

  return await AXIOS.post(`/user_picture/upload_picture`, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getProfile() {
  res = await AXIOS.get(`/user/get_profil`);
  return res.data;
}