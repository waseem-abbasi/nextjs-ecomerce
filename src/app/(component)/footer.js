
export default function Footer() {
    return (
        <>
            <div className="row border pt-2">
                <div className="col-sm-3  p-5">
                    <h1 className="text-primary"><span className="fs-4">e</span>store</h1>
                    <p className="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in nibh vehicula, facilisis magna ut, consectetur lorem.</p>
                    <div>
                        <i className="bi bi-house-add pe-2 text-primary"></i>
                        <span className="">123 Fashion Street, New York, NY 10001</span>
                    </div>
                    <div>
                        <i className="bi bi-telephone pe-2 text-primary"></i>
                        <span className="">hello@example.com</span>
                    </div>
                    <div>
                        <i className="bi bi-envelope pe-2 text-primary"></i>
                        <span className="">hello@example.com</span>
                    </div>
                </div>
                <div className="col-sm-2  p-5">
                    <h3 className="text-primary">Shop</h3>
                    <p>Bestsellers</p>
                    <p>Women's Clothing</p>
                    <p>Men's Clothing</p>
                </div>
                <div className="col-sm-2  p-5">
                    <h3 className="text-primary">Support</h3>
                    <p>Help Center</p>
                    <p>Order Status</p>
                    <p>Shipping Info</p>
                </div>
                <div className="col-sm-2  p-5">
                    <h3 className="text-primary">Company</h3>
                    <p>About Us</p>
                    <p>Careers</p>
                    <p>Press</p>
                </div>
                <div className="col-sm-3  p-5">
                    <h3 className="text-primary">Download Our App</h3>
                    <p className="">Shop on the go with our mobile app</p>
                    <p className="">123 Fashion Street, New York, NY 10001</p>
                    <p className="">+1 (555) 123-4567</p>
                    <p className="">hello@example.com</p>
                </div>
            </div>
            <div className=" p-2" style={{ background: "#d4ddeaff" }}>
                <p className="text-center">© Copyright eStore. All Rights Reserved.</p>
            </div>
        </>
    )
}