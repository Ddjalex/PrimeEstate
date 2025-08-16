import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Property search form state
  const [searchForm, setSearchForm] = useState({
    location: '',
    propertyType: '',
    bedrooms: '',
    status: ''
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Handle property search
  const handlePropertySearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search Submitted",
      description: "We'll help you find properties matching your criteria.",
    });
    console.log('Property search:', searchForm);
  };

  // Handle contact form submission
  const handleContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message! We will get back to you soon.",
    });
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="font-inter bg-background text-foreground">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-temer-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TEMER PROPERTIES</h1>
                <p className="text-xs text-temer-gray uppercase tracking-wide">Make Your Next Move With Us</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-projects"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('properties')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-properties"
              >
                Properties
              </button>
              <button 
                onClick={() => scrollToSection('construction')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-construction"
              >
                Construction Updates
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-blog"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-about"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-temer-blue transition-colors font-medium"
                data-testid="nav-contact"
              >
                Contact Us
              </button>
            </div>

            {/* Contact Info & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-temer-blue">Hotline - 6033</p>
                <p className="text-xs text-temer-gray">+251975666699</p>
              </div>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                <i className="fas fa-bars text-xl"></i>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
              <div className="flex flex-col space-y-2">
                <button onClick={() => scrollToSection('home')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">Home</button>
                <button onClick={() => scrollToSection('projects')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">Projects</button>
                <button onClick={() => scrollToSection('properties')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">Properties</button>
                <button onClick={() => scrollToSection('construction')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">Construction Updates</button>
                <button onClick={() => scrollToSection('blog')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">Blog</button>
                <button onClick={() => scrollToSection('about')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">About Us</button>
                <button onClick={() => scrollToSection('contact')} className="text-left py-2 px-2 text-gray-700 hover:text-temer-blue hover:bg-gray-50 rounded">Contact Us</button>
              </div>
            </div>
          )}
        </nav>
      </header>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="mb-4">
            <Badge className="bg-temer-blue text-white text-sm px-4 py-2 mb-4">MAKE YOUR NEXT MOVE WITH US</Badge>
          </div>
          <h1 className="sm:text-5xl lg:text-7xl animate-fade-in text-[#28bd5c] bg-[#7f726a] font-extrabold text-[40px] text-left ml-[4px] mr-[4px] mt-[14px] mb-[14px] pl-[4px] pr-[4px] pt-[-6px] pb-[-6px]">
            TEMER PROPERTIES
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 animate-slide-up max-w-3xl mx-auto">
            Discover the latest real estate in Ethiopia on Temer Properties, featuring trusted apartments for sale in Addis Ababa — residential, commercial, and mixed-use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="hover:bg-blue-700 font-semibold py-4 px-8 text-[#00ff07] bg-[#ffffff] text-[20px]"
              onClick={() => scrollToSection('properties')}
              data-testid="hero-search-button"
            >
              <i className="fas fa-search mr-2"></i>
              Search Properties
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-temer-blue font-semibold py-4 px-8 text-lg"
              onClick={() => scrollToSection('projects')}
              data-testid="hero-buyers-button"
            >
              <i className="fas fa-users mr-2"></i>
              For Buyers
            </Button>
          </div>
          
          {/* Social Media Links */}
          <div className="mt-8 flex justify-center space-x-6">
            <a href="https://web.facebook.com/temerproperties" className="text-white hover:text-temer-light-blue transition-colors" data-testid="social-facebook">
              <i className="fab fa-facebook text-2xl"></i>
            </a>
            <a href="http://www.youtube.com/@TemerProperties" className="text-white hover:text-temer-light-blue transition-colors" data-testid="social-youtube">
              <i className="fab fa-youtube text-2xl"></i>
            </a>
            <a href="https://www.instagram.com/temerproperties" className="text-white hover:text-temer-light-blue transition-colors" data-testid="social-instagram">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a href="https://x.com/TemerProperties" className="text-white hover:text-temer-light-blue transition-colors" data-testid="social-twitter">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="https://www.linkedin.com/company/temer-realestate/" className="text-white hover:text-temer-light-blue transition-colors" data-testid="social-linkedin">
              <i className="fab fa-linkedin text-2xl"></i>
            </a>
            <a href="https://t.me/temer_properties" className="text-white hover:text-temer-light-blue transition-colors" data-testid="social-telegram">
              <i className="fab fa-telegram text-2xl"></i>
            </a>
          </div>
        </div>
      </section>
      {/* Property Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-xl border border-gray-100">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search by Location</h2>
                
                <form onSubmit={handlePropertySearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Location</Label>
                    <Select value={searchForm.location} onValueChange={(value) => setSearchForm({...searchForm, location: value})}>
                      <SelectTrigger data-testid="search-location">
                        <SelectValue placeholder="Search by location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piyassa">Piyassa</SelectItem>
                        <SelectItem value="sarbet-seken">Sarbet-Seken</SelectItem>
                        <SelectItem value="lebu">Lebu</SelectItem>
                        <SelectItem value="ayat">Ayat</SelectItem>
                        <SelectItem value="atena-tera">Atena Tera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Property Type</Label>
                    <Select value={searchForm.propertyType} onValueChange={(value) => setSearchForm({...searchForm, propertyType: value})}>
                      <SelectTrigger data-testid="search-property-type">
                        <SelectValue placeholder="Property Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Bedrooms</Label>
                    <Select value={searchForm.bedrooms} onValueChange={(value) => setSearchForm({...searchForm, bedrooms: value})}>
                      <SelectTrigger data-testid="search-bedrooms">
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Property Status</Label>
                    <Select value={searchForm.status} onValueChange={(value) => setSearchForm({...searchForm, status: value})}>
                      <SelectTrigger data-testid="search-status">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="new-offer">New Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button 
                      type="submit" 
                      className="w-full bg-temer-blue hover:bg-blue-700 text-white font-semibold"
                      data-testid="search-submit-button"
                    >
                      <i className="fas fa-search mr-2"></i>Search
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Latest Properties Section */}
      <section id="properties" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge className="bg-temer-blue/10 text-temer-blue text-sm px-4 py-2">TEMER PROPERTIES</Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Latest Properties</h2>
            <p className="text-lg text-temer-gray max-w-3xl mx-auto">
              Discover the latest real estate in Ethiopia on Temer Properties, featuring trusted apartments for sale in Addis Ababa — residential, commercial, and mixed-use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'LYCEE 003- One BedRoom Apartment',
                description: 'This one-bedroom apartment for sale in Ethiopia offers a thoughtfully designed and comfortable living space, ideal for individuals or couples. Featuring a cozy bedroom alongside a well-appointed living area.',
                beds: 1,
                baths: 1,
                size: 86,
                location: 'Lycee 003, Piyassa',
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
                status: ['For Sale', 'Active', 'New Offer']
              },
              {
                title: 'LYCEE 003- Two BedRoom Apartment',
                description: 'These two-bedroom apartments for sale in Ethiopia provide a well-designed and comfortable living space, ideal for small families, couples, or individuals seeking extra room.',
                beds: 2,
                baths: 1,
                size: 86,
                location: 'Lycee 003, Piyassa',
                image: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
                status: ['For Sale', 'Active', 'New Offer']
              },
              {
                title: 'LYCEE 003- Three BedRoom Apartment',
                description: 'These three-bedroom apartments for sale in Ethiopia provide a generous and adaptable living space, perfectly suited for families. They feature cozy bedrooms along with a serene master suite.',
                beds: 3,
                baths: 2,
                size: 146,
                location: 'Lycee 003, Piyassa',
                image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
                status: ['For Sale', 'Active', 'New Offer']
              },
              {
                title: 'Sarbet -Au,Two BedRoom Apartment',
                description: 'The two-bedroom apartments provide a well-designed and comfortable living space, ideal for small families, couples, or individuals seeking extra room. With cozy bedrooms and modern amenities.',
                beds: 3,
                baths: 2,
                size: 130,
                location: 'Sarbet -Au, sarbet-seken',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
                status: ['For Sale', 'Active', 'New Offer']
              },
              {
                title: 'Sarbet -Au,Three BedRoom Apartment',
                description: 'The three-bedroom apartments offer a spacious and versatile living space, featuring comfortable bedrooms and a serene master suite, ideal for families.',
                beds: 3,
                baths: 2,
                size: 130,
                location: 'Sarbet, sarbet-seken',
                image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
                status: ['For Sale', 'Active', 'New Offer']
              },
              {
                title: 'Mehamud Muzika Bet, Shops',
                description: 'Located in Piassa, this 2B+G+5 commercial building offers units from 10 SQM. With excavation completed, it includes key amenities like an elevator, parking, EV charging.',
                beds: 0,
                baths: 0,
                size: 20,
                location: 'Mehamud Muzika Bet, Piyassa',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
                status: ['For Sale', 'Active']
              }
            ].map((property, index) => (
              <Card key={index} className="property-card bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {property.status.map((status, statusIndex) => (
                      <Badge key={statusIndex} className={`text-white text-xs px-3 py-1 ${
                        status === 'For Sale' ? 'bg-green-500' :
                        status === 'Active' ? 'bg-temer-blue' :
                        'bg-orange-500'
                      }`}>
                        {status}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Navigation arrows - carousel style */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <Button size="sm" variant="ghost" className="bg-black/20 text-white hover:bg-black/40">
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button size="sm" variant="ghost" className="bg-black/20 text-white hover:bg-black/40">
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-temer-blue transition-colors cursor-pointer">{property.title}</h3>
                  <p className="text-temer-gray text-sm mb-4 leading-relaxed">{property.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-temer-gray">
                    <span className="flex items-center">
                      <i className="fas fa-bed mr-1"></i>
                      Beds: <span className="font-semibold ml-1">{property.beds}</span>
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-bath mr-1"></i>
                      Baths: <span className="font-semibold ml-1">{property.baths}</span>
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-expand-arrows-alt mr-1"></i>
                      Size: <span className="font-semibold ml-1">{property.size} m²</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-temer-gray flex items-center">
                      <i className="fas fa-map-marker-alt mr-1 text-temer-blue"></i>
                      {property.location}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="bg-temer-blue text-white hover:bg-blue-700"
                        onClick={() => window.open('tel:+251975666699')}
                        data-testid={`property-call-${index}`}
                      >
                        Call
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-temer-blue text-temer-blue hover:bg-temer-blue hover:text-white"
                        onClick={() => window.open('mailto:info@temerproperties.com')}
                        data-testid={`property-email-${index}`}
                      >
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-temer-blue hover:bg-blue-700 text-white px-8 py-3"
              data-testid="load-more-properties"
            >
              load more listings
            </Button>
          </div>
        </div>
      </section>
      {/* Projects Section */}
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge className="bg-temer-blue/10 text-temer-blue text-sm px-4 py-2">PRIME LOCATION</Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Project Listings</h2>
            <p className="text-lg text-temer-gray max-w-3xl mx-auto">
              Easily explore Real Estate in Ethiopia with our List Category feature. Find the perfect apartment for sale in Addis Ababa from trusted developer with Temer Real Estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { name: 'Adwa 001- Ewket', listings: 1 },
              { name: 'Adwa 002- empire', listings: 1 },
              { name: 'Achantan', listings: 1 },
              { name: 'Lycee 002', listings: 2 },
              { name: 'Mehamud Muzika Bet', listings: 1 },
              { name: 'Lycee 003', listings: 3 },
              { name: 'Aware', listings: 2 },
              { name: 'Ayat Feres Bet', listings: 2 },
              { name: 'Ayat Lomiyad', listings: 3 },
              { name: 'Ayat To Center', listings: 1 },
              { name: 'Haile Garment', listings: 1 },
              { name: 'Lycee 001', listings: 3 },
              { name: 'Sarbet', listings: 3 },
              { name: 'Sarbet -Au', listings: 1 },
              { name: 'Sumaletera', listings: 1 }
            ].map((project, index) => (
              <Card key={index} className="bg-gray-50 border border-gray-200 hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-temer-blue transition-colors">{project.name}</h3>
                  <p className="text-sm text-temer-gray">{project.listings} listing{project.listings > 1 ? 's' : ''}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose Us Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Why You Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'fas fa-map-marker-alt',
                title: 'Location',
                description: 'Discover thoughtfully designed properties that suit your lifestyle, with easy access to essential amenities, top-rated schools, and major transportation hubs'
              },
              {
                icon: 'fas fa-dollar-sign',
                title: 'Affordable',
                description: 'Find your ideal home at a price that fits your budget. Our collection offers quality and affordability with clear, upfront pricing.'
              },
              {
                icon: 'fas fa-award',
                title: 'Quality',
                description: 'Make smart property investments backed by a focus on safety, long-lasting quality, and strong value—guaranteed through thorough inspections..'
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Safety & Security',
                description: 'Discover safe neighborhoods and well-appointed properties featuring key security measures and a strong sense of community.'
              },
              {
                icon: 'fas fa-chart-line',
                title: 'Investment',
                description: 'Invest in properties designed to grow in value, perfectly aligned with your long-term financial goals and dreams.'
              },
              {
                icon: 'fas fa-swimming-pool',
                title: 'Amenity',
                description: 'Enjoy comfort and ease in properties packed with amenities, designed to fit your lifestyle and personal needs.'
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-temer-blue">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mx-auto mb-6">
                    <i className={`${benefit.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{benefit.title}</h3>
                  <p className="text-temer-gray leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-temer-blue text-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-5xl font-bold mb-2">
                  <span className="animate-fade-in">500</span>
                  <span className="text-3xl">+</span>
                </h3>
                <p className="text-blue-100 text-lg">Customers</p>
              </CardContent>
            </Card>
            <Card className="bg-temer-blue text-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-5xl font-bold mb-2">
                  <span className="animate-fade-in">10</span>
                  <span className="text-3xl">+</span>
                </h3>
                <p className="text-blue-100 text-lg">Years Of Experiences</p>
              </CardContent>
            </Card>
            <Card className="bg-temer-blue text-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-5xl font-bold mb-2">
                  <span className="animate-fade-in">50</span>
                  <span className="text-3xl">+</span>
                </h3>
                <p className="text-blue-100 text-lg">Deliverd Projects</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Delivered Projects Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge className="bg-orange-100 text-orange-800 text-sm px-4 py-2">
                <i className="fab fa-youtube mr-2"></i>
                YouTube
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Deliverd Projects</h2>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div className="flex space-x-8 animate-slide">
                {[
                  { name: '2MA', location: 'LEBU', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' },
                  { name: 'SAHIL', location: 'LEBU', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' },
                  { name: 'Mohammed.s', location: 'Lebu', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' },
                  { name: 'AGT-TRADING', location: 'Atena Tera', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' },
                  { name: 'Maw', location: 'Ayat Site', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' }
                ].map((project, index) => (
                  <Card key={index} className="flex-none w-80 shadow-lg overflow-hidden">
                    <img 
                      src={project.image}
                      alt={`${project.name} Project in ${project.location}`}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-temer-gray mb-2">Location-{project.location}</p>
                      <h3 className="text-2xl font-bold text-gray-800">{project.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Blog Section */}
      <section id="blog" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge className="bg-temer-blue/10 text-temer-blue text-sm px-4 py-2">NEWS and Interest</Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Read From Our Blog</h2>
            <p className="text-lg text-temer-gray max-w-3xl mx-auto">
              Explore Insightful articles about the Ethiopia real estate market, project updates, and expert advice from Temer Properties to help you make confident property decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'A Green Legacy: Planting Hope in Addis Ababa',
                date: 'August 4, 2025',
                excerpt: 'Our team arrived early in the morning when it was still quiet. We brought our cameras, brochures, caps, and t-shirt [...]',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'The Progress of Temer Properties: From Humble...',
                date: 'August 1, 2025',
                excerpt: 'In the streets of Somale Tera, on the 5th floor of the Beto Building, a dream was born. Just 50 dedicated employees [...]',
                image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'High-Quality Homes, Honest Prices: The Temer...',
                date: 'July 29, 2025',
                excerpt: 'In Ethiopia\'s fast-growing real estate market, where housing demand continues to rise amidst urbanization and econo [...]',
                image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
              }
            ].map((post, index) => (
              <Card key={index} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-temer-blue transition-colors cursor-pointer line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-temer-gray mb-4">{post.date}</p>
                  <p className="text-temer-gray text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-temer-blue text-temer-blue hover:bg-temer-blue hover:text-white"
                    data-testid={`blog-continue-${index}`}
                  >
                    Continue reading
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button variant="ghost" size="sm">
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </Button>
            <Button variant="ghost" size="sm">
              Next
              <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </div>
        </div>
      </section>
      {/* Construction Updates Section */}
      <section id="construction" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Construction Updates</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Stay updated with the latest progress on our ongoing construction projects across Ethiopia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Lycee 003 - Foundation Complete',
                description: 'Foundation work has been completed and ground floor construction is now underway. All safety protocols are being followed.',
                date: 'January 15, 2025',
                status: 'On Schedule',
                statusColor: 'bg-green-100 text-green-800',
                image: 'https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Sarbet Au - 3rd Floor Progress',
                description: 'Third floor concrete pouring completed. Electrical and plumbing rough-ins are in progress according to schedule.',
                date: 'January 12, 2025',
                status: '75% Complete',
                statusColor: 'bg-blue-100 text-blue-800',
                image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Mehamud Muzika - Excavation Done',
                description: 'Excavation phase completed successfully. Site preparation for foundation work begins next week.',
                date: 'January 10, 2025',
                status: 'Phase 1 Complete',
                statusColor: 'bg-purple-100 text-purple-800',
                image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
              }
            ].map((update, index) => (
              <Card key={index} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={update.image}
                  alt={update.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`${update.statusColor} text-xs px-3 py-1`}>
                      {update.status}
                    </Badge>
                    <span className="text-sm text-temer-gray">{update.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{update.title}</h3>
                  <p className="text-temer-gray text-sm leading-relaxed">{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Our Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Team</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Meet our dedicated team of sales professionals ready to help you find your dream property
            </p>
          </div>

          {/* Sales Officers */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sales Officers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Sarah Tadesse', phone: '+251911234567', image: 'https://images.unsplash.com/photo-1494790108755-2616c7e83207?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' },
                { name: 'Daniel Kebede', phone: '+251922345678', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' },
                { name: 'Meron Alemayehu', phone: '+251933456789', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' }
              ].map((officer, index) => (
                <Card key={index} className="bg-white shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <img 
                      src={officer.image}
                      alt={officer.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{officer.name}</h4>
                    <p className="text-temer-blue font-medium mb-3">Sales Officer</p>
                    <Button 
                      size="sm" 
                      className="bg-temer-blue text-white hover:bg-blue-700"
                      onClick={() => window.open(`tel:${officer.phone}`)}
                      data-testid={`officer-call-${index}`}
                    >
                      <i className="fas fa-phone mr-2"></i>
                      {officer.phone}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sales Agents */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sales Agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Bereket Tesfaye', phone: '+251944567890', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' },
                { name: 'Helen Girma', phone: '+251955678901', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' },
                { name: 'Yonas Mulugeta', phone: '+251966789012', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' },
                { name: 'Almaz Bekele', phone: '+251977890123', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400' }
              ].map((agent, index) => (
                <Card key={index} className="bg-white shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <img 
                      src={agent.image}
                      alt={agent.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{agent.name}</h4>
                    <p className="text-temer-blue text-sm font-medium mb-3">Sales Agent</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-temer-blue text-temer-blue hover:bg-temer-blue hover:text-white text-xs"
                      onClick={() => window.open(`tel:${agent.phone}`)}
                      data-testid={`agent-call-${index}`}
                    >
                      <i className="fas fa-phone mr-1"></i>
                      Call
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Contact Us Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Get in touch with us today. We're here to help you find your perfect property in Ethiopia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg border border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleContactForm} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                        className="mt-1"
                        data-testid="contact-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                        className="mt-1"
                        data-testid="contact-email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+251..."
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="mt-1"
                      data-testid="contact-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your property needs..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                      rows={5}
                      className="mt-1"
                      data-testid="contact-message"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-temer-blue hover:bg-blue-700 text-white"
                    data-testid="contact-submit"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              <Card className="shadow-lg border border-gray-100">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Get In Touch</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-temer-blue rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-map-marker-alt text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Office Address</h4>
                        <p className="text-temer-gray">Somale Tera, 5th Floor, Beto Building<br />Addis Ababa, Ethiopia</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-temer-blue rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-phone text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Phone Number</h4>
                        <p className="text-temer-gray">+251975666699<br />Hotline: 6033</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-temer-blue rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-envelope text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Email</h4>
                        <p className="text-temer-gray">info@temerproperties.com<br />contact@temerproperties.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a href="https://web.facebook.com/temerproperties" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors" data-testid="social-facebook-footer">
                        <i className="fab fa-facebook"></i>
                      </a>
                      <a href="http://www.youtube.com/@TemerProperties" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors" data-testid="social-youtube-footer">
                        <i className="fab fa-youtube"></i>
                      </a>
                      <a href="https://www.instagram.com/temerproperties" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors" data-testid="social-instagram-footer">
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a href="https://x.com/TemerProperties" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-gray-900 transition-colors" data-testid="social-twitter-footer">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="https://www.linkedin.com/company/temer-realestate/" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors" data-testid="social-linkedin-footer">
                        <i className="fab fa-linkedin"></i>
                      </a>
                      <a href="https://t.me/temer_properties" className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors" data-testid="social-telegram-footer">
                        <i className="fab fa-telegram"></i>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Map */}
              <Card className="shadow-lg border border-gray-100">
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-map-marker-alt text-4xl text-temer-blue mb-2"></i>
                      <p className="text-gray-600">Interactive Map</p>
                      <p className="text-sm text-temer-gray">Somale Tera, Addis Ababa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-temer-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">TEMER PROPERTIES</h3>
                <p className="text-sm text-gray-400">Make Your Next Move With Us</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Leading real estate company in Ethiopia providing quality apartments for sale in Addis Ababa with trusted development and exceptional service.
            </p>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2025 Temer Properties. All rights reserved. | 
                <a href="#" className="hover:text-white ml-2">Terms of Use</a> | 
                <a href="#" className="hover:text-white ml-2">Privacy Policy</a> | 
                <a href="/admin/login" className="hover:text-white ml-2" data-testid="link-admin">Admin</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}