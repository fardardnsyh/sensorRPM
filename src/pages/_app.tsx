import Head from "next/head";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Cover Letter Generator 📝</title>
        <meta
          name="description"
          content="Cover Letter Generator 📝- Create professional, personalized, and effective cover letters effortlessly with the help of AI."
        />
        <meta
          name="keywords"
          content="cover letter generator, cover letter email generator, job application tool, cover letter writing assistance, personalized cover letter generator, professional cover letter creator, smart cover letter builder"
        />
        <meta property="og:title" content="Cover Letter Generator 📝" />
        <meta
          property="og:description"
          content="Cover Letter Generator 📝- Create professional, personalized, and effective cover letters effortlessly with the help of AI."
        />
        <meta name="twitter:title" content="Cover Letter Generator 📝" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:description"
          content="Cover Letter Generator 📝- Create professional, personalized, and effective cover letters effortlessly with the help of AI."
        />
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
