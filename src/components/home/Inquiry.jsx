const GroupBg = "https://i.postimg.cc/PrTxrckK/Group-bg.png";
import { useToast } from '../../context/ToastContext';

const Inquiry = () => {

    const showToast = useToast();
    const handleSubmit = (e) => {
        e.preventDefault();
        showToast("Success! Your inquiry has been sent to suppliers. We will contact you soon.");
    };

    return (
        <div
            className="mx-auto mt-6 mb-10 max-w-[1180px] h-auto md:h-[420px] bg-cover bg-center flex flex-col md:flex-row px-4 md:px-0"
            style={{ background: `url(${GroupBg})` }}
        >
            <div className="w-full md:w-[440px] h-auto md:h-[139px] p-6 md:p-10 text-white">
                <h2 className="text-[24px] md:text-[32px] font-semibold leading-tight">
                    An easy way to send
                    <br className="hidden md:block" /> requests to all suppliers
                </h2>
                <p className="mt-3 text-[14px] md:text-[16px] w-full md:w-[390px]">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                </p>
            </div>
            <div className="mx-auto md:mx-0 md:ml-auto w-full md:w-[491px] h-auto md:h-[346px] bg-white rounded-md mt-4 md:mt-9 mb-6 md:mb-0 md:mr-11 shadow-sm pb-6 md:pb-0">
                <h4 className="font-semibold text-xl py-4 px-6 md:px-6">Send quote to suppliers</h4>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-6">
                    <input required type="text" placeholder="What item you need?" className="p-2 mb-3 w-full border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    
                    <textarea required placeholder="Type more details" rows={2} className="p-2 mb-3 w-full border border-gray-300 rounded-md transition-colors resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    
                    <div className="flex mb-3">
                        <input required type="number" min="1" placeholder="Quantity" className="p-2 w-1/2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        
                        <select name="number-pcs" id="number-pcs" defaultValue="pcs" className="p-2 w-1/4 ml-2 border border-gray-300 rounded-md transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="pcs" disabled>Pcs</option>
                            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <button type="submit" className="w-fit px-4 py-2 text-white bg-[#0D6EFD] rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm">
                        Send inquiry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Inquiry;