import { useParams } from "react-router-dom";
import "./PoojaDetails.css";
import Footer from "../components/Footer";
import { useGetPoojaByIdQuery } from "../services/backendApi";

const PoojaDetails = () => {
    const { id } = useParams();
    const { data: pooja, isLoading: loading } = useGetPoojaByIdQuery(id, {
        skip: !id,
    });

    const whatsappNumber = "999999999999";
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("Hello, I want to know more about this pooja.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    if (loading) return <p>Loading...</p>;
    if (!pooja) return <p>Pooja not found</p>;

    return (
        <>
            <div className="pooja-details-container">
                <div className="pooja-details">
                    {/* LEFT */}
                    <div className="pooja-left">
                        <img src={pooja.image} alt={pooja.name} />
                    </div>

                    {/* RIGHT */}
                    <div className="pooja-right">
                        <h1>{pooja.name}</h1>
                        <p className="description">{pooja.description}</p>
                        <h2 className="price">Price: ₹ {pooja.price}</h2>
                        <button className="inquiry-btn" onClick={handleWhatsAppClick}>
                            Know More
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default PoojaDetails;
