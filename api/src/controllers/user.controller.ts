// @ts-nocheck
import { Response, Request, Express } from 'express';
import Stripe from 'stripe';
import sendMail from '../utils/nodeMailer';
const stripe = Stripe(process.env.STRIPE_KEY)
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['query', 'info'] })


const userController = {
    getProfile: async (req: Request, res: Response) => {
        try {
            const user = await prisma.users.findUnique({
                where: { id: `${req.user_id}` },
                include: {
                    shows: {
                        include: {
                            event: {
                                include: {
                                    categories: true
                                }
                            }

                        },
                    }
                },

            })
            if (!user) {
                res.status(400).json({ succes: false, message: 'no existe usuario con esa id' })
            } else {
                res.status(200).json({ succes: true, data: user })
            }
        } catch (error) {
            res.status(400).json({ succes: false, message: error })
        }
    },
    getUsers: async (_req: Request, res: Response) => {
        try {
            const allUsers = await prisma.users.findMany()
            if (allUsers.length > 0) {
                res.status(201).json({ data: allUsers })
            } else {
                res.status(404).json({ message: 'no hay usuarios registrados' })
            }

        } catch (error) {
            res.status(400).json({ message: error })
        }
    },
    getUserId: async (req: Request, res: Response) => {
        console.log(req.params.id);
        try {
            const user = await prisma.users.findUnique({
                where: { id: req.params.id },
                include: {
                    shows: {
                        include: {
                            event: {
                                include: {
                                    categories: true
                                }
                            }

                        },
                    }
                },

            })
            if (!user) {
                res.status(400).json({ succes: false, message: 'no existe usuario con esa id' })
            } else {
                res.status(200).json({ succes: true, data: user })
            }
        } catch (error) {
            res.status(400).json({ succes: false, message: error })
        }

    },
    avaliableUser: async (req: Request, res: Response) => {
        const { boolean } = req.body
        try {
            const user = await prisma.users.update({
                where: { id: req.user_id },
                data: { available: boolean }
            })
            res.status(200).json({ data: user })
        } catch (error) {
            res.status(400).json({ data: error })
        }
    },
    generateOrder: async (req: Request, res: Response) => {
        try {
            const tickets = req.body
            const metadata = await stripe.customers.create({
                metadata: {
                    userId: req.user_id,
                    eventId: tickets.eventId,
                    premium: tickets.premiumTickets,
                    box: tickets.boxTickets,
                    general: tickets.generalTickets,
                    priceOne: tickets.priceOne,
                    priceTwo: tickets.priceTwo,
                    priceThree: tickets.priceThree,
                }
            })
            const line_items = {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: tickets.eventName.toUpperCase(),
                        images: [tickets.imagesEvent],
                        description: `Resumen Tikets:
                                Premium ${tickets.premiumTickets}, 
                                Box ${tickets.boxTickets}, 
                                General ${tickets.generalTickets}`,
                        metadata: {
                            id: tickets.id
                        },
                    },
                    unit_amount: tickets.totalPrice * 100
                },
                quantity: 1
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [line_items],
                mode: 'payment',
                metadata: metadata.metadata,
                success_url: 'https://events-app-eta.vercel.app/user/checkout-success',
                cancel_url: `https://events-app-eta.vercel.app/user/event/tickets/${tickets.id}`,
            });

            // console.log(session);

            res.send({ url: session.url });

        } catch (error) {
            console.log(error);
        }
    },
    hooksStripe: async (req: Request, res: Response) => {
        const sig = req.headers['stripe-signature'];
        // console.log(req.body, 'eventoooooooo');
        let buyEvent;
        let session;
        let data;
        try {
            session = Stripe.webhooks.constructEvent(req.body, sig, process.env.END_POINT_SECRET)
            console.log('eventttttttttt', session.data.object.metadata);
        } catch (err) {
            console.log('error', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        buyEvent = session.data.object.metadata;
        data = session.data.object;
        session = session.type;
        if (session === 'checkout.session.completed') {
            
            console.log('eventttttttttt', buyEvent);
            console.log('itemssssssssss', data);
            const payment = await prisma.payment.create({
                data:{
                    
                    userId:buyEvent.userId,
                    eventId: buyEvent.eventId,
                    premium: Number(buyEvent.premium),
                    box: Number(buyEvent.box),
                    general: Number(buyEvent.general),
                    currency: data.id,
                    payment_status: data.payment_status,
                    amount_total : data.amount_total 
                }
            })

            
            
            console.log(payment, 'recibido');
            // res.status(200).json({data:payment})
        }
        res.send().end();

    },
    email: async (req: Request, res: Response) =>{

        const user = req.body
        try {
            const headerToken = req.get('Authorization');

            if(headerToken === 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY2NjE0MjYwNCwiaWF0IjoxNjY2MTQyNjA0fQ.GIJ3oWS6-t5ilzSCw_-rESaSSwCcUyIRNLfIzf2TTO8' ){
                
                const token:any = headerToken?.replace("Bearer ", "");
                const response =  sendMail(user)
                res.status(200).json({success:'email enviado'})
            }
        } catch (error) {
            console.log(error);
        }
    },
    payments: async (req: Request, res: Response) =>{
        try {
            const user = await prisma.users.findUnique({
                where:{ id:req.user_id},
                select:{
                    payment: {
                        include:{
                            event:true
                        }
                    }

                    
                }
            })
            res.status(200).json({data:user})
        } catch (error) {
            res.status(500).json({message:error})
        }
    },
    succesPayment : async (req:Request, res:Response) => {
        console.log(req.user_id);
        try {
            const payment = await prisma.payment.findFirst({
                where:{
                    eventId:req.params.id,
                    userId:req.user_id
                },
                include:{
                    event:true
                }
            })
            res.status(200).json({data: payment})

        } catch (error) {
            res.status(500).json({message: error})
        }
    }

}

export default userController;









