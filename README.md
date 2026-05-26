# Pendle YT Timing Strategy Analyzer (Web Dashboard)

A modern, fast, and minimalist web-based analytics dashboard built with Next.js, TypeScript, and Tailwind CSS. It ports the core analytics and math calculations of the Pendle YT Timing Strategy to the web, allowing users to analyze pool yields, fetch live transaction data, and visualize the YT Fair Value Curve to maximize points earned.

---

## Features

- **Cyberpunk Brutalist UI**: Modern dark theme with geometric structures, sharp corners (`rounded-none`), and striking tech-green highlights.
- **On-chain Data Orchestration**: Queries the live Pendle API concurrently for market APY details, OHLCV token prices, and swap event transactions (with automatic pagination and rate-limit backoffs).
- **TypeScript Strategy Math Engine**: A pure TypeScript port of the legacy calculations, completely eliminating heavy Python/Pandas dependencies while maintaining mathematical precision.
- **Dynamic Dual-Axis Charting**: Implements interactive line visualizations using Recharts, plotting YT Price and Points Earned against the Fair Value Curve.
- **Multi-Language Support (i18n)**: Fully translated in English (EN), Ukrainian (UA), and Russian (RU) with instant language selection toggles.
- **Vercel Optimized**: Pre-configured structure ready for production deployment on Vercel.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Visualization**: [Recharts](https://recharts.org/)
- **Code Linting**: [ESLint](https://eslint.org/)

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18.17+ or newer) installed.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd Pendle-YT-Timing-Strategy-Analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Local Development

Run the development server locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive dashboard.

### Build and Compilation Check

Verify type checking, linter checks, and static export build compilation:
```bash
npm run build && npm run lint
```
