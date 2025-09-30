'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import CubesBg from '@/components/magicui/cubes-bg';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <CubesBg />

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-32">
        <div className="relative z-10 mx-auto flex max-w-[64rem] flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            AutoFlex Easy: The Ultimate Tool for Amazon Flex Drivers
          </h1>

          <p className="max-w-[48rem] text-base sm:text-lg md:text-xl opacity-90">
            Effortlessly capture blocks, maximize your earnings, and take control of your
            Amazon Flex delivery schedule with our powerful tool.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signin"
              className={cn(
                buttonVariants({ size: 'xl' }),
                'rounded-full border-2 border-primary dark:border-white font-bold text-white'
              )}
            >
              Get Started
            </Link>

            <a
              href="https://github.com/DavidFlautero/felxeasy"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'xl' }),
                'rounded-full border-2 border-primary dark:border-white font-semibold'
              )}
            >
              GitHub <GitHubLogoIcon className="ml-2" />
            </a>
          </div>

          <div className="mt-2 text-sm md:text-base flex items-center gap-2 opacity-90">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
            Fixed pricing, no management fees.
          </div>
        </div>
      </div>
    </section>
  );
}
