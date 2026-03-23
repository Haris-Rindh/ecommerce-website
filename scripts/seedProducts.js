import { initializeApp } from "firebase/app";
import { collection, getDocs, deleteDoc, writeBatch, doc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxj-uKTdNBUGntITBYMTSk6qyjPSgDZJ4",
  authDomain: "ecommerce-1593a.firebaseapp.com",
  projectId: "ecommerce-1593a",
  storageBucket: "ecommerce-1593a.firebasestorage.app",
  messagingSenderId: "1040163215112",
  appId: "1:1040163215112:web:e772d124affaaec320febd",
  measurementId: "G-3K61WJG2XM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categoryData = {
    "mobile-accessory": {
        brands: ["Anker", "Belkin", "Spigen", "OtterBox", "Ugreen", "Baseus"],
        adjectives: ["Fast Charging", "Magnetic", "Premium", "Durable", "Wireless", "Waterproof", "Braided", "Slim"],
        nouns: ["Cable 2M", "Power Bank 10K", "Car Mount", "Screen Protector 2-Pack", "Earbuds Case", "Phone Stand", "Tripod", "Gimbal"],
        images: [
            "https://images.unsplash.com/photo-1620189507195-68309c04c4d0?w=800&q=80",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
            "https://images.unsplash.com/photo-1574920406000-54e7d1b32bb3?w=800&q=80",
            "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800&q=80",
            "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=800&q=80",
            "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80"
        ],
        features: ["Compatible with iOS and Android", "Compact design", "18-Month Warranty"]
    },
    "electronics": {
        brands: ["Sony", "Samsung", "LG", "Bose", "JBL", "Panasonic"],
        adjectives: ["4K Ultra HD", "Active Noise Cancelling", "Wireless", "Smart", "Portable", "High-Fidelity"],
        nouns: ["Smart TV 55-Inch", "Over-Ear Headphones", "Bluetooth Speaker", "Soundbar System", "Action Camera", "Digital Photo Frame"],
        images: [
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
            "https://images.unsplash.com/photo-1544427920-c49ccfbc216c?w=800&q=80",
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
            "https://images.unsplash.com/photo-1502920514313-52581002a659?w=800&q=80",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
        ],
        features: ["Immersive Audio/Video Quality", "Bluetooth 5.0 enabled", "Long battery life"]
    },
    "smartphones": {
        brands: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Motorola"],
        adjectives: ["Pro 5G", "Ultra", "Lite", "Foldable", "Max", "Plus"],
        nouns: ["Smartphone 128GB", "Smartphone 256GB", "Smartphone 512GB", "Premium Phone", "Budget Phone"],
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
            "https://images.unsplash.com/photo-1601784551446-20c9e07cd8d6?w=800&q=80",
            "https://images.unsplash.com/photo-1533228100845-08145b01de14?w=800&q=80",
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80"
        ],
        features: ["All-day battery life", "Stunning OLED display", "Professional grade camera system"]
    },
    "modern-tech": {
        brands: ["DJI", "Oculus", "Fitbit", "Garmin", "Amazon", "Nest"],
        adjectives: ["Smart Health", "Virtual Reality", "AI-Powered", "Automated", "Next-Gen"],
        nouns: ["Drone with Camera", "VR Headset", "Fitness Tracker", "Smart Thermostat", "Security Camera", "Smart lock"],
        images: [
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
            "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800&q=80",
            "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
            "https://images.unsplash.com/photo-1522770289-53e7ba2ea2ef?w=800&q=80",
            "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80"
        ],
        features: ["Seamless integration", "Cutting-edge technology", "Easy installation"]
    },
    "automobiles": {
        brands: ["Velocity Motors", "RoadGrip", "Pinnacle Auto", "LubePro", "VoltGuard"],
        adjectives: ["High-Performance", "All-Season", "Heavy-Duty", "Premium", "Aerodynamic"],
        nouns: ["Tires Set of 4", "Car Wash & Wax Kit", "Rubber Floor Mats", "Cargo Roof Box", "Lithium Jump Starter", "Motor Oil 5W-30"],
        images: [
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
            "https://images.unsplash.com/photo-1606184594248-1851e3e78a2c?w=800&q=80",
            "https://images.unsplash.com/photo-1583121280346-5921473be906?w=800&q=80",
            "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
            "https://images.unsplash.com/photo-1619642055106-e7896451000b?w=800&q=80",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"
        ],
        features: ["Universal fitment", "Long-lasting durability", "Enhances vehicle performance"]
    },
    "clothes-and-wear": {
        brands: ["DenimCo", "AeroStep", "Nordic Peak", "BasicsCo", "UrbanPeak", "SunOptics"],
        adjectives: ["Classic Fit", "Thermal", "Premium Cotton", "Athletic", "Polarized", "Genuine Leather"],
        nouns: ["Jeans", "Sneakers", "Puffer Jacket", "Crewneck T-Shirt", "Aviator Sunglasses", "Dress Belt"],
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
        ],
        features: ["Comfortable for all-day wear", "Machine washable", "Stylish modern design"]
    },
    "home-interiors": {
        brands: ["ComfortPlus", "Artisan Home", "CleanBot", "LoungeDecor", "TimberHome"],
        adjectives: ["Ergonomic", "Minimalist", "Smart Robotic", "Rustic", "Industrial", "Bohemian"],
        nouns: ["Office Chair", "Ceramic Vases", "Vacuum Cleaner", "Coffee Table", "Wall Mirror", "Bookshelf"],
        images: [
            "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
            "https://images.unsplash.com/photo-1612152605347-f93296cb657d?w=800&q=80",
            "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
            "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
            "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80"
        ],
        features: ["Enhances living space", "Premium materials", "Easy setup/assembly"]
    },
    "computer-and-tech": {
        brands: ["Nexa", "ClickPro", "PixelGear", "TypeMaster", "DataStore", "Connecto"],
        adjectives: ["Ultra-Slim", "Wireless Ergonomic", "144Hz Gaming", "Tactile Mechanical", "Portable", "Multiport USB-C"],
        nouns: ["14-inch Laptop", "Master Mouse", "Monitor", "Keyboard", "External SSD 1TB", "Hub 7-in-1"],
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
            "https://images.unsplash.com/photo-1597848212624-a19eb35e2636?w=800&q=80",
            "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80"
        ],
        features: ["High-speed connectivity", "Built for productivity", "Durable and reliable"]
    }
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPrice = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

