# Stitch Finance

A modern, secure fintech application built with React and Vite. Experience the future of banking with zero-fee transactions, AI-powered insights, and military-grade security.

![Stitch Finance](https://img.shields.io/badge/React-19.2.4-blue) ![Vite](https://img.shields.io/badge/Vite-8.0.4-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4.2.2-cyan)

## ✨ Features

- 🚀 **Zero Transaction Fees** - Send and receive money without any hidden costs
- 🔒 **Bank-Level Security** - 256-bit military-grade encryption
- 🤖 **AI Spending Insights** - Personalized financial recommendations
- 💳 **Instant Card Freeze** - Protect your account with one tap
- 📊 **Real-time Dashboard** - Track your finances with live updates
- 🌍 **Global Coverage** - Available in 150+ countries
- 📱 **Mobile-First Design** - Optimized for all devices
- 🎨 **Dark Mode Ready** - Automatic theme switching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stitch-finance.git
cd stitch-finance
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
stitch/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components (Button, Modal, etc.)
│   │   ├── features/      # Feature-specific components
│   │   ├── hero/          # Landing page hero components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── onboarding/    # Onboarding flow
│   │   ├── pricing/       # Pricing components
│   │   └── stats/         # Statistics display
│   ├── contexts/          # React contexts and state management
│   ├── data/              # Mock data and constants
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with Hooks
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Development**: ESLint, PostCSS, Autoprefixer

## 🎨 Design System

### Colors
- **Primary**: Blue to Purple gradient (`from-blue-600 to-purple-600`)
- **Success**: Green variants (`green-500`, `green-600`)
- **Warning**: Orange variants (`orange-500`, `orange-600`)
- **Error**: Red variants (`red-500`, `red-600`)
- **Background**: Gray scale (`gray-50` to `gray-900`)

### Typography
- **Primary Font**: System font stack (sans-serif)
- **Headings**: Bold weights with tight line heights
- **Body**: Regular weight with optimal readability

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Rounded corners with subtle shadows
- **Forms**: Clean inputs with focus states
- **Modals**: Overlay with backdrop blur

## 📱 Pages & Features

### Landing Page (`/`)
- Hero section with call-to-action
- Statistics showcase
- Feature highlights
- Onboarding preview
- Pricing tiers

### Demo Dashboard (`/demo`)
- Financial overview cards
- Recent transactions list
- Quick action buttons
- Account status indicators

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

This project uses ESLint with React-specific rules and the new React Compiler for optimized performance.

### State Management

Zustand is used for global state management with the following stores:
- User authentication state
- Transaction data
- UI state (modals, loading, etc.)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push
3. Custom domain support included

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy with one click

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vite for the lightning-fast build tool
- Lucide for the beautiful icons

---

**Built with ❤️ by the me**
