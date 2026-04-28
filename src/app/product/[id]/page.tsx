'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Share2,
  Star,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Mock data for a single product
const product = {
  id: 1,
  name: 'Opulent Ochre Sari',
  brand: 'Kala Sanskruti',
  platform: 'Myntra',
  images: [
    'https://picsum.photos/seed/pdp1-main/800/1200',
    'https://picsum.photos/seed/pdp1-thumb1/200/300',
    'https://picsum.photos/seed/pdp1-thumb2/200/300',
    'https://picsum.photos/seed/pdp1-thumb3/200/300',
    'https://picsum.photos/seed/pdp1-thumb4/200/300',
  ],
  price: {
    current: 7899,
    original: 9999,
    discount: 21,
  },
  rating: 4.8,
  reviewCount: 124,
  sizes: [
    { name: 'S', available: true },
    { name: 'M', available: true },
    { name: 'L', available: true },
    { name: 'XL', available: false },
    { name: 'XXL', available: false },
  ],
  aiNote: {
    reason: 'The rich ochre hue beautifully complements your warm skin undertone, while the vertical draping of the sari creates an elegant, elongated silhouette that flatters your pear-shaped figure.',
    skinToneScore: 92,
    occasions: ['Wedding', 'Festive', 'Formal Event'],
  },
  priceComparison: [
    { platform: 'Myntra', logo: 'https://img.icons8.com/color/48/myntra.png', price: 7899, url: '#' },
    { platform: 'Amazon', logo: 'https://img.icons8.com/color/48/amazon.png', price: 8150, url: '#' },
    { platform: 'Flipkart', logo: 'https://img.icons8.com/fluency/48/flipkart.png', price: 8200, url: '#' },
  ],
  reviews: [
    { id: 1, rating: 5, name: 'Anjali P.', verified: true, text: 'Absolutely stunning sari. The fabric is luxurious and the color is even more beautiful in person. Received so many compliments!' },
    { id: 2, rating: 5, name: 'Priya S.', verified: true, text: 'Perfect for my friend\'s wedding. The fit was great and it felt very comfortable to wear for a long time.' },
    { id: 3, rating: 4, name: 'Neha K.', verified: false, text: 'Beautiful design, but the color is a little darker than the photo. Still a great purchase.' },
  ],
  similarProducts: [
    { id: 2, name: 'Midnight Bloom Anarkali', image: 'https://picsum.photos/seed/result2/400/600', price: '₹4,200', url: '/product/2' },
    { id: 3, name: 'Ivory Dream Lehenga', image: 'https://picsum.photos/seed/result3/400/600', price: '₹12,500', url: '/product/3' },
    { id: 4, name: 'Crimson Tide Kurta', image: 'https://picsum.photos/seed/result4/400/600', price: '₹1,299', url: '/product/4' },
    { id: 5, name: 'Emerald Gown', image: 'https://picsum.photos/seed/result5/400/600', price: '₹9,999', url: '/product/5' },
  ]
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch product data based on params.id
  const [mainImage, setMainImage] = React.useState(product.images[0]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs and Back Navigation */}
        <div className="flex justify-between items-center mb-6">
          <nav className="text-sm text-foreground/70 flex items-center space-x-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/results" className="hover:text-primary">Results</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground truncate max-w-xs">{product.name}</span>
          </nav>
          <Link href="/results" passHref>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
            </Button>
          </Link>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Images */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-border">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`aspect-[2/3] relative rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Info */}
            <div>
              <Badge variant="secondary">{product.brand}</Badge>
              <h1 className="font-headline text-4xl mt-2">{product.name}</h1>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-primary fill-current" />
                  <span className="ml-1 font-bold">{product.rating}</span>
                  <a href="#reviews" className="ml-2 text-sm text-foreground/70 underline">({product.reviewCount} reviews)</a>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <Badge variant="outline">{product.platform}</Badge>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-primary">₹{product.price.current.toLocaleString('en-IN')}</p>
              <p className="text-xl text-foreground/50 line-through">₹{product.price.original.toLocaleString('en-IN')}</p>
              <Badge variant="destructive">{product.price.discount}% OFF</Badge>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-headline mb-2">Select Size</h3>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <Button
                    key={size.name}
                    variant={size.available ? "outline" : "secondary"}
                    disabled={!size.available}
                    className="w-12 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full font-headline text-lg tracking-wider">Buy on {product.platform}</Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg"><Heart className="mr-2" /> Save to Wardrobe</Button>
                <Button variant="outline" size="lg"><Share2 className="mr-2" /> Share Look</Button>
              </div>
            </div>

            <Separator />
            
            {/* AI Style Note */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <TrendingUp />
                  AI Style Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/90 italic">"{product.aiNote.reason}"</p>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold">Skin Tone Compatibility</h4>
                    <span className="text-sm font-bold text-primary">{product.aiNote.skinToneScore}%</span>
                  </div>
                  <Progress value={product.aiNote.skinToneScore} className="h-2" />
                </div>
                 <div>
                  <h4 className="text-sm font-semibold mb-2">Occasion Suitability</h4>
                   <div className="flex flex-wrap gap-2">
                     {product.aiNote.occasions.map(occ => <Badge key={occ} variant="outline">{occ}</Badge>)}
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Separator className="my-16" />

        {/* Price Comparison */}
        <section>
          <h2 className="text-4xl font-headline text-center mb-8">Find a Better Price</h2>
          <Card className="max-w-4xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.priceComparison.sort((a,b) => a.price - b.price).map((item, index) => (
                  <TableRow key={item.platform} className={index === 0 ? "border-primary/50 border-2" : ""}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Image src={item.logo} alt={item.platform} width={24} height={24}/> {item.platform}
                        {index === 0 && <Badge className="ml-auto">Best Deal</Badge>}
                    </TableCell>
                    <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right"><Button asChild size="sm" variant={index === 0 ? "default" : "outline"}><a href={item.url} target="_blank" rel="noopener noreferrer">Go to Store</a></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        <Separator className="my-16" />

        {/* Reviews */}
        <section id="reviews">
          <h2 className="text-4xl font-headline text-center mb-8">What Buyers Are Saying</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {product.reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-primary fill-current' : 'text-foreground/30'}`} />
                      ))}
                    </div>
                    {review.verified && <Badge variant="secondary" className="ml-4 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified Purchase</Badge>}
                  </div>
                  <p className="italic text-foreground/80">"{review.text}"</p>
                  <p className="text-right mt-2 font-semibold text-sm">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Similar Products */}
        <section>
          <h2 className="text-4xl font-headline text-center mb-8">You Might Also Like</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {product.similarProducts.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                      <Link href={item.url}>
                        <Card className="group overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative aspect-[2/3]">
                              <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/50 hover:bg-background/80"><Heart className="h-4 w-4" /></Button>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-headline text-lg truncate">{item.name}</h3>
                              <p className="font-bold text-primary mt-1">{item.price}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </section>
      </div>
    </div>
  );
}
