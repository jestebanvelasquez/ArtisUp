import axios from 'axios';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import Form from './Form';
import {ValidateEvent} from '../../../utils/ValidateEvent'

export default function Create() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);//mostrar carga user experience
    const [event, setEvent] = useState({
        eventName: '',
        description:'',
        imagesEvent: '',
        city:'',
        country:'',
        place:'',
        day:'',
        hour:'',
        finish:'',
        premiumTickets:null,
        boxTickets:null,
        generalTickets: null,
        priceOne:null,
        priceTwo:null,
        priceThree:null,
        capacity: null,
        categories: ''
    })

    const [errors, setErrors] = useState({
        // eventName:'requerido'
    })

    const handleChange = (e) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value
        })
        let errorsResult = ValidateEvent({
            ...event,
            [e.target.name]: e.target.value
        })
        setErrors(errorsResult)
    }

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append("upload_preset", 'example1');//nombre del folder
        setLoading(true)
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/esteban3232/image/upload",{
                method:'POST',
                body: data,
            }
        )
        const file = await res.json()
        setEvent({
            ...event,
            imagesEvent: file.secure_url
        })
        setLoading(false)
    }


    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            event.capacity = Number(event.boxTickets) + Number(event.generalTickets) + Number(event.premiumTickets)
            console.log(event);
            const response = await axios('https://artisup.up.railway.app/create',{
                method:'POST',
                headers: { Authorization :`Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}`},
                data:event
            })
            console.log(response);
            Swal.fire(`evento ${event.eventName} creado con exito`)
        } catch (error) {
            Swal.fire(error.message)
        }




    }




  return (
    <div className=' '>

    <Form 
            event={event}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            showModal={showModal}
            setShowModal={setShowModal}
            uploadImage={uploadImage}
        />
    </div>
  )
}
