import { NextResponse } from "next/server";
import pool from "../../../../lib/config";

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT 
            SUM(p.price::numeric * bi.quantity::int) AS grand_total
            FROM public.bill_items bi
            JOIN products p ON p.id = bi.product;
    `
        );
        console.log("result", result);

        return NextResponse.json({
            success: true,
            bills: result.rows,
        });

    } catch (error) {
        console.error("error", error);
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
