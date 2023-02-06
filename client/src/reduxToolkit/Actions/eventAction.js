import axios from 'axios';
import {getId} from '../ReducerSlices/EventSlice';




export const getEventId = (id) => async (dispatch) => {
    try {
        const { data } = await axios.get(`https://artisup-production.up.railway.app/events/${id}`,{
            headers: { Authorization :`Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}`}
        });
        // console.log(data.data);
        dispatch(getId(data.data));
    } catch (error) {
        console.log(error);
    }
};
