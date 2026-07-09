# 412 Studios

A music studio booking application built with Next.js, Prisma, and Stripe.

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Management

Push schema changes to your database:

```bash
npx prisma db push
```

Open Prisma Studio to manage your database:

```bash
npx prisma studio
```

## Email Integration

The application uses Resend for sending emails. To enable email functionality:

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Add your API key to the `.env` file:

```
RESEND_API_KEY=your_api_key
RESEND_FROM_EMAIL=your_verified_sender_email
```
