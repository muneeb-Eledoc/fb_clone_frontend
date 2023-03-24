import axios from '../../axios'

export const fetchUser = async (userId) => {
    const res = await axios.get(`/users?userId=${userId}`);
    return res.data;
}
