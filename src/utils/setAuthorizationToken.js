/**
 * Created by Home PC on 15.06.2017.
 */
import axios from 'axios';

export default function setAuthorizationToken(token) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}