import { GroupBg } from "../assets/images/index";

const Inquiry = () => {
    return (
        <div
            className="mx-auto mt-6 mb-10 max-w-[1180px] h-[420px] bg-cover bg-center flex"
            style={{ background: `url(${GroupBg})` }}
        >
            <div className="w-[440px] h-[139px] p-10 text-white">
                <h2 className="text-[32px] font-semibold leading-tight">
                    An easy way to send
                    <br /> requests to all suppliers
                </h2>
                <p className="mt-3 text-[16px] w-[390px]">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                </p>
            </div>
            <div className="mx-auto w-[491px] h-[346px] bg-white rounded-md mt-9 mr-11 shadow-sm">
                <h4 className="font-semibold text-xl py-4 px-6">Send quote to suppliers</h4>
                <form action="" className="flex flex-col gap-2 px-6">
                    <input type="text" placeholder="What item you need?" className="p-2 mb-3 w-full border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    
                    <textarea placeholder="Type more details" rows={2} className="p-2 mb-3 w-full border border-gray-300 rounded-md transition-colors  resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    
                    <div className="flex mb-3">
                        <input type="number" placeholder="Quantity" className="p-2 w-1/2 border border-gray-300 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        
                        <select name="number-pcs" id="number-pcs" defaultValue="pcs" className="p-2 w-1/4 ml-2 border border-gray-300 rounded-md transition-colors bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="pcs" disabled>Pcs</option>
                            
                            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                            
                        </select>
                    </div>
                    
                    <button className="w-fit px-4 py-2 text-white bg-[#0D6EFD] rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm">
                        Send inquiry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Inquiry;