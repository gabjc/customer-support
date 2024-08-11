import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ranger Chatbot",
  description: "Customer support AI for Ranger, an application that provides users with curated bucket lists for road trips based on their starting location, destination, specific stops, and personal preferences or restrictions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
