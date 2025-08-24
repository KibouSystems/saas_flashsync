import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';



const prisma = new PrismaClient();


export async function POST(req : Request){
    try {
        const {email, password , username , firstname , lastname , companyname} = await req.json()

        if(!email || !password || !username || !companyname) {
            return NextResponse.json({
                error: "Missing Required Fields"
            },{status: 400})
        }

        const existingUser = await prisma.user.findUnique({
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
        const user =await prisma.user.create({
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