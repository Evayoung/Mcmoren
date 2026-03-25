# Mcmoren Multiservices Limited — Official Website

A premium, high-performance, and cinematic web experience for Mcmoren Multiservices Limited, a leading Nigerian multiservice partner specializing in Logistics, Oil & Gas, and International Trade.

![Mcmoren Website](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=80)

## 🚀 Key Features

- **Cinematic Experience**: Ultra-smooth GSAP scroll-triggered animations with elegant blur-to-focus reveals.
- **Premium Design**: Modern, responsive UI with a refined Sky Blue branding palette and sophisticated dark mode aesthetics.
- **Service Categories**: Comprehensive showcases for Logistics & Haulage, Oil & Gas, and Import/Export services.
- **Interactive Stats**: Dynamic counters highlighting company achievements.
- **Contact & Enquiries**: Fully functional contact form integrated with **Formspree** for real-time lead generation.
- **Direct WhatsApp Chat**: One-click communication with the Mcmoren team.
- **Global Deployment**: CI/CD automated deployment to GitHub Pages via GitHub Actions.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+ Modules)
- **Animations**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) with ScrollTrigger
- **Form Handling**: [Formspree](https://formspree.io/)
- **Hosting & Deployment**: GitHub Pages & GitHub Actions

## 📦 Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Evayoung/Mcmoren-website.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Mcmoren-website
   ```
3. Serve the directory using any local web server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`.

### Form Setup

The contact form is currently using a placeholder endpoint. To receive emails at your specific address:
1. Create a free account at [Formspree](https://formspree.io/).
2. Create a new form and copy the endpoint URL.
3. Replace the `action` attribute in `contact.html` with your new URL:
   ```html
   <form action="https://formspree.io/f/your-id-here" method="POST" ...>
   ```

## 🚢 Deployment

This repository is configured with **GitHub Actions** for automatic deployment to GitHub Pages. 

When you push changes to the `main` branch:
1. The `.github/workflows/deploy.yml` workflow triggers.
2. The project is automatically built and deployed.
3. The live site will be available at your GitHub Pages URL (e.g., `https://evayoung.github.io/Mcmoren-website/`).

---

Developed with ❤️ by Olorundare Micheal.
