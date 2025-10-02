import { montserrat } from "../fonts";

export default function Thirdsection() {

    return (
        <>
            <div className={`border border-primary ${montserrat.className}`}  style={{ background: "#d4ddeaff" }}>
                <div className="row p-5">
                    <div className="col-lg-3  p-3 ">
                        <h5>Free Shipping</h5>
                        <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                    </div>
                    <div className="col-lg-3  p-3">
                        <h5>Money Back Guranted</h5>
                        <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                    </div>
                    <div className="col-lg-3  p-3">
                        <h5>Discount Offer</h5>
                        <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                    </div>
                    <div className="col-lg-3  p-3">
                        <h5>24/7 Support</h5>
                        <p>Nulla sit morbi vestibulum eros duis amet, consectetur vitae lacus. Ut quis tempor felis sed nunc viverra.</p>
                    </div>
                </div>

            </div>
        </>
    )
}