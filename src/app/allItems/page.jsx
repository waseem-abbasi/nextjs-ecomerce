export default function Allitems({ name, data, description, style, isLoggedIn, handlequintyinc, handlequintydec, handleCard }) {
  return (
    <div className="border" style={style}>
      <div className="text-center mt-5">
        <h1>{name}</h1>
        <p>{description}</p>
      </div>

      <div className="row p-4">
        {data?.map((item) => {
          if (item.status !== "available") return null;
          return (
            <div className="col-lg-3" key={item.id}>
              <div className="card">
                <div className="card-header">
                  <img
                    src={item.imgurl}
                    style={{ objectFit: "cover", height: "250px", width: "100%" }}
                    alt={item.name}
                  />
                </div>
                <div className="card-body">
                  {item.quantity <= 0 ? (
                    <>
                      <p>{item.description}</p>
                      <h4>Rs. {item.price}</h4>
                    </>
                  ) : (
                    <>
                      <p>{item.description}</p>
                      <h4>Rs. {item.price}</h4>
                    </>
                  )}
                </div>

                {isLoggedIn && (
                  <div>
                    <div className="text-center">
                      <i
                        className="fa fa-minus-circle text-warning"
                        onClick={() => handlequintydec(name, item.id)}
                      ></i>

                      <span className="p-3">{item.selectedQty}</span>

                      <i
                        className="fa fa-plus-circle text-warning"
                        onClick={() => handlequintyinc(name, item.id)}
                      ></i>
                    </div>
                    <div className="d-grid gap-2 mt-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={item.quantity <= 0}
                        onClick={() => handleCard(item)}
                      >
                        Add To Cart
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>


    </div>
  );
}
