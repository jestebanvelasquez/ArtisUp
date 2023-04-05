import React from 'react'
import { Link } from 'react-router-dom'

const img = 'https://res.cloudinary.com/esteban3232/image/upload/v1664933611/eventApp/marco-bicca-bpNr_FJNwrc-unsplash_ykupzo.jpg'


export default function OverView() {

    return (
        <section className='lg:min-h-[712px] bg-overview bg-cover bg-left-top pt-[30px] lg:pt-[87px]'>
            <div className='container mx-auto flex justify-end overflow-hidden'>
                <img src={img} alt='' className='rounded-2xl' data-aos='fade-up' data-aos-offset='400' />
            </div>
            <div className='flex items-center pb-10 pt-10 justify-center max-w-sm lg:max-w-full mx-auto lg:mx-0 gap-x-2 lg:gap-x-6' data-aos='fade-down'
                data-aos-delay='400'>
                <Link to='/signup' className='text-white btn btn-md p-5 pb-5 lg:btn-lg btn-amber flex items-center justify-center lg:gap-x-4' >
                  Registrarme'
                </Link>
            </div>

        </section>
    )
}
