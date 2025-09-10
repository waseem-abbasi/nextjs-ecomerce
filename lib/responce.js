import { NextResponse } from "next/server";

export function responce(success,message,status,result,token)
{
    return NextResponse.json({success:success || false,result:result||[],status:status || 500,message:message||"no message",token:token || ""})
}