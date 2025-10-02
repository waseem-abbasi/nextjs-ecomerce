import { NextResponse } from "next/server";
import pool from "../../../../../../lib/config"
export async function DELETE(req, context) {

    console.log("req is", req)
    console.log("context is", context)

    try {
        
        const params = await context.params;
        let { id } = params;

        console.log("category id",id)

        if (Array.isArray(id)) {
            id = id[0];
        }

        if (!id) {
            return NextResponse.json(
                { message: "ID is required", success: false },
                { status: 400 }
            );
        }

        const result = await pool.query("DELETE FROM category WHERE id = $1 RETURNING *", [id]);

        console.log("result is", result);

        console.log("api is work", id);

        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Item delete", data: result.rows[0] }, { status: 201 })

    } catch (error) {
        console.error("DB error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false, error: error.message },
            { status: 500 }
        );
    }
}