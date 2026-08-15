# SportNest Client

## Sports Facility Booking Platform — React.js (MERN Stack)

### Live URL
https://your-client.vercel.app

### Purpose
A full-stack sports facility booking platform allowing users to discover and book premium sports facilities across Bangladesh.

### NPM Packages Used
| Package | Purpose |
|---------|---------|
| react + react-dom | Core UI library |
| react-router-dom | Client-side routing |
| @tanstack/react-query | Server state management |
| axios | HTTP client |
| better-auth | Authentication (email + Google OAuth) |
| framer-motion | Animations |
| react-hot-toast | Toast notifications |
| lucide-react | Icons |
| vite | Build tool |

### Features
- Email/password registration and login
- Google OAuth login
- Browse all facilities with search and filter
- Book facilities with time slot selection
- Manage your own facilities (add, edit, delete)
- View and cancel your bookings
- Dark/Light theme toggle
- Fully responsive (mobile, tablet, desktop)
- Custom 404 page

### Setup (Local)
```bash
npm install
cp .env.example .env
# fill in .env values
npm run dev
```

### Local .env
```
VITE_API_URL=http://localhost:5000/api
VITE_BETTER_AUTH_URL=http://localhost:5000
VITE_CLIENT_URL=http://localhost:5173
VITE_IMGBB_API_KEY=your_imgbb_key
```

### Vercel .env (Production)
```
VITE_API_URL=https://your-server.vercel.app/api
VITE_BETTER_AUTH_URL=https://your-server.vercel.app
VITE_CLIENT_URL=https://your-client.vercel.app
VITE_IMGBB_API_KEY=your_imgbb_key
```
