import { Search, MapPin, Bed, Bath, Square, Phone, Mail, MapPin as LocationIcon, Star, Users, Building, Award, MessageCircle } from "lucide-react";
import temerLogo from '@assets/images (2)_1755853378467.jpg';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageSlider } from "@/components/ui/image-slider";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Property } from "@shared/schema";
import { contactViaWhatsApp } from "@/lib/whatsapp";

interface SliderImage {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  isActive: boolean;
}

export function HomePage() {
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: ""
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties']
  });

  const { data: sliderImages = [], isLoading: isLoadingSlider } = useQuery<SliderImage[]>({
    queryKey: ['/api/slider']
  });

  const formatPrice = (size: number) => {
    return `${size.toLocaleString()} sqm`;
  };

  const featuredStats = [
    { icon: Building, value: "500+", label: "Properties Listed" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Client Rating" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={temerLogo} 
              alt="Temer Properties Logo" 
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-temer-gold drop-shadow-sm leading-none">Temer</span>
              <span className="text-sm font-medium text-temer-green uppercase tracking-wider leading-none">PROPERTIES</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-temer-green font-medium transition-colors">Home</a>
            <a href="#properties" className="text-gray-700 hover:text-temer-green font-medium transition-colors">Properties</a>
            <a href="#about" className="text-gray-700 hover:text-temer-green font-medium transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-temer-green font-medium transition-colors">Contact</a>
            <Button className="bg-temer-green hover:bg-temer-dark-green text-white font-semibold">
              Admin Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image Slider */}
      <section id="home" className="relative">
        <ImageSlider 
          images={sliderImages} 
          autoPlay={true} 
          interval={6000}
          showControls={true}
          showIndicators={true}
          className="h-screen"
        />
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Find Your Perfect Property</CardTitle>
              <CardDescription className="text-lg">
                Search through our extensive portfolio of premium properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Location"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                    className="h-12"
                    data-testid="input-search-location"
                  />
                </div>
                <div>
                  <Select value={searchFilters.propertyType} onValueChange={(value) => setSearchFilters({ ...searchFilters, propertyType: value })}>
                    <SelectTrigger className="h-12" data-testid="select-property-type">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="shops">Commercial</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={searchFilters.priceRange} onValueChange={(value) => setSearchFilters({ ...searchFilters, priceRange: value })}>
                    <SelectTrigger className="h-12" data-testid="select-price-range">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50">Under 50 sqm</SelectItem>
                      <SelectItem value="50-100">50-100 sqm</SelectItem>
                      <SelectItem value="100-200">100-200 sqm</SelectItem>
                      <SelectItem value="200+">200+ sqm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-12 bg-temer-green hover:bg-temer-dark-green text-white font-semibold" data-testid="button-search">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-temer-green to-temer-dark-green text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {featuredStats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-temer-gold drop-shadow-lg" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-temer-light-gold font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully selected premium properties in the best locations of Addis Ababa
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group" data-testid={`card-property-${property.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      {property.status?.map((status, index) => (
                        <Badge key={index} className="bg-temer-green text-white mr-2 font-medium">
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900" data-testid={`text-title-${property.id}`}>
                      {property.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.bedrooms || 0}
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.bathrooms || 0}
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {formatPrice(property.size || 0)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-temer-green hover:bg-temer-dark-green text-white font-semibold" data-testid={`button-view-${property.id}`}>
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold"
                        onClick={() => contactViaWhatsApp({
                          title: property.title,
                          location: property.location,
                          bedrooms: property.bedrooms,
                          bathrooms: property.bathrooms,
                          size: property.size
                        })}
                        data-testid={`button-whatsapp-${property.id}`}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Available</h3>
                <p className="text-gray-600">Check back soon for new property listings.</p>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-temer-green text-temer-green hover:bg-temer-green hover:text-white font-semibold">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Temer Properties</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              With over 15 years of experience in the Ethiopian real estate market, Temer Properties has established itself as a trusted partner for property buyers, sellers, and investors. We specialize in premium residential and commercial properties in Addis Ababa's most sought-after locations.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-temer-green to-temer-dark-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Properties</h3>
                <p className="text-gray-600">Carefully curated selection of high-quality properties</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-temer-green to-temer-dark-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Service</h3>
                <p className="text-gray-600">Professional guidance throughout your property journey</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-temer-green to-temer-dark-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted Partner</h3>
                <p className="text-gray-600">Proven track record of successful transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-lg text-gray-600">
                Ready to find your dream property? Get in touch with our expert team today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-temer-green mr-3" />
                    <span>+251 911 123 456</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-temer-green mr-3" />
                    <span>info@temerproperties.com</span>
                  </div>
                  <div className="flex items-start">
                    <LocationIcon className="h-5 w-5 text-temer-green mr-3 mt-1" />
                    <span>Bole Road, Addis Ababa, Ethiopia</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Your Name" data-testid="input-contact-name" />
                      <Input type="email" placeholder="Your Email" data-testid="input-contact-email" />
                    </div>
                    <Input placeholder="Phone Number" data-testid="input-contact-phone" />
                    <textarea
                      className="w-full min-h-[120px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-temer-green focus:border-temer-green transition-colors"
                      placeholder="Your Message"
                      data-testid="textarea-contact-message"
                    />
                    <Button className="w-full bg-temer-green hover:bg-temer-dark-green text-white font-semibold" data-testid="button-send-message">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src={temerLogo} 
                alt="Temer Properties Logo" 
                className="h-10 w-auto object-contain opacity-90"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-temer-light-gold leading-none">Temer</span>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wider leading-none">PROPERTIES</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner in Ethiopian real estate since 2009
            </p>
            <div className="flex justify-center space-x-8 mb-6">
              <a href="#home" className="text-gray-400 hover:text-white">Home</a>
              <a href="#properties" className="text-gray-400 hover:text-white">Properties</a>
              <a href="#about" className="text-gray-400 hover:text-white">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white">Contact</a>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
              <p>&copy; 2025 Temer Properties. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;