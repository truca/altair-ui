import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./contexts/StoreProvider";
import AuthProvider from "./contexts/AuthProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import { ApolloWrapper } from "../lib/apollo/apollo-wrapper";
import { verifyIdToken } from "@/lib/firebase/firebaseAdmin";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function fetchUser(cookieStore: ReadonlyRequestCookies) {
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { props: { user: {} } };
  }

  try {
    const user = await verifyIdToken(token);
    return { props: { user } };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
  // user: any | null; // You can define a better User type
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = cookies();
  const currentUrl = headers().get("referer");
  const { props, redirect: { destination } = {} } =
    await fetchUser(cookieStore);

  console.log({ props, destination, currentUrl });

  if (currentUrl && destination && !currentUrl.includes(destination)) {
    redirect(destination);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ApolloWrapper>
            <AuthProvider>{children}</AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
