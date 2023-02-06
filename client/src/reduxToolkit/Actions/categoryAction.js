import axios from "axios";
import { getCategories } from "../ReducerSlices/artistSlice";


export const getAllCategories = () => async (dispatch) => {
    try {
        const { data } = await axios.get('https://artisup-production.up.railway.app/categories');
        dispatch(getCategories(data.data));
    } catch (error) {
        console.log(error);
    }
}

