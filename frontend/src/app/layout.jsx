import { Kanit } from "next/font/google";
import "./globals.css";
import "./globalicon.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserProvider } from "../context/UserContext";
import { PageWarpper } from "../components/PageWarpper";
import { FavoriteAndBlogProvider } from "@/context/FavoriteAndBlogContext";

const kanit = Kanit({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"]
});

export const metadata = {
  title: "FF7 REBRITH",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <UserProvider>
        <FavoriteAndBlogProvider>
          <body className={kanit.className}>
            <PageWarpper>
              {children}
            </PageWarpper>
          </body>
        </FavoriteAndBlogProvider>
      </UserProvider>
    </html>
  );
}
