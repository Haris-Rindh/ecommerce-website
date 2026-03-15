import Herosection from '../herosection'
import Deals from '../deals'
import Homeitems from '../homeitems'
import Inquiry from '../Inquiry'
import Recommended_items from '../recommended_items'
import Extra_service from '../extra_service'
import Suppliers from '../suppliers'
const Home = () => {
    return (
        <div className='bg-gray-50'>
            <Herosection />
            <Deals />
            <Homeitems />
            <Inquiry />
            <Recommended_items />
            <Extra_service />
            <Suppliers />
        </div>
    )
}

export default Home