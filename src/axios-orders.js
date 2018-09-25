import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://react-burger-7e9e5.firebaseio.com/'
});

export default instance;