import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Preload Firebase Auth Scripts */}
        <link 
          rel="preload"
          href="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js"
          as="script"
          type="module"
          crossOrigin="anonymous"
        />
        <link 
          rel="preload"
          href="https://apis.google.com/js/api.js"
          as="script"
          crossOrigin="anonymous"
        />
        
        {/* Meta tags for Firebase Auth */}
        <meta name="google-signin-client_id" content="760347188535-web" />
        <meta name="google-signin-scope" content="profile email" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
