import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Heart, Star, SlidersHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const outfits = [
  {
    id: 1,
    name: 'Opulent Ochre Sari',
    image: 'https://picsum.photos/seed/result1/600/900',
    aiReason: 'The vertical draping elongates your pear-shaped figure gracefully.',
    platform: 'Myntra',
    price: '₹7,899',
    rating: 4.8,
    reviews: 124,
    size: 'lg'
  },
  {
    id: 2,
    name: 'Midnight Bloom Anarkali',
    image: 'https://picsum.photos/seed/result2/600/800',
    aiReason: 'The A-line cut balances your proportions perfectly.',
    platform: 'Amazon',
    price: '₹4,200',
    rating: 4.5,
    reviews: 258,
    size: 'sm'
  },
  {
    id: 3,
    name: 'Ivory Dream Lehenga',
    image: 'https://picsum.photos/seed/result3/600/900',
    aiReason: 'Adds volume to the upper body, creating an hourglass illusion.',
    platform: 'Flipkart',
    price: '₹12,500',
    rating: 4.9,
    reviews: 88,
    size: 'lg'
  },
  {
    id: 4,
    name: 'Crimson Tide Kurta',
    image: 'https://picsum.photos/seed/result4/600/700',
    aiReason: 'The straight cut skims over the hips, creating a sleek silhouette.',
    platform: 'Meesho',
    price: '₹1,299',
    rating: 4.2,
    reviews: 512,
    size: 'sm'
  },
  {
    id: 5,
    name: 'Emerald Enchantress Gown',
    image: 'https://picsum.photos/seed/result5/600/950',
    aiReason: 'A floor-length gown that creates a stunning vertical line.',
    platform: 'Amazon',
    price: '₹9,999',
    rating: 4.7,
    reviews: 150,
    size: 'lg'
  },
  {
    id: 6,
    name: 'Sunset Hues Sharara',
    image: 'https://picsum.photos/seed/result6/600/850',
    aiReason: 'Flared bottoms balance wider hips, perfect for a pear shape.',
    platform: 'Myntra',
    price: '₹6,450',
    rating: 4.6,
    reviews: 95,
    size: 'sm'
  },
]

const ResultsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 border-b border-border">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="font-headline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Best Rating</DropdownMenuItem>
                <DropdownMenuItem>Best Match</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-foreground/70 hidden md:inline-block">Showing 24 outfits</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            <Badge variant="secondary" className="cursor-pointer">Occasion: Wedding <Trash2 className="ml-2 h-3 w-3" /></Badge>
            <Badge variant="secondary" className="cursor-pointer">Color: Gold <Trash2 className="ml-2 h-3 w-3" /></Badge>
            <Button variant="ghost" size="sm">Clear All</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
            {outfits.map((outfit) => (
              <Card key={outfit.id} className="group/card break-inside-avoid overflow-hidden border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:glow-gold">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link href={`/product/${outfit.id}`} passHref>
                      <Image
                        src={outfit.image}
                        alt={outfit.name}
                        width={600}
                        height={outfit.size === 'lg' ? 900 : 750}
                        className="w-full h-auto object-cover cursor-pointer"
                        data-ai-hint="fashion editorial"
                      />
                    </Link>
                     <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                       <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/50 hover:bg-background/80"><Heart className="h-4 w-4" /></Button>
                     </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <Link href={`/product/${outfit.id}`} passHref>
                      <h3 className="font-headline text-2xl text-primary cursor-pointer hover:underline">{outfit.name}</h3>
                    </Link>
                    <p className="text-sm text-foreground/70 italic">"{outfit.aiReason}"</p>
                    <div className="flex items-center justify-between">
                       <Badge variant="outline">{outfit.platform}</Badge>
                       <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary" fill="currentColor" />
                          <span className="font-bold">{outfit.rating}</span>
                          <span className="text-xs text-foreground/60">({outfit.reviews})</span>
                       </div>
                    </div>
                    <div className="pt-2 flex items-end justify-between">
                      <p className="text-3xl font-bold text-primary">{outfit.price}</p>
                      <Button variant="default">View Deal</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-16" />
          <h2 className="text-4xl font-headline text-center mb-12">Complete The Look</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Image src="https://picsum.photos/seed/top1/300/400" alt="Top" width={300} height={400} className="rounded-md mx-auto" data-ai-hint="fashion blouse"/>
                  <h4 className="font-headline mt-4">Embroidered Silk Blouse</h4>
                  <p className="font-bold text-primary">₹2,499</p>
                </CardContent>
              </Card>
              <div className="text-4xl text-center font-headline text-primary hidden md:flex items-center justify-center">+</div>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Image src="https://picsum.photos/seed/bottom1/300/400" alt="Bottom" width={300} height={400} className="rounded-md mx-auto" data-ai-hint="fashion skirt"/>
                  <h4 className="font-headline mt-4">Flowing Georgette Skirt</h4>
                  <p className="font-bold text-primary">₹3,199</p>
                </CardContent>
              </Card>
          </div>
          <div className="flex justify-center my-6">
              <div className="text-4xl text-center font-headline text-primary">+</div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
               <Card className="text-center md:col-start-2">
                 <CardContent className="p-4">
                    <Image src="https://picsum.photos/seed/shoes1/300/400" alt="Footwear" width={300} height={400} className="rounded-md mx-auto" data-ai-hint="fashion shoes"/>
                    <h4 className="font-headline mt-4">Golden Jutti Heels</h4>
                    <p className="font-bold text-primary">₹1,599</p>
                 </CardContent>
               </Card>
          </div>
          <div className="text-center mt-8">
              <p className="text-lg">Total Price: <span className="font-bold text-2xl text-primary">₹7,297</span></p>
              <Button className="mt-4 font-headline text-lg">Shop All 3 Pieces</Button>
          </div>

          <Separator className="my-16" />
          <h2 className="text-4xl font-headline text-center mb-12">Price Comparison</h2>
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <Image src="https://picsum.photos/seed/compare1/100/150" alt="Item" width={100} height={150} className="rounded-md" data-ai-hint="fashion blouse"/>
                  <div>
                    <h3 className="font-headline text-2xl">Embroidered Silk Blouse</h3>
                    <p className="text-foreground/70">Same style, different stores.</p>
                  </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-primary/50 border-2">
                    <TableCell className="font-medium flex items-center gap-2">
                        <Image src="https://img.icons8.com/color/48/amazon.png" alt="Amazon" width={24} height={24}/> Amazon
                        <Badge variant="default" className="ml-auto">Best Deal</Badge>
                    </TableCell>
                    <TableCell>₹2,350</TableCell>
                    <TableCell className="text-right"><Button size="sm">Go to Store</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Image src="https://img.icons8.com/fluency/48/flipkart.png" alt="Flipkart" width={24} height={24}/> Flipkart
                    </TableCell>
                    <TableCell>₹2,499</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="outline">Go to Store</Button></TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Image src="https://img.icons8.com/color/48/myntra.png" alt="Myntra" width={24} height={24}/> Myntra
                    </TableCell>
                    <TableCell>₹2,499</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="outline">Go to Store</Button></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <aside className="col-span-12 lg:col-span-3 lg:sticky top-24 self-start">
           <Card className="bg-card/50">
              <CardContent className="p-4">
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-headline text-xl">Why These Outfits?</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold">Body Shape: Pear</h4>
                        <p className="text-sm text-foreground/70">We prioritized A-line cuts and detailed necklines to draw attention upwards and balance your proportions.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Skin Tone: Warm</h4>
                        <p className="text-sm text-foreground/70">Colors like ochre, deep reds, and ivory were chosen to complement your warm undertones.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                     <AccordionTrigger className="font-headline text-xl">Color Palette</AccordionTrigger>
                     <AccordionContent>
                       <div className="grid grid-cols-3 gap-2 pt-2">
                         <div className="w-full aspect-square rounded-md bg-[#C9A84C]"></div>
                         <div className="w-full aspect-square rounded-md bg-[#C4545A]"></div>
                         <div className="w-full aspect-square rounded-md bg-[#F5F0E8]"></div>
                         <div className="w-full aspect-square rounded-md bg-[#A67A5B]"></div>
                         <div className="w-full aspect-square rounded-md bg-[#3D3D3D]"></div>
                         <div className="w-full aspect-square rounded-md bg-[#8B0000]"></div>
                       </div>
                     </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
};

export default ResultsPage;
