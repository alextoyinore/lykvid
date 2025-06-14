
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Music, Film, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Lyric Extraction',
      description: 'Automatically transcribe and extract lyrics from your audio files using cutting-edge AI.',
      dataAiHint: 'artificial intelligence'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Accurate Lyric Synchronization',
      description: 'Our smart tools ensure your lyrics are perfectly timed with the music, phrase by phrase.',
      dataAiHint: 'music sync'
    },
    {
      icon: <Film className="h-8 w-8 text-primary" />,
      title: 'Dual Format Video Generation',
      description: 'Create stunning lyric videos in both landscape (16:9) and portrait (9:16) formats.',
      dataAiHint: 'video editing'
    },
    {
      icon: <Music className="h-8 w-8 text-primary" />,
      title: 'Broad Audio Format Support',
      description: 'Upload your songs in popular formats like MP3, WAV, and more.',
      dataAiHint: 'audio waveform'
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-background to-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Create <span className="text-primary">Stunning</span> Lyric Videos, Effortlessly.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
            Lykvid uses AI to extract lyrics and helps you generate professional lyric videos in minutes. Perfect for artists, creators, and music lovers.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/dashboard">Get Started Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-lg transition-transform hover:scale-105">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder Image Section (Optional) */}
      <section className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
            <Image
                src="https://placehold.co/1200x600.png?bg=2E2E2E&fc=A78BFA"
                alt="Lykvid App Showcase"
                width={1200}
                height={600}
                className="rounded-lg shadow-2xl mx-auto"
                data-ai-hint="abstract music"
            />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Lykvid?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to bring your music to life with engaging visuals.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="font-headline mt-4 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Amplify Your Music?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Sign up today and start creating captivating lyric videos that resonate with your audience.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/dashboard">Start Creating for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
