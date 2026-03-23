
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const productsToUpload = [
    {
        "title": "2023 Performance Sedan GT",
        "price": 35000.00,
        "discountedPrice": 33500.00,
        "image": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "Velocity Motors",
        "condition": "New",
        "rating": "9.2/10",
        "description": "A sleek, reliable, and powerful sedan perfect for daily commuting with excellent fuel efficiency and modern safety features.",
        "features": [
            "2.5L Turbocharged Engine",
            "Advanced driver-assistance systems",
            "Premium leather interior"
        ]
    },
    {
        "title": "All-Season Performance Tires (Set of 4)",
        "price": 600.00,
        "discountedPrice": 520.00,
        "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "RoadGrip",
        "condition": "New",
        "rating": "8.8/10",
        "description": "High-quality all-season tires designed to provide superior traction and a smooth ride in wet and dry conditions.",
        "features": [
            "Optimized tread pattern for wet grip",
            "60,000-mile treadwear warranty",
            "Reduced road noise technology"
        ]
    },
    {
        "title": "Luxury Mid-Size SUV",
        "price": 48000.00,
        "discountedPrice": 45500.00,
        "image": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "Pinnacle Auto",
        "condition": "New",
        "rating": "9.5/10",
        "description": "A spacious and luxurious mid-size SUV offering exceptional comfort, state-of-the-art infotainment, and robust off-road capabilities.",
        "features": [
            "Panoramic moonroof",
            "All-wheel drive capability",
            "3rd-row seating"
        ]
    },
    {
        "title": "Full Synthetic Motor Oil 5W-30",
        "price": 35.99,
        "discountedPrice": 29.99,
        "image": "https://images.unsplash.com/photo-1606184594248-1851e3e78a2c?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "LubePro",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Advanced full synthetic motor oil designed to keep engines running like new by providing exceptional wear protection.",
        "features": [
            "5-quart container",
            "Improves fuel economy",
            "Protects against engine sludge"
        ]
    },
    {
        "title": "Heavy-Duty Car Battery 12V",
        "price": 145.00,
        "discountedPrice": 125.00,
        "image": "https://images.unsplash.com/photo-1583121280346-5921473be906?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "VoltGuard",
        "condition": "New",
        "rating": "9.1/10",
        "description": "Reliable 12V automotive battery delivering strong starting power even in extreme cold or hot weather conditions.",
        "features": [
            "750 Cold Cranking Amps",
            "Maintenance-free design",
            "3-year replacement warranty"
        ]
    },
    {
        "title": "Premium Silicone Windshield Wipers",
        "price": 28.50,
        "discountedPrice": 22.00,
        "image": "https://images.unsplash.com/photo-1516570889980-60b6d2138128?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "ClearView",
        "condition": "New",
        "rating": "8.7/10",
        "description": "High-performance silicone windshield wiper blades providing streak-free wiping and lasting 2x longer than standard rubber blades.",
        "features": [
            "Aerodynamic spoiler design",
            "Water-repellent silicone coating",
            "Easy universal installation"
        ]
    },
    {
        "title": "Ceramic Brake Pads Set",
        "price": 55.00,
        "discountedPrice": 48.00,
        "image": "https://images.unsplash.com/photo-1486262715619-67081010ddbe?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "StopSure",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Ultra-quiet ceramic brake pads engineered to provide superior stopping power and low dust generation for cleaner wheels.",
        "features": [
            "Low dust formulation",
            "Includes premium hardware kit",
            "Thermal scorched for fast break-in"
        ]
    },
    {
        "title": "Ultimate Car Wash & Wax Kit",
        "price": 49.99,
        "discountedPrice": 39.99,
        "image": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "ShineMaster",
        "condition": "New",
        "rating": "9.0/10",
        "description": "A comprehensive 10-piece car wash and detailing kit, containing everything needed to clean, shine, and protect your vehicle.",
        "features": [
            "Carnauba wax included",
            "Microfiber wash mitt and towels",
            "Tire shine spray"
        ]
    },
    {
        "title": "All-Weather Rubber Floor Mats",
        "price": 85.00,
        "discountedPrice": 70.00,
        "image": "https://images.unsplash.com/photo-1619642055106-e7896451000b?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "RuggedTread",
        "condition": "New",
        "rating": "9.6/10",
        "description": "Heavy-duty custom-fit floor mats designed to trap water, mud, and dirt, keeping your car's interior pristine.",
        "features": [
            "Odorless rubber compound",
            "Deep-dish channel design",
            "Anti-slip backing"
        ]
    },
    {
        "title": "Aerodynamic Cargo Roof Box",
        "price": 450.00,
        "discountedPrice": 399.00,
        "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "AeroHaul",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Spacious and durable roof cargo box providing 16 cubic feet of extra storage for road trips and outdoor adventures.",
        "features": [
            "Dual-side opening",
            "Quick-mount installation system",
            "Secure central locking"
        ]
    },
    {
        "title": "Portable Lithium Jump Starter",
        "price": 99.99,
        "discountedPrice": 79.99,
        "image": "https://images.unsplash.com/photo-1600661653561-629509216228?w=800&q=80",
        "categorySlug": "automobiles",
        "brand": "ChargeBoost",
        "condition": "New",
        "rating": "9.7/10",
        "description": "Compact yet powerful 1000A peak lithium jump starter capable of jump-starting dead batteries in seconds.",
        "features": [
            "Built-in LED flashlight",
            "USB ports for device charging",
            "Spark-proof safety technology"
        ]
    },
    {
        "title": "Classic Straight Fit Denim Jeans",
        "price": 79.99,
        "discountedPrice": 59.99,
        "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "DenimCo",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Timeless straight-fit jeans crafted from durable heavyweight cotton for maximum comfort and everyday wear.",
        "features": [
            "100% Cotton Denim",
            "Classic 5-pocket styling",
            "Button fly closure"
        ]
    },
    {
        "title": "Pro-Runner Athletics Sneakers",
        "price": 130.00,
        "discountedPrice": 110.50,
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "AeroStep",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Lightweight athletic sneakers engineered for long-distance running with responsive cushioning and breathable mesh.",
        "features": [
            "Breathable woven mesh upper",
            "Shock-absorbing foam midsole",
            "High-traction rubber outsole"
        ]
    },
    {
        "title": "Thermal Winter Puffer Jacket",
        "price": 199.99,
        "discountedPrice": 149.99,
        "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "Nordic Peak",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Stay incredibly warm during the harshest winters with this insulated, water-resistant puffer jacket.",
        "features": [
            "Water-resistant nylon shell",
            "Ethically sourced down insulation",
            "Detachable faux-fur hood"
        ]
    },
    {
        "title": "Premium Cotton Crewneck T-Shirt",
        "price": 25.00,
        "discountedPrice": 19.50,
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "BasicsCo",
        "condition": "New",
        "rating": "8.8/10",
        "description": "An ultra-soft everyday t-shirt made from organic combed cotton, designed for a tailored but relaxed fit.",
        "features": [
            "100% Organic Cotton",
            "Pre-shrunk fabric",
            "Tagless collar design"
        ]
    },
    {
        "title": "Genuine Leather Dress Belt",
        "price": 45.00,
        "discountedPrice": 35.00,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "Heritage Leather",
        "condition": "New",
        "rating": "9.1/10",
        "description": "A sophisticated genuine leather belt featuring a sleek metallic buckle, perfect for formal and business attire.",
        "features": [
            "Full-grain cowhide leather",
            "Polished zinc alloy buckle",
            "1.25-inch width"
        ]
    },
    {
        "title": "Merino Wool Hiking Socks (3-Pack)",
        "price": 30.00,
        "discountedPrice": 24.00,
        "image": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "TrailFoot",
        "condition": "New",
        "rating": "9.7/10",
        "description": "Moisture-wicking merino wool socks that keep your feet dry, warm, and blister-free on long hikes.",
        "features": [
            "Odor-resistant material",
            "Cushioned heel and toe",
            "Seamless toe construction"
        ]
    },
    {
        "title": "Men's Athletic Running Shorts",
        "price": 35.00,
        "discountedPrice": 28.00,
        "image": "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "AeroStep",
        "condition": "New",
        "rating": "8.9/10",
        "description": "Lightweight and quick-drying athletic shorts featuring a supportive built-in liner and zip pockets.",
        "features": [
            "4-way stretch fabric",
            "Moisture-wicking technology",
            "Reflective logo details"
        ]
    },
    {
        "title": "Women's Cashmere Turtleneck Sweater",
        "price": 145.00,
        "discountedPrice": 120.00,
        "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "LuxeKnit",
        "condition": "New",
        "rating": "9.6/10",
        "description": "Incredibly soft and elegant cashmere sweater providing unmatched warmth and a flattering silhouette.",
        "features": [
            "100% Mongolian Cashmere",
            "Ribbed collar and cuffs",
            "Dry clean only"
        ]
    },
    {
        "title": "Classic Cotton Baseball Cap",
        "price": 22.00,
        "discountedPrice": 16.50,
        "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "UrbanPeak",
        "condition": "New",
        "rating": "8.6/10",
        "description": "A versatile and stylish adjustable cotton baseball cap to complete your casual everyday look.",
        "features": [
            "Adjustable brass buckle strap",
            "Curved brim",
            "Breathable eyelet vents"
        ]
    },
    {
        "title": "Polarized Aviator Sunglasses",
        "price": 110.00,
        "discountedPrice": 85.00,
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "SunOptics",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Classic aviator sunglasses featuring polarized lenses to reduce glare and provide 100% UV protection.",
        "features": [
            "Scratch-resistant polarized lenses",
            "Lightweight metal frame",
            "Includes hard carrying case"
        ]
    },
    {
        "title": "100% Silk Woven Tie",
        "price": 40.00,
        "discountedPrice": 29.99,
        "image": "https://images.unsplash.com/photo-1595186536069-72c0c1b4452d?w=800&q=80",
        "categorySlug": "clothes-and-wear",
        "brand": "SuitUp",
        "condition": "New",
        "rating": "8.8/10",
        "description": "A finely crafted silk tie with a modern geometric pattern, adding a touch of class to any formal suit.",
        "features": [
            "100% Pure Silk",
            "Hand-finished stitching",
            "3.15-inch classic width"
        ]
    },
    {
        "title": "Ergonomic Mesh Office Chair",
        "price": 350.00,
        "discountedPrice": 299.00,
        "image": "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "ComfortPlus",
        "condition": "New",
        "rating": "9.6/10",
        "description": "A premium ergonomic office chair featuring lumbar support, adjustable armrests, and breathable mesh for all-day comfort.",
        "features": [
            "Dynamic lumbar support system",
            "3D adjustable armrests",
            "Breathable suspension mesh"
        ]
    },
    {
        "title": "Minimalist Ceramic Vases Set",
        "price": 45.00,
        "discountedPrice": 35.00,
        "image": "https://images.unsplash.com/photo-1612152605347-f93296cb657d?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "Artisan Home",
        "condition": "New",
        "rating": "8.7/10",
        "description": "A stunning pair of minimalist ceramic vases designed to add a modern, earthy touch to your living space decor.",
        "features": [
            "Handcrafted ceramic material",
            "Matte textured finish",
            "Includes one tall and one wide vase"
        ]
    },
    {
        "title": "Smart Robot Vacuum Cleaner",
        "price": 299.99,
        "discountedPrice": 249.99,
        "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "CleanBot",
        "condition": "Refurbished",
        "rating": "8.9/10",
        "description": "Automate your daily chores with this powerful smart vacuum featuring app control, boundary mapping, and self-charging capabilities.",
        "features": [
            "Lidar navigation mapping",
            "App and voice control enabled",
            "Auto-return charging base"
        ]
    },
    {
        "title": "Velvet Decorative Throw Pillows (Set of 2)",
        "price": 38.00,
        "discountedPrice": 28.50,
        "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "LoungeDecor",
        "condition": "New",
        "rating": "9.1/10",
        "description": "Luxurious soft velvet throw pillows that elevate the look of any sofa, armchair, or bed with elegant comfort.",
        "features": [
            "Hidden zipper closure",
            "Machine washable covers",
            "Hypoallergenic inserts included"
        ]
    },
    {
        "title": "Modern LED Floor Lamp",
        "price": 89.99,
        "discountedPrice": 69.99,
        "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "Lumiere",
        "condition": "New",
        "rating": "9.4/10",
        "description": "A sleek, minimalist floor lamp offering adjustable color temperatures and brightness levels to suit your reading or relaxing mood.",
        "features": [
            "Touch-sensitive controls",
            "3 color temperature modes",
            "Flexible gooseneck design"
        ]
    },
    {
        "title": "Large Round Wall Mirror",
        "price": 120.00,
        "discountedPrice": 95.00,
        "image": "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "Reflecta",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Expand your space visually with this elegant 32-inch round wall mirror featuring a slim metallic frame.",
        "features": [
            "Shatterproof glass",
            "Brushed brass frame finish",
            "Pre-installed hanging hardware"
        ]
    },
    {
        "title": "Rustic Wood Coffee Table",
        "price": 250.00,
        "discountedPrice": 210.00,
        "image": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "TimberHome",
        "condition": "New",
        "rating": "9.3/10",
        "description": "A sturdy farmhouse-style coffee table crafted from solid reclaimed wood with industrial metal legs.",
        "features": [
            "Solid pine wood surface",
            "Matte black iron legs",
            "Easy 15-minute assembly"
        ]
    },
    {
        "title": "Bohemian Geometric Area Rug",
        "price": 180.00,
        "discountedPrice": 140.00,
        "image": "https://images.unsplash.com/photo-1575414003593-eca07be2239e?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "WeaveArt",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Add warmth and texture to your living room with this 5x8 ft geometric patterned rug that is soft underfoot.",
        "features": [
            "Stain-resistant fibers",
            "Low pile for easy vacuuming",
            "Non-shedding woven design"
        ]
    },
    {
        "title": "Industrial 5-Tier Bookshelf",
        "price": 140.00,
        "discountedPrice": 115.00,
        "image": "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "SpaceSave",
        "condition": "New",
        "rating": "8.8/10",
        "description": "A versatile shelving unit combining a steel frame with wooden shelves, perfect for books, plants, and decorative pieces.",
        "features": [
            "Anti-tip safety kit included",
            "55 lbs capacity per shelf",
            "Scratch-resistant wood veneer"
        ]
    },
    {
        "title": "Blackout Bedroom Curtains",
        "price": 45.00,
        "discountedPrice": 35.00,
        "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "SleepWell",
        "condition": "New",
        "rating": "9.6/10",
        "description": "Heavyweight thermal insulated curtains that block out 99% of light and reduce outside noise for a perfect night's sleep.",
        "features": [
            "Thermal insulating layer",
            "Rust-proof silver grommets",
            "Machine washable fabric"
        ]
    },
    {
        "title": "Bamboo Desk Organizer",
        "price": 28.00,
        "discountedPrice": 22.00,
        "image": "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80",
        "categorySlug": "home-interiors",
        "brand": "EcoOffice",
        "condition": "New",
        "rating": "8.9/10",
        "description": "Declutter your workspace with this elegant, sustainable bamboo organizer featuring multiple compartments for pens, notes, and clips.",
        "features": [
            "100% natural bamboo",
            "6 varied compartments",
            "Slide-out drawer"
        ]
    },
    {
        "title": "Noise-Cancelling Wireless Headphones",
        "price": 349.00,
        "discountedPrice": 298.00,
        "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "Acoustica",
        "condition": "New",
        "rating": "9.8/10",
        "description": "Industry-leading noise cancellation meets exceptional high-fidelity audio in these comfortable over-ear wireless headphones.",
        "features": [
            "Active Noise Cancellation (ANC)",
            "30-hour battery life",
            "Multipoint Bluetooth connection"
        ]
    },
    {
        "title": "65-Inch 4K OLED Smart TV",
        "price": 1899.99,
        "discountedPrice": 1699.99,
        "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "VisionTech",
        "condition": "New",
        "rating": "9.7/10",
        "description": "Experience breathtaking contrast and vibrant colors with this ultra-thin 4K OLED smart TV featuring built-in streaming apps.",
        "features": [
            "Self-lit OLED pixels",
            "120Hz refresh rate for gaming",
            "Dolby Vision and Dolby Atmos support"
        ]
    },
    {
        "title": "Voice-Controlled Smart Speaker",
        "price": 99.00,
        "discountedPrice": 79.00,
        "image": "https://images.unsplash.com/photo-1544427920-c49ccfbc216c?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "EchoSound",
        "condition": "New",
        "rating": "9.1/10",
        "description": "A compact smart speaker with rich sound that allows you to control smart home devices, play music, and set alarms using your voice.",
        "features": [
            "Built-in voice assistant",
            "360-degree omnidirectional audio",
            "Privacy mic-mute button"
        ]
    },
    {
        "title": "Cinematic Dolby Atmos Soundbar",
        "price": 450.00,
        "discountedPrice": 399.00,
        "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "Acoustica",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Upgrade your home theater setup with this powerful soundbar featuring wireless subwoofers for immersive 3D surround sound.",
        "features": [
            "Dolby Atmos and DTS:X support",
            "Wireless active subwoofer",
            "Bluetooth and HDMI eARC connectivity"
        ]
    },
    {
        "title": "Waterproof Action Camera 4K",
        "price": 299.00,
        "discountedPrice": 250.00,
        "image": "https://images.unsplash.com/photo-1502920514313-52581002a659?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "CamPro",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Capture your extreme sports and underwater adventures in stunning 4K resolution with unparalleled image stabilization.",
        "features": [
            "Hyper-smooth video stabilization",
            "Waterproof up to 33ft (10m)",
            "Voice control capabilities"
        ]
    },
    {
        "title": "Full-Frame Mirrorless Camera",
        "price": 1999.00,
        "discountedPrice": 1850.00,
        "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "OpticTech",
        "condition": "New",
        "rating": "9.8/10",
        "description": "A professional-grade mirrorless camera delivering exceptional image quality, fast autofocus, and superb low-light performance.",
        "features": [
            "24.2 MP Full-Frame Sensor",
            "In-body image stabilization",
            "Dual SD card slots"
        ]
    },
    {
        "title": "20,000mAh Portable Power Bank",
        "price": 49.99,
        "discountedPrice": 35.99,
        "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "ChargeMax",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Never run out of battery again with this high-capacity power bank capable of fast-charging multiple devices simultaneously.",
        "features": [
            "18W Power Delivery fast charging",
            "Charges standard phones up to 5 times",
            "Digital LED battery display"
        ]
    },
    {
        "title": "True Wireless Sport Earbuds",
        "price": 129.00,
        "discountedPrice": 99.00,
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "SonicFit",
        "condition": "New",
        "rating": "8.9/10",
        "description": "Sweatproof and secure-fit wireless earbuds designed to stay in place during the most intense workouts while delivering crisp audio.",
        "features": [
            "IPX7 waterproof rating",
            "Adjustable secure-fit ear hooks",
            "Up to 24 hours total playtime with case"
        ]
    },
    {
        "title": "Fitness Tracking Smartwatch",
        "price": 199.00,
        "discountedPrice": 169.00,
        "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "VitalWear",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Monitor your health metrics, track your workouts, and stay connected with notifications straight to your wrist.",
        "features": [
            "Built-in GPS tracking",
            "Continuous heart rate monitoring",
            "Always-on AMOLED display"
        ]
    },
    {
        "title": "10-inch Wi-Fi Digital Photo Frame",
        "price": 149.00,
        "discountedPrice": 129.00,
        "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "Memoria",
        "condition": "New",
        "rating": "8.7/10",
        "description": "Instantly share photos from your smartphone to this high-resolution digital frame located anywhere in the world.",
        "features": [
            "HD touchscreen display",
            "Cloud photo sharing via App",
            "Auto-rotate orientation"
        ]
    },
    {
        "title": "Paper-like Display E-Reader",
        "price": 139.99,
        "discountedPrice": 119.99,
        "image": "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80",
        "categorySlug": "electronics",
        "brand": "ReadTech",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Enjoy thousands of books on a glare-free e-ink display that reads just like real paper, even in bright sunlight.",
        "features": [
            "Adjustable warm light",
            "Weeks-long battery life",
            "Waterproof design for poolside reading"
        ]
    },
    {
        "title": "Ultra-Slim 14-inch Laptop",
        "price": 1200.00,
        "discountedPrice": 1050.00,
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "Nexa",
        "condition": "New",
        "rating": "9.3/10",
        "description": "A lightweight powerhouse designed for professionals on the go, featuring a brilliant retina display and all-day battery life.",
        "features": [
            "8-Core Processor",
            "16GB RAM and 512GB SSD",
            "Backlit keyboard with fingerprint reader"
        ]
    },
    {
        "title": "Wireless Ergonomic Master Mouse",
        "price": 99.99,
        "discountedPrice": 79.99,
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "ClickPro",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Maximize productivity with this highly customizable ergonomic mouse featuring electromagnetic scrolling and multi-device connectivity.",
        "features": [
            "MagSpeed electromagnetic scrolling",
            "Tracks on any surface, including glass",
            "Customizable app-specific buttons"
        ]
    },
    {
        "title": "27-inch 144Hz Gaming Monitor",
        "price": 320.00,
        "discountedPrice": 275.00,
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "PixelGear",
        "condition": "Used - Like New",
        "rating": "8.8/10",
        "description": "Gain a competitive edge with this high-refresh-rate gaming monitor delivering ultra-smooth gameplay and vibrant colors.",
        "features": [
            "144Hz refresh rate with 1ms response time",
            "Adaptive-Sync technology",
            "IPS panel for wide viewing angles"
        ]
    },
    {
        "title": "Tactile Mechanical Keyboard",
        "price": 135.00,
        "discountedPrice": 115.00,
        "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "TypeMaster",
        "condition": "New",
        "rating": "9.6/10",
        "description": "Enhance your typing and gaming experience with a premium mechanical keyboard featuring tactile switches and customizable RGB lighting.",
        "features": [
            "Hot-swappable mechanical switches",
            "Per-key RGB backlighting",
            "Aircraft-grade aluminum frame"
        ]
    },
    {
        "title": "1TB Portable External SSD",
        "price": 149.00,
        "discountedPrice": 125.00,
        "image": "https://images.unsplash.com/photo-1597848212624-a19eb35e2636?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "DataStore",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Lightning-fast portable solid state drive, perfect for backing up large files, editing 4K video, or expanding console storage.",
        "features": [
            "Up to 1050 MB/s read/write speeds",
            "Drop-resistant up to 2 meters",
            "USB-C and USB-A compatibility"
        ]
    },
    {
        "title": "7-in-1 USB-C Multiport Hub",
        "price": 45.00,
        "discountedPrice": 34.00,
        "image": "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "Connecto",
        "condition": "New",
        "rating": "8.9/10",
        "description": "Expand your laptop's connectivity with this sleek aluminum hub providing HDMI, SD card slots, and multiple USB ports.",
        "features": [
            "4K HDMI output",
            "100W Power Delivery pass-through",
            "Gigabit Ethernet port"
        ]
    },
    {
        "title": "1080p HD Streaming Webcam",
        "price": 79.00,
        "discountedPrice": 59.00,
        "image": "https://images.unsplash.com/photo-1587826305948-43666014cd70?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "StreamCam",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Look your best on video calls and streams with a wide-angle HD webcam featuring auto-focus and dual stereo microphones.",
        "features": [
            "Full HD 1080p video at 30fps",
            "Built-in privacy shutter",
            "Automatic light correction"
        ]
    },
    {
        "title": "Dual-Band Wi-Fi 6 Router",
        "price": 160.00,
        "discountedPrice": 129.00,
        "image": "https://images.unsplash.com/photo-1544144433-d50aff500b91?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "NetStream",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Upgrade your home network with next-gen Wi-Fi 6 technology for faster speeds, greater capacity, and reduced network congestion.",
        "features": [
            "Up to 3 Gbps combined speeds",
            "Connects up to 40 devices simultaneously",
            "WPA3 security protocol"
        ]
    },
    {
        "title": "10.5-inch Productivity Tablet",
        "price": 329.00,
        "discountedPrice": 299.00,
        "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "Nexa",
        "condition": "New",
        "rating": "9.1/10",
        "description": "A versatile and portable tablet perfect for entertainment, digital art, and taking notes on the go.",
        "features": [
            "Vivid IPS display",
            "Stylus pen compatible",
            "Quad-speaker array"
        ]
    },
    {
        "title": "High-End Gaming Graphics Card",
        "price": 799.00,
        "discountedPrice": 749.00,
        "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "PixelGear",
        "condition": "New",
        "rating": "9.7/10",
        "description": "Push your PC gaming to the absolute limit with hardware-accelerated ray tracing and massive amounts of ultra-fast VRAM.",
        "features": [
            "12GB GDDR6X Memory",
            "Triple-fan cooling system",
            "Real-time Ray Tracing"
        ]
    },
    {
        "title": "Pre-Built Desktop Workstation",
        "price": 1450.00,
        "discountedPrice": 1300.00,
        "image": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
        "categorySlug": "computer-and-tech",
        "brand": "Nexa",
        "condition": "New",
        "rating": "9.4/10",
        "description": "A reliable, high-performance desktop PC optimized for demanding software like video editing, 3D rendering, and compiling code.",
        "features": [
            "12-Core Processor",
            "32GB DDR4 RAM",
            "1TB NVMe SSD + 2TB HDD"
        ]
    },
    {
        "title": "20V Max Cordless Power Drill Set",
        "price": 149.00,
        "discountedPrice": 119.00,
        "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "ToughBuild",
        "condition": "New",
        "rating": "9.1/10",
        "description": "A robust and compact 20V cordless drill set perfect for home DIY projects and professional contracting tasks alike.",
        "features": [
            "Includes 2 lithium-ion batteries",
            "2-speed transmission (0-450 / 0-1500 RPM)",
            "Built-in LED work light"
        ]
    },
    {
        "title": "18-in-1 Stainless Steel Multitool",
        "price": 119.95,
        "discountedPrice": 99.95,
        "image": "https://images.unsplash.com/photo-1586810165616-94c631fc2f79?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "SurviveGear",
        "condition": "New",
        "rating": "9.6/10",
        "description": "The ultimate everyday carry multitool equipped with pliers, wire cutters, knives, and screwdrivers all in a compact steel frame.",
        "features": [
            "18 integrated functional tools",
            "One-hand operable design",
            "Premium stainless steel construction"
        ]
    },
    {
        "title": "100-Piece Mechanics Tool Kit",
        "price": 85.00,
        "discountedPrice": 69.00,
        "image": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "ProForge",
        "condition": "New",
        "rating": "9.0/10",
        "description": "A comprehensive set of sockets, wrenches, and hex keys housed in a durable blow-molded case for easy organization and transport.",
        "features": [
            "Chrome vanadium steel construction",
            "72-tooth quick-release ratchets",
            "Corrosion resistant finish"
        ]
    },
    {
        "title": "7-1/4 Inch Circular Saw",
        "price": 110.00,
        "discountedPrice": 85.00,
        "image": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "CutMaster",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Powerful 15-Amp motor delivers 5200 RPM for tackling aggressive cutting applications in tough materials.",
        "features": [
            "57-degree bevel capacity",
            "Integrated dust blower",
            "Electric brake for safety"
        ]
    },
    {
        "title": "25-Foot Auto-Lock Tape Measure",
        "price": 18.50,
        "discountedPrice": 14.00,
        "image": "https://images.unsplash.com/photo-1545615569-b1487212d1b5?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "MeasurePro",
        "condition": "New",
        "rating": "8.8/10",
        "description": "Durable, high-visibility tape measure featuring a smooth auto-locking mechanism and an impact-resistant rubberized case.",
        "features": [
            "Nylon-coated blade for durability",
            "Magnetic dual-end hook",
            "Fractions printed on blade"
        ]
    },
    {
        "title": "Adjustable Heavy-Duty Workbench",
        "price": 249.00,
        "discountedPrice": 199.00,
        "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "ToughBuild",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Create the perfect workspace with this solid hardwood top workbench featuring adjustable steel legs to suit any project height.",
        "features": [
            "Solid bamboo/hardwood work surface",
            "1,500 lb weight capacity",
            "Adjustable height from 28 to 42 inches"
        ]
    },
    {
        "title": "6-Gallon Pancake Air Compressor",
        "price": 169.00,
        "discountedPrice": 139.00,
        "image": "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "AeroForce",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Highly portable air compressor providing plenty of pressure to drive nail guns, inflate tires, and run small pneumatic tools.",
        "features": [
            "150 max PSI for longer tool runtimes",
            "Oil-free, maintenance-free pump",
            "Dual universal couplers"
        ]
    },
    {
        "title": "Self-Leveling Cross-Line Laser",
        "price": 85.00,
        "discountedPrice": 65.00,
        "image": "https://images.unsplash.com/photo-1532054170756-3bb1d90c0ef7?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "AlignTech",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Projects bright horizontal and vertical lines onto flat surfaces, making picture hanging, tiling, and cabinet installation a breeze.",
        "features": [
            "High-visibility green laser beam",
            "Magnetic mounting bracket included",
            "IP54 water/debris resistance"
        ]
    },
    {
        "title": "4.5-Inch Angle Grinder",
        "price": 49.00,
        "discountedPrice": 39.00,
        "image": "https://images.unsplash.com/photo-1580983546522-6b9982dc85e3?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "CutMaster",
        "condition": "New",
        "rating": "8.7/10",
        "description": "A compact and robust angle grinder designed for aggressive metal cutting, rust removal, and masonry grinding tasks.",
        "features": [
            "7.5 Amp high-performance motor",
            "2-position side handle",
            "Tool-free guard adjustment"
        ]
    },
    {
        "title": "Digital Soldering Iron Kit",
        "price": 35.00,
        "discountedPrice": 27.50,
        "image": "https://images.unsplash.com/photo-1555523916-29a396e95ce1?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "ElectroWeld",
        "condition": "New",
        "rating": "9.1/10",
        "description": "Precision soldering iron with an adjustable LCD temperature display, perfect for electronics repair, jewelry making, and DIY crafts.",
        "features": [
            "Fast heating ceramic core",
            "Adjustable temp from 200°C to 450°C",
            "Includes 5 interchangeable tips"
        ]
    },
    {
        "title": "5-Gallon Wet/Dry Shop Vacuum",
        "price": 89.99,
        "discountedPrice": 75.00,
        "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
        "categorySlug": "tools-equipment",
        "brand": "CleanVac",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Tackle massive messes, liquid spills, and garage cleanup with this rugged and powerful stainless steel wet/dry vacuum.",
        "features": [
            "4.0 Peak HP motor",
            "Built-in blower port",
            "On-board accessory storage"
        ]
    },
    {
        "title": "Pro Indoor/Outdoor Basketball",
        "price": 45.00,
        "discountedPrice": 34.50,
        "image": "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "CourtKing",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Engineered with composite leather to provide exceptional grip and durability for both indoor courts and outdoor blacktops.",
        "features": [
            "Micro-fiber composite leather cover",
            "Deep channel design for better control",
            "Official size and weight"
        ]
    },
    {
        "title": "All-Terrain Mountain Bike",
        "price": 850.00,
        "discountedPrice": 750.00,
        "image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "TrailBlazer",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Conquer any trail with this durable mountain bike featuring a lightweight aluminum frame and a responsive suspension fork.",
        "features": [
            "Alpha Gold Aluminum frame",
            "21-speed drivetrain",
            "Hydraulic disc brakes for stopping power"
        ]
    },
    {
        "title": "Non-Slip Yoga & Exercise Mat",
        "price": 30.00,
        "discountedPrice": 22.00,
        "image": "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "ZenCore",
        "condition": "New",
        "rating": "8.8/10",
        "description": "Extra-thick foam yoga mat providing excellent cushioning and joint support during Pilates, yoga, or floor exercises.",
        "features": [
            "6mm thickness for joint comfort",
            "Textured non-slip surface",
            "Includes carrying strap"
        ]
    },
    {
        "title": "Adjustable Dumbbell Set (up to 50 lbs)",
        "price": 199.00,
        "discountedPrice": 169.00,
        "image": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "IronFlex",
        "condition": "New",
        "rating": "9.6/10",
        "description": "Save space in your home gym with these innovative adjustable dumbbells that let you change weights with a simple dial turn.",
        "features": [
            "Adjusts from 5 to 50 lbs per dumbbell",
            "Quiet molding around metal plates",
            "Replaces 10 pairs of dumbbells"
        ]
    },
    {
        "title": "Professional Carbon Fiber Tennis Racket",
        "price": 155.00,
        "discountedPrice": 130.00,
        "image": "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "AeroSwing",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Lightweight yet powerful carbon fiber tennis racket designed for intermediate to advanced players seeking control and spin.",
        "features": [
            "100 sq inch head size",
            "Vibration-dampening handle",
            "Pre-strung with high-tension gut"
        ]
    },
    {
        "title": "4-Person Weatherproof Camping Tent",
        "price": 180.00,
        "discountedPrice": 145.00,
        "image": "https://images.unsplash.com/photo-1504280387305-c79b57c603fc?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "Wilderness",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Spacious and easy-to-pitch dome tent featuring weather-resistant fabrics to keep you dry and comfortable during outdoor trips.",
        "features": [
            "Sets up in under 10 minutes",
            "Welded corners and inverted seams",
            "Includes rainfly and carry bag"
        ]
    },
    {
        "title": "Mummy Style Cold Weather Sleeping Bag",
        "price": 85.00,
        "discountedPrice": 65.00,
        "image": "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "TrailFoot",
        "condition": "New",
        "rating": "9.1/10",
        "description": "Designed to keep you warm in sub-freezing temperatures, this sleeping bag features extreme insulation and a draft tube.",
        "features": [
            "Rated for temperatures down to 15°F",
            "Contoured mummy shape traps heat",
            "Water-resistant ripstop shell"
        ]
    },
    {
        "title": "Waterproof Hiking Boots",
        "price": 130.00,
        "discountedPrice": 105.00,
        "image": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "TrailFoot",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Durable and supportive hiking boots featuring a breathable waterproof membrane and high-traction rubber outsoles.",
        "features": [
            "GORE-TEX waterproof lining",
            "EVA foam midsole for cushioning",
            "Advanced traction lugs"
        ]
    },
    {
        "title": "Carbon Fiber Telescopic Fishing Rod",
        "price": 65.00,
        "discountedPrice": 49.00,
        "image": "https://images.unsplash.com/photo-1530631673369-bc20fdb3228e?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "RiverKing",
        "condition": "New",
        "rating": "8.9/10",
        "description": "Highly portable, collapsible fishing rod made from high-density carbon fiber, perfect for backpackers and traveling anglers.",
        "features": [
            "Retracts to 16 inches for easy storage",
            "Corrosion-resistant guides",
            "Includes spinning reel"
        ]
    },
    {
        "title": "Inflatable Stand Up Paddle Board",
        "price": 299.00,
        "discountedPrice": 249.00,
        "image": "https://images.unsplash.com/photo-1510006733917-09d646abcc86?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "AquaGlide",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Extra-wide and stable inflatable paddle board bundle, ideal for all skill levels searching for aquatic adventures.",
        "features": [
            "Military-grade PVC construction",
            "Includes pump, paddle, and backpack",
            "Non-slip EVA deck pad"
        ]
    },
    {
        "title": "Weighted Speed Jump Rope",
        "price": 24.00,
        "discountedPrice": 18.00,
        "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
        "categorySlug": "sports-and-outdoors",
        "brand": "ZenCore",
        "condition": "New",
        "rating": "8.7/10",
        "description": "Enhance your cardio workouts with a high-speed jump rope featuring ergonomic handles and removable weight blocks.",
        "features": [
            "Tangle-free steel cable",
            "Smooth ball bearing system",
            "Fully adjustable length"
        ]
    },
    {
        "title": "Premium High-Protein Dog Food (30 lbs)",
        "price": 65.99,
        "discountedPrice": 55.99,
        "image": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "VitalPet",
        "condition": "New",
        "rating": "9.4/10",
        "description": "A nutrient-rich dry dog food formula made with real chicken to support healthy muscles, coat, and overall canine vitality.",
        "features": [
            "Real chicken is the #1 ingredient",
            "Fortified with live probiotics for digestion",
            "No artificial colors or flavors"
        ]
    },
    {
        "title": "Multi-Level Cat Tree Tower",
        "price": 110.00,
        "discountedPrice": 85.00,
        "image": "https://images.unsplash.com/photo-1623387641177-ce7a70a5c737?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "FelineFun",
        "condition": "New",
        "rating": "8.9/10",
        "description": "Give your cat the ultimate playground. Features multiple scratching posts, lounging hammocks, and elevated perches.",
        "features": [
            "Sisal-wrapped scratching posts",
            "Cozy plush-covered condos",
            "Anti-toppling safety strap included"
        ]
    },
    {
        "title": "Orthopedic Memory Foam Pet Bed",
        "price": 75.00,
        "discountedPrice": 59.00,
        "image": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "RestfulPaws",
        "condition": "New",
        "rating": "9.7/10",
        "description": "Soothe your pet's aching joints with a premium memory foam bed, featuring a cozy wrap-around bolster design.",
        "features": [
            "Medical-grade memory foam base",
            "Removable, machine-washable cover",
            "Water-resistant inner liner"
        ]
    },
    {
        "title": "Heavy-Duty Retractable Dog Leash",
        "price": 25.00,
        "discountedPrice": 19.50,
        "image": "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "WalkMaster",
        "condition": "New",
        "rating": "9.1/10",
        "description": "Give your dog freedom while keeping control with this 16-foot retractable tape leash designed for dogs up to 110 lbs.",
        "features": [
            "One-handed brake and lock system",
            "Tangle-free 360-degree tape movement",
            "Ergonomic anti-slip grip"
        ]
    },
    {
        "title": "Clumping Clay Cat Litter (40 lbs)",
        "price": 22.99,
        "discountedPrice": 18.99,
        "image": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "FreshKitty",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Ultra-absorbent clumping cat litter with advanced odor control technology that traps liquid and smells instantly.",
        "features": [
            "99.9% Dust-free formula",
            "Hard clumping for easy scooping",
            "14-day odor control guarantee"
        ]
    },
    {
        "title": "5-Gallon Glass Aquarium Kit",
        "price": 85.00,
        "discountedPrice": 70.00,
        "image": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "AquaHome",
        "condition": "New",
        "rating": "8.8/10",
        "description": "A beautiful portrait-style glass aquarium kit perfect for betta fish, featuring a hidden filtration system and LED lighting.",
        "features": [
            "Sleek curved glass front",
            "Adjustable daylight/moonlight LEDs",
            "Includes 3-stage filter pump"
        ]
    },
    {
        "title": "Large Wrought Iron Bird Cage",
        "price": 140.00,
        "discountedPrice": 115.00,
        "image": "https://images.unsplash.com/photo-1552728089-571ebdcdbe15?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "AvianNest",
        "condition": "New",
        "rating": "9.0/10",
        "description": "A spacious and secure wrought iron cage for parrots and cockatiels, featuring multiple perches and easy-to-clean slide-out trays.",
        "features": [
            "Non-toxic powder-coated finish",
            "Rolling caster stand included",
            "Multiple stainless steel feeding bowls"
        ]
    },
    {
        "title": "Silent Spinner Hamster Wheel",
        "price": 15.99,
        "discountedPrice": 12.99,
        "image": "https://images.unsplash.com/photo-1425082661705-1834bfd08dca?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "CritterCare",
        "condition": "New",
        "rating": "8.7/10",
        "description": "Let your small pet exercise without the squeaky noise. This wheel utilizes dual ball bearings for ultra-smooth and silent spinning.",
        "features": [
            "Completely silent operation",
            "Solid running surface protects tails",
            "Can be free-standing or wire-mounted"
        ]
    },
    {
        "title": "Airline Approved Pet Carrier",
        "price": 45.00,
        "discountedPrice": 35.00,
        "image": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "TravelPaws",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Travel in style and comfort with this soft-sided, breathable pet carrier designed to fit perfectly under airline seats.",
        "features": [
            "Breathable mesh windows",
            "Removable fleece pet bed",
            "Padded shoulder strap"
        ]
    },
    {
        "title": "Self-Cleaning Slicker Brush",
        "price": 18.00,
        "discountedPrice": 14.50,
        "image": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "GroomPro",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Easily remove loose hair, tangles, and dander from your pet's coat. Press the button to retract bristles and wipe hair away.",
        "features": [
            "Retractable bristles for easy cleaning",
            "Fine bent wires don't scratch skin",
            "Comfort-grip anti-slip handle"
        ]
    },
    {
        "title": "Indestructible Rubber Dog Chew Toy",
        "price": 16.50,
        "discountedPrice": 12.50,
        "image": "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
        "categorySlug": "animal-and-pets",
        "brand": "ToughChew",
        "condition": "New",
        "rating": "9.0/10",
        "description": "Keep aggressive chewers entertained for hours with this ultra-durable, natural rubber chew toy that also cleans teeth.",
        "features": [
            "100% natural non-toxic rubber",
            "Hollow center for hiding treats",
            "Textured surface massages gums"
        ]
    },
    {
        "title": "Heavy-Duty 2200W Portable Inverter Generator",
        "price": 850.00,
        "discountedPrice": 799.00,
        "image": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "VoltMaster",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Provide reliable, clean power to your job site or RV with this ultra-quiet, portable inverter generator.",
        "features": [
            "2200 starting watts / 1800 running watts",
            "Ultra-quiet 48 dBA operation",
            "CO Minder carbon monoxide shutdown sensor"
        ]
    },
    {
        "title": "Electric Portable Concrete Mixer",
        "price": 320.00,
        "discountedPrice": 285.00,
        "image": "https://images.unsplash.com/photo-1504307651254-35680f356fce?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "BuildPro",
        "condition": "New",
        "rating": "8.8/10",
        "description": "Mix concrete, stucco, and mortar effortlessly on residential job sites with this mobile 4.2 cubic foot drum mixer.",
        "features": [
            "1/2 HP electric motor",
            "Large 9-inch flat-free wheels",
            "Direct drive gearbox"
        ]
    },
    {
        "title": "5500 lb Capacity Manual Pallet Jack",
        "price": 450.00,
        "discountedPrice": 395.00,
        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "LiftQuip",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Essential warehouse equipment engineered for smoothly lifting and transporting heavy pallets across concrete floors.",
        "features": [
            "High-tensile steel construction",
            "Polyurethane non-marring wheels",
            "3-position hand control"
        ]
    },
    {
        "title": "30-Inch High Velocity Industrial Fan",
        "price": 185.00,
        "discountedPrice": 155.00,
        "image": "https://images.unsplash.com/photo-1565158679092-23910c2c31c8?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "AirForce",
        "condition": "New",
        "rating": "9.2/10",
        "description": "Keep large garages, workshops, and barns cool and ventilated with this powerful heavy-duty pedestal fan.",
        "features": [
            "3-speed thermally protected motor",
            "All-metal housing and blades",
            "Adjustable tilt and height"
        ]
    },
    {
        "title": "140 Amp MIG/Flux Core Welder",
        "price": 399.00,
        "discountedPrice": 349.00,
        "image": "https://images.unsplash.com/photo-1504917595497-6cb16f0ce321?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "MetalMelt",
        "condition": "New",
        "rating": "9.6/10",
        "description": "A versatile and beginner-friendly welding machine capable of handling MIG and flux-cored welding on mild steel.",
        "features": [
            "Plugs into standard 120V household outlets",
            "Infinitely adjustable wire feed speed",
            "Includes welding gun and ground clamp"
        ]
    },
    {
        "title": "20-Inch Gas Powered Chainsaw",
        "price": 250.00,
        "discountedPrice": 210.00,
        "image": "https://images.unsplash.com/photo-1551000678-fc7730e167ff?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "LumberJack",
        "condition": "New",
        "rating": "9.1/10",
        "description": "Tackle thick trees, storm cleanup, and firewood cutting with this powerful 50cc 2-cycle gas chainsaw.",
        "features": [
            "Anti-vibration handle system",
            "Automatic chain oiler",
            "Tool-less chain tensioning"
        ]
    },
    {
        "title": "3200 PSI Gas Pressure Washer",
        "price": 380.00,
        "discountedPrice": 330.00,
        "image": "https://images.unsplash.com/photo-1581092523293-272e0fba4536?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "BlastClean",
        "condition": "New",
        "rating": "9.4/10",
        "description": "Strip away tough dirt, grime, and old paint from driveways, siding, and vehicles with extreme water pressure.",
        "features": [
            "212cc OHV gas engine",
            "Includes 5 quick-connect nozzles",
            "Heavy-duty axial cam pump"
        ]
    },
    {
        "title": "10-Inch Benchtop Drill Press",
        "price": 199.00,
        "discountedPrice": 169.00,
        "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "PrecisionDrill",
        "condition": "New",
        "rating": "9.3/10",
        "description": "Achieve perfectly straight and accurate holes in wood and metal with this variable speed benchtop drill press.",
        "features": [
            "5 operating speeds",
            "Cast iron base and work table",
            "Built-in laser guide system"
        ]
    },
    {
        "title": "Mini Metal Lathe Machine",
        "price": 750.00,
        "discountedPrice": 690.00,
        "image": "https://images.unsplash.com/photo-1504917595497-6cb16f0ce321?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "ForgeCraft",
        "condition": "New",
        "rating": "8.9/10",
        "description": "A precision metalworking lathe designed for turning, drilling, and threading small metal and plastic parts.",
        "features": [
            "7-inch swing over bed",
            "Continuously variable spindle speed",
            "Precision V-way bed"
        ]
    },
    {
        "title": "Universal Forklift Replacement Seat",
        "price": 120.00,
        "discountedPrice": 95.00,
        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "LiftQuip",
        "condition": "New",
        "rating": "8.8/10",
        "description": "Improve operator comfort and safety with this heavy-duty, highly adjustable vinyl suspension seat for industrial vehicles.",
        "features": [
            "Retractable seat belt included",
            "Waterproof PVC outer layer",
            "Adjustable backrest and slide rails"
        ]
    },
    {
        "title": "3-Ton Low Profile Hydraulic Floor Jack",
        "price": 165.00,
        "discountedPrice": 140.00,
        "image": "https://images.unsplash.com/photo-1606184594248-1851e3e78a2c?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "AutoLift",
        "condition": "New",
        "rating": "9.7/10",
        "description": "A rapid-lift steel and aluminum floor jack, featuring a low profile design to slip under lowered and high-performance vehicles.",
        "features": [
            "Dual piston rapid pump technology",
            "3-ton (6,000 lb) lifting capacity",
            "Built-in safety overload system"
        ]
    },
    {
        "title": "10-Inch Jobsite Table Saw",
        "price": 350.00,
        "discountedPrice": 299.00,
        "image": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
        "categorySlug": "machinery-tools",
        "brand": "CutMaster",
        "condition": "New",
        "rating": "9.5/10",
        "description": "Deliver professional, precise rips on the jobsite with this portable table saw featuring a robust rolling stand.",
        "features": [
            "15-Amp high-torque motor",
            "Rack and pinion telescoping fence",
            "On-board storage for accessories"
        ]
    }
];

const SeedData = () => {
    const [status, setStatus] = useState("Ready to upload");

    const handleUpload = async () => {
        setStatus("Uploading... Please wait.");
        try {
            const productsRef = collection(db, "products");

            // Loop through the array and upload each one to Firebase
            for (const product of productsToUpload) {
                await addDoc(productsRef, product);
            }

            setStatus(`Success! Uploaded ${productsToUpload.length} products to Firebase.`);
        } catch (error) {
            console.error("Error uploading products:", error);
            setStatus("Error: Check console.");
        }
    };

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Database Bulk Importer</h2>
                <p className="mb-6 text-gray-600">Clicking this button will upload {productsToUpload.length} products to your Firestore database.</p>
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Upload Data to Firebase
                </button>
                <p className="mt-4 font-medium text-green-600">{status}</p>
            </div>
        </div>
    );
};

export default SeedData;