import { AXIOS } from './Axios';

export async function signin(credentials) {
  const { email, password, name, role } = credentials;
  const post = new FormData();
  post.append('name', name);
  post.append('email', email);
  post.append('password', password);
  post.append('role', role);
  credentials.telephone && post.append('telephone', credentials.telephone);
  credentials.address && post.append('address', credentials.address);
  credentials.city && post.append('city', credentials.city.toLowerCase());
  return await AXIOS.post(`/user/signin`, post);
}

export async function login(credentials) {
  const { email, password } = credentials;
  const post = new FormData();
  post.append('email', email);
  post.append('password', password);
  return await AXIOS.post(`/user/login`, post);
}

export async function logout() {
  return await AXIOS.get(`/user/logout`);
}
