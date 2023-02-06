import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getEventId } from '../../reduxToolkit/Actions/eventAction';
import axios from 'axios';
import Header from '../Home/landin/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';


const validateBuy = (input) => {
    let errors = {}
    if ((!input.premiumTickets || input.premiumTickets === 0) && (!input.boxTickets || input.boxTickets === 0) && (!input.generalTickets || input.generalTickets === 0)) {
        errors.premiumTickets = 'ingresa un valor a los tickets'
    }


    return errors
}

const maxTickets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]


export default function FormBuy() {
    const navigate = useNavigate()
    const params = useParams();
    const dispatch = useDispatch()
    const event = useSelector(state => state.eventsPrincipal.id)

    useEffect(() => {
        dispatch(getEventId(params.id))
    }, [dispatch, params])

    let total
    let price
    const [tickets, setTickets] = useState({
        eventId: '',
        imagesEvent: '',
        premiumTickets: 0,
        boxTickets: 0,
        generalTickets: 0,
        priceOne: 0,
        priceTwo: 0,
        priceThree: 0,
        totalTickets: 0,
        totalPrice: 0
    })


    total = parseInt(tickets.premiumTickets ? tickets.premiumTickets : 0) + parseInt(tickets.boxTickets ? tickets.boxTickets : 0) + parseInt(tickets.generalTickets ? tickets.generalTickets : 0)
    price = parseInt(tickets.premiumTickets ? tickets.premiumTickets * event.priceOne : 0) + parseInt(tickets.boxTickets ? tickets.boxTickets * event.priceTwo : 0) + parseInt(tickets.generalTickets ? tickets.generalTickets * event.priceThree : 0)

    const handlePremium = (e) => {
        setTickets({
            ...tickets,
            premiumTickets: e.value
        })

    }
    const handleBox = (e) => {
        setTickets({
            ...tickets,
            boxTickets: e.value
        })

    }
    const handleGeneral = (e) => {
        setTickets({
            ...tickets,
            generalTickets: e.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            tickets.eventId = event.id
            tickets.eventName = event.eventName
            tickets.imagesEvent = event.imagesEvent
            tickets.priceOne = event.priceOne
            tickets.priceTwo = event.priceTwo
            tickets.priceThree = event.priceThree
            tickets.totalTickets = total
            tickets.totalPrice = price
            // console.log(tickets);
            window.localStorage.setItem('cart', JSON.stringify(tickets))
            const response = await axios('https://artisup-production.up.railway.app/user/create-order', {
                method: 'POST',
                headers: { Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('auth-token'))}` },
                data: tickets
            })
            if (response.data.url) return navigate(response.data.url) //window.location.href = response.data.url // return navigate('http://localhost:3000/user/checkout-success')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full h-auto   font-medium   bg-black">
            <Header />
            <div className="container  mx-auto">
                <div className="   ">
                    <div className=" flex flex-col flex-wrap items-center justify-center w-auto     bg-black" data-aos='fade-up' data-aos-offset='800'>
                        {/* <div className="w-60 flex flex-col bg-green-800 " /> */}
                        <div className='w-full lg:rounded-full p-5 rounded-3xl  bg-green-500 flex flex-row items-center justify-center  my-32' >
                            <img className="  w-96 rounded-3xl shadow-2xl   duration-200 hover:transform hover:scale-105  shadow-gray-800" src={event.imagesEvent} alt="" />

                        </div>
                        <div className="mb-5 my-0  ">
                            <p className="text-6xl text-center font-extrabold text-zinc-200 capitalize  " data-aos='fade-down' data-aos-offset='300'>Tickets</p>
                        </div>
                        <div className="w-full     rounded-lg lg:rounded-l-none">
                            <form onSubmit={(e) => handleSubmit(e)} className="px-8 p-10 bg-zinc-800  rounded-xl" data-aos='fade-up' data-aos-offset='300'>

                                <div className=" flex flex-col justify-center  lg:flex-row lg:justify-between " data-aos='fade-down' data-aos-offset=''>
                                    <div className=" mb-10 bg-yellow-400 bg-opacity-50 z-50 w-auto lg:w-80  rounded-xl">
                                        <label className="block p-5 text-sm font-bold text-center text-gray-100" >
                                            Premium:  {Number(event.premiumTickets - tickets.premiumTickets)}

                                        </label>
                                        <label className="block lg:mb-2 text-sm font-bold text-center text-gray-100">1 =   ${event.priceOne} Usd</label>
                                        <Select
                                            className=''
                                            key={maxTickets.map(el => el)}
                                            options={maxTickets.map(elemnt => ({ label: elemnt, value: elemnt, }))}
                                            onChange={(e) => handlePremium(e)}
                                        />
                                    </div>

                                    <div className=" mb-10 bg-blue-400 bg-opacity-50 w-auto z-0 lg:w-80   rounded-xl" data-aos='fade-down' data-aos-offset=''>
                                        <label className="block p-5 text-sm font-bold text-center text-gray-100" >
                                            Box:  {Number(event.boxTickets - tickets.boxTickets)}
                                        </label>
                                        <label className="block mb-2 text-sm font-bold text-center text-gray-100">1 =  ${event.priceTwo} Usd</label>
                                        <Select
                                            className=''
                                            key={maxTickets.map(el => el)}
                                            options={maxTickets.map(elemnt => ({ label: elemnt, value: elemnt, }))}
                                            onChange={(e) => handleBox(e)}
                                        />
                                    </div>

                                    <div className="mb-10 bg-green-400 bg-opacity-50 -z-50 w-auto lg:w-80  rounded-xl" data-aos='fade-down' data-aos-offset=''>
                                        <label className="block  p-5  text-sm font-bold text-center text-gray-100" >
                                            General:{Number(event.generalTickets - tickets.generalTickets)}
                                        </label>
                                        <label className="block mb-2 text-sm font-bold text-center text-gray-100">1 =   ${event.priceThree} Usd</label>
                                        <Select
                                            className=''
                                            key={maxTickets.map(el => el)}
                                            options={maxTickets.map(elemnt => ({ label: elemnt, value: elemnt, }))}
                                            onChange={(e) => handleGeneral(e)}
                                        />
                                        
                                    </div>
                                </div>
                                <h3 className="pt-4 text-2xl text-center pb-12">Tu Compra:</h3>

                                {/* LISTADO DE LA COMPRA */}

                                <div className="mb-4 flex justify-between">
                                    <div className=" mr-2 mb-0">
                                        <label className="block mb-2 text-lg font-extrabold  text-center text-yellow-400 text-opacity-60" >
                                            Tickets Premiun:
                                        </label>
                                    </div>
                                    <div className="md:mr-2">
                                        <label className="mr-2 lg:ml-4 flex justify-between items-center text-lg font-bold text-center text-gray-100" htmlFor="lastName">
                                            {tickets.premiumTickets}
                                        </label>
                                    </div>
                                    <div className="md:ml-2">
                                        <label className="flex justify-between mb-2 text-lg  font-bold text-center text-yellow-400 text-opacity-60" htmlFor="lastName">
                                            ${Number(tickets.premiumTickets * event.priceOne)}
                                        </label>
                                    </div>
                                </div>
                                <hr className="mb-6 border-t" />

                                <div className="mb-4 flex justify-between items-center ">
                                    <div className=" md:mr-2 md:mb-0 ">
                                        <label className="block mb-2 text-lg font-extrabold text-center text-blue-400 text-opacity-60" >
                                            Tickets Box:
                                        </label>
                                    </div>
                                    <div className="ml-9 flex justify-between items-center ">
                                        <label className=" text-lg font-bold text-center text-gray-100" htmlFor="lastName">
                                            {tickets.boxTickets}
                                        </label>
                                    </div>
                                    <div className="md:ml-2">
                                        <label className="block  text-lg font-bold text-center text-blue-400 text-opacity-60" htmlFor="lastName">
                                            ${Number(tickets.boxTickets * event.priceTwo)}
                                        </label>
                                    </div>
                                </div>

                                <hr className="mb-6 border-t" />

                                <div className="mb-4 flex justify-between items-center ">
                                    <div className=" md:mr-2 md:mb-0">
                                        <label className="block mb-2 text-lg font-extrabold text-center text-green-400 text-opacity-60" >
                                            Tickets General:
                                        </label>
                                    </div>
                                    <div className=" flex justify-between items-center">
                                        <label className="block ml-1  text-lg font-bold text-gray-100" htmlFor="lastName">
                                            {tickets.generalTickets}
                                        </label>
                                    </div>
                                    <div className="md:ml-2 content-center">
                                        <label className="block  text-lg font-bold text-center text-green-400 text-opacity-60" htmlFor="lastName">
                                            ${Number(tickets.generalTickets * event.priceThree)}
                                        </label>
                                    </div>
                                </div>

                                <hr className="mb-6 border-t" />

                                {/* Valor Compra */}

                                <div className="mb-4 flex justify-between bg">
                                    <div className="mb-4 md:mr-2 md:mb-0">
                                        <label className="block  text-lg font-bold text-gray-100" >
                                            Total Compra:
                                        </label>
                                    </div>
                                    <div className="ml-5 ">
                                        <label className="block mb-2 text-lg font-bold text-gray-100" htmlFor="lastName">
                                            {total}
                                        </label>
                                    </div>
                                    <div className="md:ml-2">
                                        <label className="block mb-2 text-lg font-bold text-gray-100" htmlFor="lastName">
                                            ${price}
                                        </label>
                                    </div>
                                </div>
                                <hr className="mb-6 border-t" />

                                <div className="mb-6 text-center ">
                                    <button className="w-full lg:w-80 px-4 py-2 font-bold text-gray-800 hover:text-white bg-green-400 rounded-2xl hover:bg-green-500 focus:outline-none focus:shadow-outline" type="submit"
                                        disabled={(!tickets.premiumTickets || tickets.premiumTickets === 0) && (!tickets.boxTickets || tickets.boxTickets === 0) && (!tickets.generalTickets || tickets.generalTickets === 0)
                                            ? true : false}
                                    >
                                        Pagar
                                { (!tickets.premiumTickets || tickets.premiumTickets === 0) && (!tickets.boxTickets || tickets.boxTickets === 0) && (!tickets.generalTickets || tickets.generalTickets === 0) ? 
                                     <span className="text-red-600 text-center"> ingresa un valor a los tickets </span> : null
                                }
                                    </button>
                                </div>
                                <hr className="mb-6 border-t" />
                                <div className="bottom-10 text-center">
                                    <button className="w-full lg:w-80 px-4 py-2 font-bold text-gray-800 bg-red-300 hover:text-white rounded-2xl hover:bg-red-400 focus:outline-none focus:shadow-outline"
                                        onClick={() => navigate(`/user/artist/${event.members[0].user.id}`)}
                                    >
                                        Cancelar
                                    </button>
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





