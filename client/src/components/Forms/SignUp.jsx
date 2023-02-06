import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { uploadImage } from '../../utils/cloudInary'
import Select from '../../utils/select'
import axios from 'axios'
import { useAuthContext } from '../../auth/context/authContext'
import Footer from '../Footer/Footer'
import Header from '../Home/landin/Header'
import { Validate } from '../../utils/validate'


export default function SignUp() {

    const { login } = useAuthContext()

    const [rol, setRol] = useState('')
    const [user, setUser] = useState({
        nickName: '',
        image: '',
        userName: '',
        email: '',
        phone: 0,
        city: '',
        country: '',
        password: '',
        c_password: '',
        rol: ''
    })

    const [error, setErrors] = useState({
        userName: ''
    })

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
        let errorsResult = Validate({
            ...user,
            [e.target.name]: e.target.value
        })
        setErrors(errorsResult)
    }

    const upImage = async (e) => {
        try {
            const img = await uploadImage(e)
            setUser({
                ...user,
                image: img
            })
        } catch (error) {
            return (error);
        }

    }

    const onChangefilterby = (e) => {
        setRol(e.value)
        setUser({
            ...user,
            rol: e.value
        })
        let errorsResult = Validate({
            ...user,
            rol: e.value
        })
        setErrors(errorsResult)
    }
    const filterby = [
        { name: 'Artista', value: 'ARTIST' },
        { name: 'Usuario', value: 'USER' },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        // setErrors({userName: 'requerido'})
        console.log(user);
        try {
            const User = await axios('https://artisup-production.up.railway.app/signup', {
                method: 'POST',
                data: user
            })
            console.log(User);

            window.localStorage.setItem('auth-token', JSON.stringify(User.data.token));
            window.localStorage.setItem('User', JSON.stringify(User.data));
            window.localStorage.setItem('Rol', JSON.stringify(User.data.rol))
            window.localStorage.setItem('isAuth', true)

            setUser({
                nickName: '',
                image: '',
                userName: '',
                email: '',
                phone: '',
                city: '',
                country: '',
                password: '',
                c_password: '',
            })
            login()
        } catch (error) {
            console.log(error);
        }
    }


    return (

        <div className="w-auto  justify-center font-medium   bg-black">
            <Header />
            <div className="container  mx-auto  ">
                <div className="flex justify-center items-center   ">
                    <div className="w-full  flex flex-col  items-center justify-center  ">
                        <div className='    lg:rounded-full mt-32 flex flex-col items-center justify-center ' data-aos='fade-up' data-aos-offset='800'>
                            <img className='rounded-full h-96  ' src={!user.image ? 'https://res.cloudinary.com/esteban3232/image/upload/v1665116148/eventApp/png-transparent-falling-in-love-woman-anxiety-student-others-angle-woman-ecchi-thumbnail_wlumsl.png' : user.image} alt="" />
                        </div>
                        <h3 className=" text-5xl mt-10 text-green-500 text-center">Crea Tú Cuenta!</h3>
                        <div className="w-full h-full lg:w-11/12  my-16 bg-zinc-100 rounded-3xl p-5 " data-aos='fade-left' data-aos-offset=''>
                            <form onSubmit={(e) => handleSubmit(e)} className=" px-10  pt-10 pb-8 mb-4  ">
                                <div className="mb-4 md:flex md:justify-between">

                                    <div className="mb-4 ">
                                        <label className="block mb-2 text-sm font-bold text-center text-gray-700" htmlFor="lastName">
                                            Selecciona Tu Rol
                                        </label>
                                        <Select
                                            filterby={filterby}
                                            onChangefilterby={onChangefilterby}
                                        />
                                        {!user.rol && error.rol ? <span className="text-red-600 text-center"> {error.rol} </span> : null}

                                    </div>
                                    <div className="mb-4 md:mr-2 md:mb-0">

                                        <label className="block mb-2 text-center text-sm font-bold text-gray-700" >
                                            {!user.rol || user.rol === 'USER' ? 'Nombre & Apellido' : 'Integrantes'}
                                        </label>
                                        <input onChange={(e) => handleChange(e)} className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="userName" type="text" placeholder="user name" />
                                        {error && error.userName ? <span className="text-red-600 text-center"> {error.userName} </span> : null}


                                    </div>
                                    <div className="md:ml-2">
                                        <label className="block text-center mb-2 text-sm font-bold text-gray-700" htmlFor="lastName">
                                            Email
                                        </label>
                                        <input onChange={(e) => handleChange(e)} className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="email" type="text" placeholder="email" />
                                        {error && error.email ? <span className="text-red-600 text-center"> {error.email} </span> : null}
                                    
                                    </div>
                                </div>
                                {
                                    rol === 'ARTIST' ?
                                        <div className="mb-4 ">
                                            <label className="block  mb-2 text-sm text-center font-bold text-gray-700" >
                                                Nombre Artistico
                                            </label>
                                            <input onChange={(e) => handleChange(e)} value={user.nickName} className="w-full px-3 py-2 text-center text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="nickName" type="text" placeholder="Nombre Artistico" />
                                        {error && error.nickName ? <span className="text-red-600 text-center"> {error.nickName} </span> : null}
                                           
                                        </div>
                                        : null
                                }
                                <hr className="mb-5 border-t border-slate-400" />
                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0">
                                        <label className="block mb-2 text-sm text-center font-bold text-gray-700" >
                                            Ciudad
                                        </label>
                                        <input onChange={(e) => handleChange(e)} value={user.city} className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="city" type="text" placeholder="city" />
                                        {error && error.city ? <span className="text-red-600 text-center"> {error.city} </span> : null}
                                    </div>
                                    <div className="md:ml-2">
                                        <label className="block mb-2 text-sm text-center font-bold text-gray-700" htmlFor="lastName">
                                            País
                                        </label>
                                        <input onChange={(e) => handleChange(e)} value={user.country} className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="country" type="text" placeholder="country" />
                                        {error && error.country ? <span className="text-red-600 text-center"> {error.country} </span> : null}
                                    </div>
                                </div>
                                <hr className="mb-6 border-t border-slate-400" />
                                <div className="mb-4 flex flex-col justify-center items-center">
                                    <label className="block mb-2 text-sm text-center font-bold text-gray-700" type="email">
                                        Telefono
                                    </label>
                                    <input onChange={(e) => handleChange(e)} value={user.phone} className="w-full lg:w-60  px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="phone" type="number" placeholder="phone" />
                                    {error && error.phone ? <span className="text-red-600 text-center"> {error.phone} </span> : null}
                                
                                </div>
                                <hr className="mb-6 border-t border-slate-400" />
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm text-center font-bold text-gray-700" htmlFor="email">
                                        Imagen Perfil
                                    </label>
                                    <input className="block w-full text-sm text-green-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold file:bg-green-500  file:text-white  hover:file:bg-green-600"
                                        name="image"
                                        type="file" placeholder="image profile"
                                        onChange={(e) => upImage(e)}
                                    />

                                </div>
                                <hr className="mb-6 border-t border-slate-400" />
                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0">
                                        <label className="block mb-2 text-sm text-center font-bold text-gray-700" htmlFor="password">
                                            Contraseña
                                        </label>
                                        <input onChange={(e) => handleChange(e)} value={user.password} className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border  rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="password" type="password" placeholder="***********" />
                                        {error && error.password ? <span className="text-red-600 text-center"> {error.password} </span> : null}
                                    </div>
                                    
                                    <div className="md:ml-2">
                                        <label className="block mb-2 text-sm text-center font-bold text-gray-700" htmlFor="c_password">
                                            Confirme Contraseña
                                        </label>
                                        <input onChange={(e) => handleChange(e)} value={user.c_password} className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" name="c_password" type="password" placeholder="***********" />
                                        {error && error.c_password ? <span className="text-red-600 text-center"> {error.c_password} </span> : null}
                                    </div>
                                </div>
                                <hr className="mb-6 border-t border-slate-400" />
                                <div className="mb-6 text-center">
                                    <button 
                                        className="w-full lg:w-60 px-4 text-center py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline" 
                                        type="submit"
                                        // disabled={!error.userName ? false : true}
                                        // disabled={Object.keys(error).values.length === 0 ? false : true}
                                        >
                                        Registrar Cuenta
                                    </button>
                                </div>
                                <hr className="mb-6 border-t border-slate-400" />

                                <div className="text-center">
                                    <Link to='/login' className="inline-block text-center  text-base  text-gray-700 align-baseline hover:text-green-600" >
                                        Ya Tienes Una Cuenta? Login!
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}
