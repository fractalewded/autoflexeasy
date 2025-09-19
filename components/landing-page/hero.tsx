'use client';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Particles from '@/components/magicui/particles';
import Ripple from '@/components/magicui/ripple';
import AnimatedGradientText from '@/components/magicui/animated-shiny-text';
import { ArrowRightIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
// ⛔️ AvatarCircles eliminado
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const { theme } = useTheme();

  // (opcional) mantuviste estos quotes aunque no se renderizan
  const quotes = [
    { text: "That's beautiful bro!", author: "dcodesdev", title: "TypeScript Developer", avatarFallback: "DC", avatarImg: "/images/dcodes.png" },
    { text: "If you've built this a few months ago, it would have saved me hours :D", author: "SuhailKakar", title: "Developer at joinOnboard", avatarFallback: "SK", avatarImg: "/images/SuhailKakar.jpg" },
    { text: "So cool, looks really clean. Any plan to open source it? ☺️ Wanna play with it!", author: "SaidAitmbarek", title: "Founder of microlaunch.net", avatarFallback: "SA", avatarImg: "/images/said.jpg" },
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(id);
  }, [quotes.length]);

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
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-32">
        <div className="relative z-10 mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
          {siteConfig?.links?.twitter ? (
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              <div
                className={cn(
                  'group rounded-full border border-black/5 bg-neutral-100 text-base text-secondary transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800',
                )}
              >
                <AnimatedGradientText className="inline-flex items-center justify-center px-4 py-2 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
                  <span
                    className={cn(
                      'inline animate-gradient bg-gradient-to-r from-[#b76a24] via-[#6a24b7] to-[#b76a24] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent',
                    )}
                  >
                    Follow the progress on X
                  </span>
                  <ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedGradientText>
              </div>
            </a>
          ) : null}

          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            AutoFlex Easy: The Ultimate Tool for Amazon Flex Drivers
          </h1>

          <div className="max-w-[42rem] rounded-full p-2 font-bold tracking-tight text-primary sm:text-xl sm:leading-8">
            Effortlessly capture blocks, maximize your earnings, and take control of your
            Amazon Flex delivery schedule with our powerful tool.
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: 'xl' }),
                'rounded-full border-2 border-primary dark:border-white font-bold text-white',
              )}
            >
              Get Started
            </Link>

            {siteConfig?.links?.github ? (
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'xl' }),
                  'rounded-full border-2 border-primary dark:border-white font-semibold',
                )}
              >
                GitHub <GitHubLogoIcon className="ml-2" />
              </a>
            ) : null}
          </div>

          {/* ⛔️ Se eliminó el bloque de avatares. Dejamos solo estrellas + texto */}
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-2">
            <div className="flex flex-row justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-yellow-200 text-yellow-300" />
              ))}
            </div>
            <span className="text-xs font-semibold">Join 160+ developers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
