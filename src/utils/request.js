import axios from 'axios'
const service = axios.create({
  baseUrl: '/dev',
  timeout:5000,
})
export default service