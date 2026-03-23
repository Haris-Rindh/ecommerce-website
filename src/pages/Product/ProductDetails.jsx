import { Link, useParams, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductPage from "./ProductPage";
import DetailsTab from "../Product/DetailsTab";
import RelatedProducts from "../Product/RelatedProducts";

const ProductDetails = () => {
    const { id } = useParams();
    
    return (
        <div className="bg-gray-50 py-6 font-sans">
            <div className="mx-auto max-w-[1180px] px-4 xl:px-0">
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronRight size={16} />
                    <Link to="/category/all" className="hover:text-blue-400">Categories</Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-900 font-medium">Product Details</span>
                </div>

                <ProductPage id={id} />
                <DetailsTab productId={id} />
                <RelatedProducts />
            </div>
        </div>
    );
};

export default ProductDetails;