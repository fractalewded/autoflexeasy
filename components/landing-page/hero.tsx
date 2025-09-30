 'use client';

 import Link from 'next/link';
 import { siteConfig } from '@/config/site';
 import { cn } from '@/lib/utils';
 import { buttonVariants } from '@/components/ui/button';
 import Particles from '@/components/magicui/particles';
 import Ripple from '@/components/magicui/ripple';
 import DualGlow from '@/components/magicui/dual-glow';
 import { GitHubLogoIcon } from '@radix-ui/react-icons';
 import { useTheme } from 'next-themes';

 export default function HeroSection() {
   const { theme } = useTheme();

   return (
     <section className="relative w-full overflow-hidden">
       <div className="absolute inset-0 z-0">
        <Particles
         className="absolute inset-0"
          quantity={300}
          ease={80}
          color={theme === 'dark' ? '#FFFFFF' : '#000000'}
          refresh
        />
        <Ripple />
        <Particles
          className="absolute inset-0"
          quantity={220}               // un poco menos para look más limpio
          ease={80}
          color={theme === 'dark' ? '#FFFFFF' : '#000000'}
          refresh
        />
        <DualGlow />
       </div>

       <div className="container mx-auto px-4 py-12 md:py-16 lg:py-32">
         <div className="relative z-10 mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
           <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
             AutoFlex Easy: The Ultimate Tool for Amazon Flex Drivers
           </h1>
