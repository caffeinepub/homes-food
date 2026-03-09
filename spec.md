# Homes Food

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full restaurant marketing website for Homes Food, a home-chef food service in Lahore, Pakistan
- Sticky navigation header with brand logo and Order Now CTA
- Hero section: full-width food image background, dark gradient overlay, headline, subheadline, two CTA buttons, trust indicators (rating, delivery, taste, hours)
- About section: brand story, emotional messaging, homemade warmth narrative
- Menu/Specialties section: food cards with images, descriptions, and Order buttons for Chicken Biryani, Chicken Qorma, Traditional Desi Meals, Homestyle Rice & Curry, Daily Mess Meals
- Mess/Meal Plan section: features list, Book Your Meal Plan CTA
- Why Choose Us section: 5 icon-based feature highlights
- Customer Reviews section: 3–4 testimonial cards with star ratings
- Order/Contact section: Call to Order + Book Delivery CTAs, phone number, location
- Delivery Area section: Serving Lahore messaging
- Footer: brand name, quick links, social icon placeholders, copyright
- Smooth scroll animations throughout
- Mobile-first responsive layout

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Generate brand hero image (Pakistani home-cooked meal, rich warm tones)
2. Generate individual dish images for each menu card
3. Select no additional Caffeine components (static marketing site)
4. Generate minimal Motoko backend for order/contact form submissions and meal plan booking requests
5. Build full React frontend:
   - Google Fonts: Playfair Display + Poppins
   - Color tokens: Deep Warm Red #9E2A2B, Warm Cream #F7F3E9, Golden Spice #D4A017, Charcoal #2B2B2B
   - Sticky header with mobile hamburger menu
   - Hero, About, Menu, Meal Plans, Why Choose Us, Reviews, Order/Contact, Delivery Area, Footer sections
   - Scroll-triggered fade-in animations via Intersection Observer
   - data-ocid markers on all interactive surfaces
