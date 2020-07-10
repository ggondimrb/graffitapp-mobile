import axios from 'axios';

const apiGeolocation = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/json?',
});
export default apiGeolocation;
