import { NextResponse } from "next/server";
import pool from "../../../../../../lib/config";

export async function GET(req, context) {
    let { id } = context.params;
    try {
        if (!id) {
            const result = await pool.query("SELECT * FROM products ORDER BY id ASC")
            console.log("result is",result);
            return NextResponse.json(
                { message: "All categories fetched", success: true, data: result.rows },
                { status: 200 }
            );
        } else {
            if (Array.isArray(id)) {
                id = id[0];
            }
            const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
            if (result.rows.length === 0) {
                return NextResponse.json(
                    { message: "products not found", success: false },
                    { status: 404 }
                );
            }
        }
    }
    catch (error) {
        console.log("error", error)
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}