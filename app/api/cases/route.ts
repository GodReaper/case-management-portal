import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (
    req: Request
){
    try{
        const {userId} = auth()
        const {title} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorised", {status:401})
        }

        const cases = await db.case.create({
            data: {
              userId,
              title,
            }
          });

          return NextResponse.json(cases);
    } catch (error){
        console.log["[CASES]", error];
        return new NextResponse("Internal Error", {status:500})
    }
}