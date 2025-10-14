import Image from "next/image"
// import img from "../../../public/images/images2.jpg"
export default function Homebar() {
    // const imgsrc = 'https://m.media-amazon.com/images/I/3110zKZoMGL._SY445_SX342_QL70_FMwebp_.jpg';
    return (
        <>
            <div className="container mt-5 pt-5" style={{ marginTop: "200px" }}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card ">
                            <div className="m-5 ">
                                <span className=" p-3 rounded text-primary" style={{ backgroundColor: "#99b8e6ff" }}>New Collection 2025</span>
                                <h1 className="mt-3">
                                    Discover Stylish<span className="text-warning" >Fashion</span>For Every Season
                                </h1>
                                <p className="mt-5">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Vestibulum ante ipsum primis in faucibus
                                </p>
                                <button type="button" className="btn btn-primary mt-2 ms-2">Shop now</button>
                                <button type="button" className="btn btn-outline-primary mt-2 ms-2">View Collection</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="card ">
                            {/* <Image src='' width='' height='' /> */}

                            <Image  height={450} width={450} src="/images/images2.jpg" alt="hero-header" />
                            {/* <Image  className="pt-7 pt-md-0 w-100" height='200' width='200' src={imgsrc}  alt="hero-header" /> */}
                            {/* <Image
                                src="images/img1"
                                alt="Fashion Item"
                                width={300}        
                                height={300}       
                                className="rounded"
                            /> */}  
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}