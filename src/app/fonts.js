import { Geist, Montserrat,Roboto } from 'next/font/google'


export const geist = Geist({
    subsets: ['latin'],
    weight: "200"
})

export const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
})

export const roboto = Roboto({
  subsets: ["latin"],
  weight:"300",
});