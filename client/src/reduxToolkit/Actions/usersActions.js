import axios from "axios";
import { 
    getUsersId,
    getProfile,
    getPaymentId
 } from "../ReducerSlices/UserSlice";



export const getUserProfile = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`https://artisup.up.railway.app/users/profile`,{
            headers:{ Authorization :`Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}`}
        });
        dispatch(getProfile(data.data));
    } catch (error) {
        console.log(error);
    }
};

export const getUserPayment = () => async (dispatch) => {
    try {
        const id = JSON.parse(window.localStorage.getItem('cart'))
        // console.log(id);
        const { data } = await axios.get(`https://artisup.up.railway.app/user/payments/success/${id.eventId}`,{
            headers:{ Authorization :`Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}`}
        });
        dispatch(getPaymentId(data.data));
    } catch (error) {
        console.log(error);
    }
};


export const getUserDetail = (id) => async (dispatch) => {
    try {
        const { data } = await axios.get(`https://artisup.up.railway.app/users/${id}`);
        dispatch(getUsersId(data.data));
    } catch (error) {
        console.log(error);
    }
};
