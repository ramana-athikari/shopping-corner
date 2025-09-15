

const MyFooter = () => {
    return (
        <footer className="bg-dark p-4 text-white mt-5">
            <div className="container">
                <div className="row">
                    <div className="col-xl-4">
                        <h5 className="text-warning"> About Us </h5>
                        <p>
                            asfd asfd asf asf asfd asfd asfd fasd asfdlkj afljk aflkaf kalf
                            asfd asfd asf asf asfd asfd asfd fasd asfdlkj afljk aflkaf kalf
                            asfd asfd asf asf asfd asfd asfd fasd asfdlkj afljk aflkaf kalf
                        </p>
                    </div>
                    <div className="col-xl-5">
                        <h5 className="text-warning"> Contact Us </h5>
                        <p> #41, 2nd Cross, Outer Ring Road Marathahalli, Bangalore - 560037 </p>
                        <p> Email - contact@urwebisite.com </p>
                        <p> Mobile - +91 - 8574966666 </p>
                    </div>
                    <div className="col-xl-3">
                        <h5 className="text-warning"> Follow Us On </h5>
                        {/* <span className="me-2"> <i className="fa fab fa-facebook p-1 facebook rounded"> </i> </span>
                        <span className="me-2"> <i className="fa fab fa-instagram p-1 insta rounded"> </i> </span>
                        <span className="me-2"> <i className="fa fab fa-youtube p-1 youtube rounded"> </i> </span>
                        <span className="me-2"> <i className="fa fab fa-linkedin p-1 linkedin rounded"> </i> </span> */}
                        
                        {/* bootstrap icons */}
                        {/* <span className="me-2"> <i className="bi bi-facebook fs-4"> </i> </span>
                        <span className="me-2"> <i className="fa fab fa-instagram fs-4"> </i> </span>
                        <span className="me-2"> <i className="fa fab fa-youtube fs-4"> </i> </span>
                        <span className="me-2"> <i className="fa fab fa-linkedin fs-4"> </i> </span> */}
                        
                        {/* fontawesome icons */}
                        <span className="me-2"> <i className="fa-brands fa-square-facebook fs-4"></i> </span>
                        <span className="me-2"> <i className="fa-brands fa-square-instagram fs-4"></i> </span>
                        <span className="me-2"> <i className="fa-brands fa-square-youtube fs-4"></i> </span>
                        <span className="me-2"> <i className="fa-brands fa-linkedin fs-4"></i> </span>
                        {/* <p id="cursor">  www.facebook.com </p>
                        <p id="cursor">  www.instagram.com </p>
                        <p id="cursor">  www.youtube.com </p>
                        <p id="cursor"> www.linkedin.com </p> */}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default MyFooter;