async function generateAndSeed() {
    console.log("Starting script to clear and seed products...");
    const productsRef = collection(db, "products");

    // 1. Delete all existing products
    const existingDocs = await getDocs(productsRef);
    console.log(`Found ${existingDocs.size} existing products. Deleting them...`);
    const deleteBatch = writeBatch(db);
    let delCount = 0;
    
    // Break into batches of 500 for deletion
    let currentDeleteBatch = writeBatch(db);
    for (const docSnap of existingDocs.docs) {
        currentDeleteBatch.delete(docSnap.ref);
        delCount++;
        if (delCount % 500 === 0) {
            await currentDeleteBatch.commit();
            currentDeleteBatch = writeBatch(db);
        }
    }
    if (delCount % 500 !== 0) await currentDeleteBatch.commit();
    console.log("All existing products deleted successfully.");

    // 2. Generate new products
    console.log("Generating 320 new products with multiple images...");
    const productsToUpload = [];

    const categories = Object.keys(categoryData);
    // 40 products per category
    for (const cat of categories) {
        const data = categoryData[cat];
        for (let i = 0; i < 40; i++) {
            const brand = getRandom(data.brands);
            const adjective = getRandom(data.adjectives);
            const noun = getRandom(data.nouns);
            const title = `${brand} ${adjective} ${noun}`;
            
            const price = parseFloat(getRandomPrice(30, 800));
            // 30% chance of a discount
            let discountedPrice = price;
            if (Math.random() > 0.7) {
                discountedPrice = parseFloat((price * (Math.random() * 0.4 + 0.5)).toFixed(2));
            }

            // Generate an array of 3-4 random images from the category list
            const shuffledImages = shuffleArray(data.images);
            const numImages = Math.floor(Math.random() * 2) + 3; // 3 or 4
            const images = shuffledImages.slice(0, numImages);

            const isFigmaRecommended = Math.random() > 0.85; // ~15% chance to be recommended on home page
            
            productsToUpload.push({
                title,
                price,
                discountedPrice: discountedPrice < price ? discountedPrice : price,
                images,
                categorySlug: cat,
                brand,
                condition: Math.random() > 0.2 ? "New" : "Refurbished",
                rating: (Math.random() * 1.5 + 3.5).toFixed(1) + "/5",
                description: `Experience the exceptional quality and innovative design of the ${title}. This product is designed to meet your everyday needs with superior performance.`,
                features: data.features,
                isFigmaRecommended,
                createdAt: new Date().toISOString()
            });
        }
    }

    console.log(`Generated ${productsToUpload.length} products. Uploading to Firestore...`);

    // 3. Upload new products in batches of 500
    let uploadBatch = writeBatch(db);
    let uploadCount = 0;
    
    for (const prod of productsToUpload) {
        const docRef = doc(productsRef); // auto-generate ID
        uploadBatch.set(docRef, prod);
        uploadCount++;
        
        if (uploadCount % 500 === 0) {
            await uploadBatch.commit();
            uploadBatch = writeBatch(db);
        }
    }
    if (uploadCount % 500 !== 0) await uploadBatch.commit();

    console.log("Products successfully uploaded to Firestore!");
    process.exit(0);
}

generateAndSeed().catch(err => {
    console.error("Error running seed script:", err);
    process.exit(1);
});
