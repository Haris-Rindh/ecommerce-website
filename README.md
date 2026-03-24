<h1>🌍 TrendTrove — B2B E-Commerce Platform</h1>

<p>
A scalable and modern <b>B2B e-commerce platform</b> designed to connect businesses,
manage bulk transactions, and streamline product discovery with a clean and responsive UI.
</p>

<hr/>

<h2>🚀 Features</h2>
<ul>
  <li>🛒 Product browsing & category filtering</li>
  <li>🔍 Advanced search functionality</li>
  <li>👤 User authentication (Login/Register)</li>
  <li>❤️ Wishlist & Cart management</li>
  <li>📦 Order management system</li>
  <li>🧑‍💼 Admin dashboard (Bulk import, control panel)</li>
  <li>🔥 Firebase integration (Auth + Database)</li>
  <li>🎨 Fully responsive UI with Tailwind CSS</li>
</ul>

<hr/>

<h2>📁 Project Structure</h2>

<pre>
src/
│
├── assets/                 
│   └── index.css              
│
├── components/             
│   ├── home/                   
│   │   ├── Discount_Box.jsx
│   │   ├── countdown.jsx
│   │   ├── deals.jsx
│   │   ├── extra_service.jsx
│   │   ├── herosection.jsx
│   │   ├── homeitems.jsx
│   │   ├── Inquiry.jsx
│   │   ├── recommended_items.jsx
│   │   └── suppliers.jsx
│   │
│   └── layout/                
│       ├── Header.jsx
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       └── Newsletter.jsx
│
├── context/                
│   ├── GlobalState.jsx         
│   └── ToastContext.jsx        
│
├── pages/                  
│   ├── Admin/                  
│   │   ├── AdminDashboard.jsx
│   │   └── SeedData.jsx
│   │
│   ├── Auth/                   
│   │   └── Login.jsx
│   │
│   ├── Product/                
│   │   ├── ProductPage.jsx    
│   │   ├── DetailsTab.jsx
│   │   └── RelatedProducts.jsx
│   │
│   ├── Profile/ 
│   │   ├── Profile.jsx
│   │   ├── Saved.jsx
│   │   └── Messages.jsx
│   │
│   ├── Cart.jsx
│   ├── CategoryPage.jsx
│   ├── Checkout.jsx
│   ├── Home.jsx                
│   ├── Placeholder.jsx
│   └── SearchPage.jsx
│
├── routes/                 
│   └── ProtectedRoute.jsx
│
├── App.jsx                 
├── main.jsx                
└── firebase.js
</pre>

<hr/>

<h2>⚙️ Installation & Setup</h2>

<h3>1. Clone the repository</h3>
<pre>
git clone https://github.com/Haris-Rindh/ecommerce-website.git
cd ecommerce-platform
</pre>

<h3>2. Install dependencies</h3>
<pre>
npm install
</pre>

<h3>3. Setup environment variables</h3>
<p>Create a <code>.env</code> file and add:</p>

<pre>
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
</pre>

<hr/>

<h2>🧪 Run Locally</h2>

<pre>
npm run dev
</pre>

<p>App will be available at:</p>
<p><b>https://trendtrove-pi.vercel.app/</b></p>

<hr/>

<h2>🌐 Deployment</h2>

<table>
  <tr>
    <th>Environment</th>
    <th>Link</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>🔥 Local Development</td>
    <td>http://localhost:5173</td>
    <td>✅ Ready</td>
  </tr>
  <tr>
    <td>🚀 Production</td>
    <td>—</td>
    <td>⏳ Pending</td>
  </tr>
</table>

<hr/>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><b>Frontend:</b> React.js (Vite)</li>
  <li><b>Styling:</b> Tailwind CSS</li>
  <li><b>State Management:</b> React Context API</li>
  <li><b>Backend / DB:</b> Firebase</li>
  <li><b>Routing:</b> React Router</li>
</ul>

<hr/>

<h2>📌 Future Improvements</h2>
<ul>
  <li>💳 Payment gateway integration</li>
  <li>📊 Advanced analytics dashboard</li>
  <li>🌍 Multi-language support</li>
  <li>📱 Mobile app version</li>
  <li>🔐 Role-based access control</li>
</ul>

<hr/>

<h2>🤝 Contributing</h2>
<ol>
  <li>Fork the repository</li>
  <li>Create a new branch</li>
  <li>Make your changes</li>
  <li>Submit a pull request</li>
</ol>

<hr/>

<h2>📄 License</h2>
<p>This project is licensed under the <b>MIT License</b>.</p>
