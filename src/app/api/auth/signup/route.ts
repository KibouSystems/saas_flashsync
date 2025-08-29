/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { PrismaClient, User} from '@prisma/client';
import bcrypt from 'bcryptjs';



const prisma = new PrismaClient();
interface SignupBody{
    email: string
    password: string
    username: string
    firstname: string
    lastname: string
    companyname?:string
}


export async function POST(req : Request){
    try {
        const body : SignupBody = await req.json()
        const {email, password , username , firstname , lastname , companyname} = body

        if(!email || !password || !username || !companyname) {
            return NextResponse.json({
                error: "Missing Required Fields"
            },{status: 400})
        }

        const existingUser : User | null = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(existingUser){
            return NextResponse.json({
                error: "User already Exist"
            }, {status: 400})
        }

        const hashPassword = await bcrypt.hash(password,10)
        const user : User =await prisma.user.create({
            data:{
                email,
                password:hashPassword,
                username,
                firstname,
                lastname,
                companyname,
                role:'ADMIN'
            }
        })

        return NextResponse.json({
            message: "user Registered"
        })
    } catch (error) {
        console.error("Signup Error:", error)
        return NextResponse.json({
            error: "Internal Server Error"
        }, {status: 500})
    }
}