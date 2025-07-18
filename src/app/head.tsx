export default function Head() {
  return (
    <>
      <title>EDTECH AI</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="firebase-auth" content="true" />
      <meta name="firebase-domain" content={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN} />
      <meta name="firebase-api-key" content="configured" />
    </>
  )
}
