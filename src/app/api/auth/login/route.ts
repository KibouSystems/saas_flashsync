import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();


export async function POST(req : Request) {
    try {
        const body = await req.json();
        const {email, password} = body;

        if(!email || !password){
            return NextResponse.json({
                message: 'Email and password are required'
            }, {status:400})
        }

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return NextResponse.json({
                message: 'User not Found'
            },{status: 400})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return NextResponse.json({
                message: 'Invalid Password.'
            },{status: 401})
        }

        const {password: _, ...userWithoutPassword} = user;

        return NextResponse.json({
            message: 'Login Successful',
            user: userWithoutPassword
        })
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({
            message:'Internal Server Error'
        },{status: 500})
    }
}