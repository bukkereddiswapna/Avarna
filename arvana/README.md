# ARVANA — Furniture Crafted for Living

A premium furniture business demo website built with React, TypeScript, Vite, Tailwind CSS, and React Router.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Notes

- This is a **frontend-only demo**. Cart, wishlist, checkout, and forms are simulated using React state and localStorage — there is no backend.
- The WhatsApp number is a placeholder. Update it in `src/data/config.ts` (`WHATSAPP_NUMBER`) before sending to a real client.
- Brand details (phone, email, address, hours, social links) also live in `src/data/config.ts`.
- Product data (16 items) lives in `src/data/products.ts` — easy to edit, add, or remove items.
- Images are pulled live from Unsplash, so an internet connection is needed to see them load.

## Tech stack

- React 19 + TypeScript
- Vite
- React Router v7
- Tailwind CSS v4
- Lucide React icons
