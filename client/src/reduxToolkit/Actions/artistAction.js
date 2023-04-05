import axios from "axios";
import {
    getArtists,
    getByName,
    getArtistsId,
    getProfile,
    getName
} from "../ReducerSlices/artistSlice";

export const getAllArtists = () => async (dispatch) => {
    try {
        const {data} = await axios.get("https://artisup.up.railway.app/artist/all",{
            // headers: { Authorization :`Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}`} 
        })
            console.log(data.data);
            dispatch(getArtists(data.data))
    } catch (error) {
        console.log(error);
    }
};
export const getShowByName = (name) => async (dispatch) => {
    try {
        const { data } = await axios.get(
            `https://artisup.up.railway.app/events?name=${name}`,
            {}
        );
        dispatch(getByName(data));
    } catch (error) {
        console.log(error);
    }
};
export const getShowDetail = () => async (dispatch) => {
    const token = window.localStorage.getItem('auth-token')
    try {
        const { data } = await axios.get(`https://artisup.up.railway.app/events/:id`,{
            headers: token
        });
        dispatch(getArtistsId(data.data));
    } catch (error) {
        console.log(error);
    }
};


export const getProfileArtist = () => async (dispatch) => {

    try {
        const { data } = await axios.get(`https://artisup.up.railway.app/artist/profile`,{
            headers: { Authorization :`Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}`}            
        });
        // console.log(data,'data');
        
        dispatch(getProfile(data.data));
    } catch (error) {
        console.log(error);
    }
};

export const getArtistName = (name) => async (dispatch) => {

    try {
        const { data } = await axios.get(`https://artisup.up.railway.app/artist?name=${name}`
        // ,{
        //     // headers: {Authorization : JSON.parse(window.localStorage.getItem('auth-token'))}
        // }
        );
        console.log(data.data);
        dispatch(getName(data.data));
    } catch (error) {
        console.log(error);
    }
};



