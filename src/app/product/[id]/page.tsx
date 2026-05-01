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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [mainImage, setMainImage] = React.useState(product.images[0]);

  return (
    <div className="bg-background text-foreground min-h-screen pt-24">
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
            <div className="sticky top-24">
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
              <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
              <h1 className="font-headline text-5xl mt-2 text-primary">{product.name}</h1>
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
              <h3 className="text-lg font-headline mb-4">Select Size</h3>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <Button
                    key={size.name}
                    variant={size.available ? "outline" : "secondary"}
                    disabled={!size.available}
                    className="w-14 h-14 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-4">
              <Button size="lg" className="w-full h-16 font-headline text-2xl tracking-widest bg-primary text-primary-foreground hover:glow-gold">
                Buy on {product.platform}
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="h-14 border-primary/20"><Heart className="mr-2 w-5 h-5" /> Save Look</Button>
                <Button variant="outline" size="lg" className="h-14 border-primary/20"><Share2 className="mr-2 w-5 h-5" /> Share</Button>
              </div>
            </div>

            <Separator className="bg-primary/10" />
            
            {/* AI Style Note */}
            <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary text-2xl">
                  <TrendingUp className="w-6 h-6" />
                  Atelier Curation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground/80 italic text-lg leading-relaxed">"{product.aiNote.reason}"</p>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-headline uppercase tracking-widest text-foreground/50">Harmony Score</h4>
                    <span className="text-sm font-bold text-primary">{product.aiNote.skinToneScore}% Match</span>
                  </div>
                  <Progress value={product.aiNote.skinToneScore} className="h-1.5" />
                </div>
                 <div>
                  <h4 className="text-sm font-headline uppercase tracking-widest text-foreground/50 mb-3">Best Occasions</h4>
                   <div className="flex flex-wrap gap-2">
                     {product.aiNote.occasions.map(occ => (
                       <Badge key={occ} variant="secondary" className="bg-primary/10 text-primary border-primary/5">
                         {occ}
                       </Badge>
                     ))}
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Separator className="my-24 bg-primary/10" />

        {/* Price Comparison */}
        <section>
          <h2 className="text-5xl font-headline text-center mb-12 text-primary">Marketplace Radar</h2>
          <Card className="max-w-4xl mx-auto bg-card/40 border-primary/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/5">
                <TableRow className="border-primary/10">
                  <TableHead className="text-xs uppercase tracking-widest font-bold">Store</TableHead>
                  <TableHead className="text-xs uppercase tracking-widest font-bold">Offer Price</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-widest font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.priceComparison.sort((a,b) => a.price - b.price).map((item, index) => (
                  <TableRow key={item.platform} className={index === 0 ? "bg-primary/5 border-primary/20" : "border-primary/5"}>
                    <TableCell className="font-medium flex items-center gap-4 py-6">
                        <Image src={item.logo} alt={item.platform} width={24} height={24} className="grayscale brightness-150" /> 
                        <span className="font-headline text-xl">{item.platform}</span>
                        {index === 0 && <Badge className="bg-primary text-primary-foreground text-[10px] ml-2">Best Deal</Badge>}
                    </TableCell>
                    <TableCell className="font-bold text-lg">₹{item.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant={index === 0 ? "default" : "outline"} className="font-headline tracking-widest">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">Visit Store</a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        <Separator className="my-24 bg-primary/10" />

        {/* Reviews */}
        <section id="reviews">
          <h2 className="text-5xl font-headline text-center mb-12 text-primary">Community Voice</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {product.reviews.map(review => (
              <Card key={review.id} className="bg-card/20 border-primary/5">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-current' : 'text-foreground/10'}`} />
                      ))}
                    </div>
                    {review.verified && <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-500 uppercase tracking-widest"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified Member</Badge>}
                  </div>
                  <p className="text-lg italic text-foreground/70 leading-relaxed font-body">"{review.text}"</p>
                  <p className="text-right mt-6 text-sm uppercase tracking-widest text-foreground/40">— {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-24 bg-primary/10" />

        {/* Similar Products */}
        <section className="mb-20">
          <h2 className="text-5xl font-headline text-center mb-12 text-primary">Atelier Recommendations</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {product.similarProducts.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-2">
                      <Link href={item.url}>
                        <Card className="group overflow-hidden bg-card/40 border-primary/5 hover:border-primary/20 transition-all">
                          <CardContent className="p-0">
                            <div className="relative aspect-[2/3]">
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                data-ai-hint="fashion editorial"
                              />
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground">
                                  <Heart className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="font-headline text-xl truncate group-hover:text-primary transition-colors">{item.name}</h3>
                              <p className="font-bold text-primary mt-2">{item.price}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex border-primary/10 hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="hidden sm:flex border-primary/10 hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
        </section>
      </div>
    </div>
  );
}
