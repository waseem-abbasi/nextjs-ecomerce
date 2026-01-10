import { NextResponse } from "next/server";
import pool from "../../../../lib/config";

export async function DELETE(req) {
    try {
        const body = await req.json()

        console.log("body----->",body);

        const{cart_id}=body;
        console.log("id----->"+cart_id)

        const result = await pool.query("DELETE FROM cart WHERE id = $1 RETURNING *", [cart_id]);

        console.log("result---->",result);
        console.log("result is",result.rowCount);
        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }
        return NextResponse.json({ success:true,message: "Item delete", user: cart_id }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "server error" }, { status: 500 })
    }
}