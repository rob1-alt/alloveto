## Chatbot DeepInfra (Agent)

Ajout d'un chatbot propulsé par DeepInfra via une route API Next.js.

### Configuration

1. Créez une clé API sur DeepInfra et définissez les variables d'environnement suivantes (par exemple dans un fichier `.env.local` à la racine):

```
DEEPINFRA_API_KEY=your_deepinfra_api_key
DEEPINFRA_MODEL=mistralai/Mistral-Small-24B-Instruct-2501
```

2. Redémarrez le serveur de dev.

### Utilisation

- API: `POST /api/chat` avec un corps JSON contenant `messages: { role, content }[]` (compatible OpenAI).
- UI: page `~/src/app/chat/page.tsx` accessible via l'URL `/chat` et le lien "Chat" dans la barre de navigation.

Le modèle par défaut est `meta-llama/Meta-Llama-3.1-8B-Instruct`. Vous pouvez passer `model` dans le body pour le changer.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Scripts utiles

- `fetch:vets`: Récupère les cabinets vétérinaires à Paris via Google Places API et écrit vers `public/veto-cabinet.md`.

### Récupération des cabinets vétérinaires

1. Activez l'API Places et créez une clé Google.
2. Exportez la clé dans votre shell: `export GOOGLE_MAPS_API_KEY=VOTRE_CLE`.
3. Exécutez: `npm run fetch:vets`.
4. Le fichier est généré à `public/veto-cabinet.md`.
