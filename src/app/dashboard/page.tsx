
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileText, Video, ListChecks, Wand2, Loader2, AspectRatio } from 'lucide-react';
import { extractLyrics, type ExtractLyricsInput } from '@/ai/flows/extract-lyrics';
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // For potential upload progress

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['audio/mpeg', 'audio/wav', 'audio/mp3'].includes(file.type)) {
        setError('Invalid file type. Please upload an MP3 or WAV file.');
        toast({ title: "Invalid File Type", description: "Please upload an MP3 or WAV file.", variant: "destructive"});
        setAudioFile(null);
        setAudioDataUri(null);
        return;
      }
      setAudioFile(file);
      setError(null);
      setLyrics(null); // Reset lyrics if new file is chosen

      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress(percentage);
        }
      };
      reader.onloadend = () => {
        setAudioDataUri(reader.result as string);
        setProgress(100);
         toast({ title: "File Ready", description: `${file.name} is ready for lyric extraction.`});
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive"});
        setProgress(0);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleExtractLyrics = async () => {
    if (!audioDataUri || !audioFile) {
      setError('Please select an audio file first.');
      toast({ title: "No File Selected", description: "Please select an audio file to extract lyrics.", variant: "destructive"});
      return;
    }
    setIsLoading(true);
    setError(null);
    setLyrics(null);

    try {
      const input: ExtractLyricsInput = { audioDataUri };
      const result = await extractLyrics(input);
      setLyrics(result.lyrics);
      toast({ title: "Lyrics Extracted!", description: "Successfully extracted lyrics from your audio."});
    } catch (e) {
      console.error('Error extracting lyrics:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to extract lyrics: ${errorMessage}`);
      toast({ title: "Extraction Failed", description: `Could not extract lyrics. ${errorMessage}`, variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold mb-8">Lykvid Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Upload & Extraction */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><UploadCloud className="mr-2 h-6 w-6 text-primary" /> Upload Audio</CardTitle>
            <CardDescription>Select your song file to begin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="audio-file" className="text-sm font-medium">Audio File (MP3, WAV)</Label>
              <Input
                id="audio-file"
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/wav"
                onChange={handleFileChange}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            {audioFile && progress > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Processing: {audioFile.name}</p>
                <Progress value={progress} className="w-full h-2" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleExtractLyrics}
              disabled={!audioDataUri || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Extract Lyrics
            </Button>
          </CardFooter>
        </Card>

        {/* Column 2: Lyrics & Sync */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" /> Extracted Lyrics</CardTitle>
            <CardDescription>View and refine your song's lyrics. Synchronization tools coming soon.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lyrics ? (
              <Textarea
                value={lyrics}
                readOnly // Or implement editing functionality
                rows={15}
                className="font-mono text-sm bg-background/50"
                placeholder="Lyrics will appear here..."
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted rounded-md p-4">
                <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {isLoading ? 'Extracting lyrics, please wait...' : 'Lyrics will appear here after extraction.'}
                </p>
              </div>
            )}
            {lyrics && (
                <div className="p-4 border rounded-md bg-card/50">
                    <h3 className="font-headline text-lg mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Lyric Synchronization (Coming Soon)</h3>
                    <p className="text-sm text-muted-foreground">
                        This section will allow you to fine-tune lyric timing with the audio playback. 
                        Visualize phrases and adjust their start and end points for perfect synchronization.
                    </p>
                    <Button variant="outline" className="mt-4" disabled>Adjust Timing</Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Column 3: Video Generation */}
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Video className="mr-2 h-6 w-6 text-primary" /> Video Generation</CardTitle>
            <CardDescription>Create your lyric videos once lyrics are ready and synchronized.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {lyrics ? 'Lyrics are ready! Configure your video settings below.' : 'Please extract lyrics first to enable video generation.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center">
                            <AspectRatio className="mr-2 h-5 w-5 text-primary" /> Landscape Video (16:9)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Ideal for YouTube and desktop viewing.</p>
                        <Button className="w-full" disabled={!lyrics || isLoading}>Generate Landscape Video</Button>
                    </CardContent>
                     <CardFooter>
                        <p className="text-xs text-muted-foreground">Preview will appear here.</p>
                    </CardFooter>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center">
                            <Smartphone className="mr-2 h-5 w-5 text-primary transform rotate-90" /> Portrait Video (9:16)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Perfect for TikTok, Instagram Reels, and mobile.</p>
                        <Button className="w-full" disabled={!lyrics || isLoading}>Generate Portrait Video</Button>
                    </CardContent>
                     <CardFooter>
                        <p className="text-xs text-muted-foreground">Preview will appear here.</p>
                    </CardFooter>
                </Card>
            </div>
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle className="font-headline">Video Customization</AlertTitle>
              <AlertDescription>
                Advanced customization options (fonts, colors, backgrounds, animations) will be available here soon!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
