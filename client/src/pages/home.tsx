import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="font-inter bg-gray-50">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-temer-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">TEMER PROPERTIES</h1>
                <p className="text-xs text-temer-gray">MAKE YOUR NEXT MOVE WITH US</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
                data-testid="nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
                data-testid="nav-projects"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('properties')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
                data-testid="nav-properties"
              >
                Properties
              </button>
              <button 
                onClick={() => scrollToSection('construction')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
                data-testid="nav-construction"
              >
                Construction Updates
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
                data-testid="nav-blog"
              >
                Blog
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
                data-testid="nav-about"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-temer-blue transition-colors"
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
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <button onClick={() => scrollToSection('home')} className="text-left py-2 text-gray-700 hover:text-temer-blue">Home</button>
                <button onClick={() => scrollToSection('projects')} className="text-left py-2 text-gray-700 hover:text-temer-blue">Projects</button>
                <button onClick={() => scrollToSection('properties')} className="text-left py-2 text-gray-700 hover:text-temer-blue">Properties</button>
                <button onClick={() => scrollToSection('construction')} className="text-left py-2 text-gray-700 hover:text-temer-blue">Construction Updates</button>
                <button onClick={() => scrollToSection('blog')} className="text-left py-2 text-gray-700 hover:text-temer-blue">Blog</button>
                <button onClick={() => scrollToSection('about')} className="text-left py-2 text-gray-700 hover:text-temer-blue">About Us</button>
                <button onClick={() => scrollToSection('contact')} className="text-left py-2 text-gray-700 hover:text-temer-blue">Contact Us</button>
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
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Dream Home
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 animate-slide-up">
            Discover the latest real estate in Ethiopia on Temer Properties, featuring trusted apartments for sale in Addis Ababa
          </p>
          <Button 
            size="lg"
            className="bg-temer-blue hover:bg-blue-700 text-white font-semibold py-4 px-8 text-lg"
            onClick={() => scrollToSection('projects')}
            data-testid="hero-cta-button"
          >
            View Projects
          </Button>
        </div>
      </section>

      {/* Property Search Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-lg border border-gray-100">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Properties</h2>
                
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
                    <Label className="text-sm font-medium text-gray-700 mb-2">Status</Label>
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

      {/* About Us Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Discover what makes Temer Properties the trusted choice for real estate in Ethiopia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Location */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-map-marker-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Prime Location</h3>
                <p className="text-temer-gray">Discover thoughtfully designed properties that suit your lifestyle, with easy access to essential amenities, top-rated schools, and major transportation hubs</p>
              </CardContent>
            </Card>

            {/* Quality */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-award text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quality</h3>
                <p className="text-temer-gray">Make smart property investments backed by a focus on safety, long-lasting quality, and strong value—guaranteed through thorough inspections.</p>
              </CardContent>
            </Card>

            {/* Affordability */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-dollar-sign text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Affordable</h3>
                <p className="text-temer-gray">Find your ideal home at a price that fits your budget. Our collection offers quality and affordability with clear, upfront pricing.</p>
              </CardContent>
            </Card>

            {/* Safety & Security */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-shield-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Safety & Security</h3>
                <p className="text-temer-gray">Discover safe neighborhoods and well-appointed properties featuring key security measures and a strong sense of community.</p>
              </CardContent>
            </Card>

            {/* Investment */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-chart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Investment</h3>
                <p className="text-temer-gray">Invest in properties designed to grow in value, perfectly aligned with your long-term financial goals and dreams.</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-temer-blue rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-swimming-pool text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
                <p className="text-temer-gray">Enjoy comfort and ease in properties packed with amenities, designed to fit your lifestyle and personal needs.</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-temer-blue text-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-4xl font-bold mb-2">500+</h3>
                <p className="text-blue-100">Happy Customers</p>
              </CardContent>
            </Card>
            <Card className="bg-temer-blue text-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-4xl font-bold mb-2">10+</h3>
                <p className="text-blue-100">Years Of Experience</p>
              </CardContent>
            </Card>
            <Card className="bg-temer-blue text-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-4xl font-bold mb-2">50+</h3>
                <p className="text-blue-100">Delivered Projects</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Project Listings</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Easily explore Real Estate in Ethiopia with our List Category feature. Find the perfect apartment for sale in Addis Ababa from trusted developer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { name: 'Adwa 001- Ewket', listings: 1 },
              { name: 'Lycee 003', listings: 3 },
              { name: 'Sarbet -Au', listings: 2 },
              { name: 'Mehamud Muzika Bet', listings: 1 },
              { name: 'Ayat Lomiyad', listings: 3 },
              { name: 'Haile Garment', listings: 1 },
              { name: 'Aware', listings: 2 },
              { name: 'Sumaletera', listings: 1 }
            ].map((project, index) => (
              <Card key={index} className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                  <p className="text-sm text-temer-gray">{project.listings} listing{project.listings > 1 ? 's' : ''}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Delivered Projects */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Delivered Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  name: '2MA', 
                  location: 'LEBU',
                  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
                },
                {
                  name: 'SAHIL',
                  location: 'LEBU',
                  image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
                },
                {
                  name: 'Mohammed.s',
                  location: 'Lebu',
                  image: 'https://pixabay.com/get/g7893f80df5844945bc3b38450392d79ae6af446f8eb7b0398f7fa19e436ada40c11be6cfbc8eb4dee776c9989251b20ab17e19267aa6a0451ec993e4e2643d6b_1280.jpg'
                }
              ].map((project, index) => (
                <Card key={index} className="shadow-lg overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={`${project.name} Project in ${project.location}`}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h4>
                    <p className="text-temer-gray">Location - {project.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Latest Properties</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Discover the latest real estate in Ethiopia featuring trusted apartments for sale in Addis Ababa — residential, commercial, and mixed-use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'LYCEE 003- One Bedroom Apartment',
                description: 'This one-bedroom apartment for sale in Ethiopia offers a thoughtfully designed and comfortable living space, ideal for individuals or couples.',
                beds: 1,
                baths: 1,
                size: 86,
                location: 'Lycee 003, Piyassa',
                image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'LYCEE 003- Two Bedroom Apartment',
                description: 'These two-bedroom apartments for sale in Ethiopia provide a well-designed and comfortable living space, ideal for small families or couples.',
                beds: 2,
                baths: 1,
                size: 86,
                location: 'Lycee 003, Piyassa',
                image: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Sarbet -Au, Three Bedroom Apartment',
                description: 'The three-bedroom apartments offer a spacious and versatile living space, featuring comfortable bedrooms and a serene master suite, ideal for families.',
                beds: 3,
                baths: 2,
                size: 130,
                location: 'Sarbet, sarbet-seken',
                image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Mehamud Muzika Bet, Shops',
                description: 'Located in Piassa, this 2B+G+5 commercial building offers units from 10 SQM. With excavation completed, it includes key amenities like an elevator and parking.',
                beds: 0,
                baths: 0,
                size: 20,
                location: 'Mehamud Muzika Bet, Piyassa',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              }
            ].map((property, index) => (
              <Card key={index} className="property-card bg-white shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">For Sale</span>
                    <span className="bg-temer-blue text-white px-3 py-1 rounded-full text-sm font-medium">Active</span>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">New Offer</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{property.title}</h3>
                  <p className="text-temer-gray text-sm mb-4">{property.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-temer-gray">
                      <span className="flex items-center">
                        <i className="fas fa-bed mr-1"></i>
                        {property.beds} Beds
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-bath mr-1"></i>
                        {property.baths} Baths
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-expand-arrows-alt mr-1"></i>
                        {property.size} m²
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-temer-gray">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {property.location}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="bg-temer-blue text-white hover:bg-blue-700"
                        onClick={() => window.location.href = 'tel:+251975666699'}
                        data-testid={`property-call-${index}`}
                      >
                        Call
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-temer-blue text-temer-blue hover:bg-temer-blue hover:text-white"
                        onClick={() => window.location.href = 'mailto:info@temerproperties.com'}
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
              className="bg-temer-blue hover:bg-blue-700 text-white"
              data-testid="load-more-properties"
            >
              Load More Listings
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
                image: 'https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Sarbet Au - 3rd Floor Progress',
                description: 'Third floor concrete pouring completed. Electrical and plumbing rough-ins are in progress according to schedule.',
                date: 'January 12, 2025',
                status: '75% Complete',
                statusColor: 'bg-blue-100 text-blue-800',
                image: 'https://pixabay.com/get/g6565782dac89ac792be64777fcb5ff5d1d1081706d7f9ac4afc8f877415e77861664ac257f9176bb99c31a166cb3b9b5_1280.jpg'
              },
              {
                title: 'Mehamud Muzika - Excavation Done',
                description: 'Excavation phase completed successfully. Site preparation for foundation work begins next week.',
                date: 'January 10, 2025',
                status: '25% Complete',
                statusColor: 'bg-yellow-100 text-yellow-800',
                image: 'https://pixabay.com/get/gf1adbafb1fbed654e2a11b0e85ece3e29bc9156d716684e1c95478e7514fc6787364c9f2d286fbf353b023dafadd7a1ab69a50778fb2aba6902c1d66d611f36e_1280.jpg'
              },
              {
                title: 'Ayat Lomiyad - Final Touches',
                description: 'Interior finishing work is 90% complete. Landscaping and exterior work are being finalized for delivery.',
                date: 'January 8, 2025',
                status: '90% Complete',
                statusColor: 'bg-green-100 text-green-800',
                image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Haile Garment - Structure Rising',
                description: 'Steel framework installation completed for first three floors. Concrete work scheduled to begin this week.',
                date: 'January 5, 2025',
                status: '45% Complete',
                statusColor: 'bg-blue-100 text-blue-800',
                image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Sumaletera - Ready for Delivery',
                description: 'Project completed successfully and ready for handover. All units have passed final quality inspections.',
                date: 'January 3, 2025',
                status: 'Complete',
                statusColor: 'bg-green-100 text-green-800',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              }
            ].map((update, index) => (
              <Card key={index} className="shadow-lg overflow-hidden border border-gray-100">
                <img 
                  src={update.image}
                  alt={update.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{update.title}</h3>
                  <p className="text-sm text-temer-gray mb-3">{update.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-temer-gray">Updated: {update.date}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${update.statusColor}`}>
                      {update.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Read From Our Blog</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Explore insightful articles about the Ethiopia real estate market, project updates, and expert advice from Temer Properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'A Green Legacy: Planting Hope in Addis Ababa',
                description: 'Our team arrived early in the morning when it was still quiet. We brought our cameras, brochures, caps, and t-shirts...',
                date: 'August 4, 2025',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'The Progress of Temer Properties: From Humble Beginnings',
                description: 'In the streets of Somale Tera, on the 5th floor of the Beto Building, a dream was born. Just 50 dedicated employees...',
                date: 'August 1, 2025',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'High-Quality Homes, Honest Prices: The Temer Properties Standard',
                description: 'In Ethiopia\'s fast-growing real estate market, where housing demand continues to rise amidst urbanization and economic...',
                date: 'July 29, 2025',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Office Tour: Inside Temer Properties Sarbet HQ',
                description: 'Welcome to a New Kind of Real Estate Experience. When most people think of real estate in Ethiopia, they picture conventional...',
                date: 'August 11, 2025',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
              },
              {
                title: 'Temer Properties Hosts Lifesaving Blood Donation Campaign',
                description: 'A Blood Donation Success at Temer Properties. Over three inspiring days, Temer Properties proudly hosted a blood donation...',
                date: 'August 8, 2025',
                image: 'https://pixabay.com/get/ge3f5e64e3246e44a69d6589d30ff34d4b1ee6b6459b0d976e6d23da122586d0925fad6c014419c6956b204047c52332e99c151d5db0b96c96780a2bec215a4aa_1280.jpg'
              }
            ].map((post, index) => (
              <Card key={index} className="shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-temer-gray mb-3">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
                  <p className="text-temer-gray text-sm mb-4">{post.description}</p>
                  <a href="#" className="text-temer-blue font-medium hover:text-blue-700 transition-colors">
                    Continue reading →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-temer-blue hover:bg-blue-700 text-white"
              data-testid="view-all-articles"
            >
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Our dedicated sales officers and agents are here to help you find your perfect property in Ethiopia
            </p>
          </div>

          {/* Sales Officers */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sales Officers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Dawit Tekle',
                  title: 'Senior Sales Officer',
                  phone: '+251 911 123 456',
                  email: 'dawit@temerproperties.com',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
                },
                {
                  name: 'Selamawit Haile',
                  title: 'Sales Officer',
                  phone: '+251 911 234 567',
                  email: 'selamawit@temerproperties.com',
                  image: 'https://pixabay.com/get/g976b84311cb3b1f46d8b702e7a5fa361b26062e847e84cc050e3eeccb8b0a3c90f081e2370ec9c6510386f8090dd1620bb6981cf0fd34e7f3bc3b6acbb096d4f_1280.jpg'
                },
                {
                  name: 'Henok Alemayehu',
                  title: 'Sales Officer',
                  phone: '+251 911 345 678',
                  email: 'henok@temerproperties.com',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
                }
              ].map((officer, index) => (
                <Card key={index} className="bg-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <img 
                      src={officer.image}
                      alt={`${officer.name} - ${officer.title}`}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{officer.name}</h4>
                    <p className="text-temer-blue font-medium mb-3">{officer.title}</p>
                    <div className="space-y-2 text-sm text-temer-gray">
                      <p className="flex items-center justify-center">
                        <i className="fas fa-phone mr-2"></i>
                        <span>{officer.phone}</span>
                      </p>
                      <p className="flex items-center justify-center">
                        <i className="fas fa-envelope mr-2"></i>
                        <span>{officer.email}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sales Agents */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Sales Agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Meron Bekele',
                  phone: '+251 912 456 789',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
                },
                {
                  name: 'Abel Tadesse',
                  phone: '+251 912 567 890',
                  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
                },
                {
                  name: 'Hanna Mesfin',
                  phone: '+251 912 678 901',
                  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
                },
                {
                  name: 'Yohannes Gebre',
                  phone: '+251 912 789 012',
                  image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400'
                }
              ].map((agent, index) => (
                <Card key={index} className="bg-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <img 
                      src={agent.image}
                      alt={`${agent.name} - Sales Agent`}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{agent.name}</h4>
                    <p className="text-temer-blue font-medium mb-2 text-sm">Sales Agent</p>
                    <p className="text-xs text-temer-gray">
                      <i className="fas fa-phone mr-1"></i>
                      {agent.phone}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-lg text-temer-gray max-w-2xl mx-auto">
              Get in touch with us to find your perfect property or learn more about our services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a Message</h3>
                <form onSubmit={handleContactForm} className="space-y-6">
                  <div>
                    <Label htmlFor="contact-name">Full Name</Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      data-testid="contact-name-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      data-testid="contact-email-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      required
                      data-testid="contact-phone-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us about your property requirements..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                      data-testid="contact-message-textarea"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-temer-blue hover:bg-blue-700"
                    size="lg"
                    data-testid="contact-submit-button"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-temer-blue rounded-lg flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Office Address</h4>
                        <p className="text-temer-gray">Somale Tera, 5th Floor<br/>Beto Building, Addis Ababa, Ethiopia</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-temer-blue rounded-lg flex items-center justify-center">
                        <i className="fas fa-phone text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Phone Numbers</h4>
                        <p className="text-temer-gray">+251975666699<br/>Hotline: 6033</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-temer-blue rounded-lg flex items-center justify-center">
                        <i className="fas fa-envelope text-white"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Email</h4>
                        <p className="text-temer-gray">info@temerproperties.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a 
                        href="https://web.facebook.com/temerproperties" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                        data-testid="social-facebook"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a 
                        href="http://www.youtube.com/@TemerProperties" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                        data-testid="social-youtube"
                      >
                        <i className="fab fa-youtube"></i>
                      </a>
                      <a 
                        href="https://www.instagram.com/temerproperties" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                        data-testid="social-instagram"
                      >
                        <i className="fab fa-instagram"></i>
                      </a>
                      <a 
                        href="https://x.com/TemerProperties" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                        data-testid="social-twitter"
                      >
                        <i className="fab fa-x-twitter"></i>
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/temer-realestate/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                        data-testid="social-linkedin"
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a 
                        href="https://t.me/temer_properties" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                        data-testid="social-telegram"
                      >
                        <i className="fab fa-telegram-plane"></i>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Embedded Map Placeholder */}
              <Card className="shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-temer-gray">
                    <i className="fas fa-map text-4xl mb-4"></i>
                    <p>Interactive Map</p>
                    <p className="text-sm">Somale Tera, Addis Ababa</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-temer-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">TEMER PROPERTIES</h3>
                  <p className="text-sm text-gray-400">MAKE YOUR NEXT MOVE WITH US</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Leading real estate company in Ethiopia, providing quality apartments for sale in Addis Ababa with trusted development and exceptional service.
              </p>
              <div className="flex space-x-4">
                <a href="https://web.facebook.com/temerproperties" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="http://www.youtube.com/@TemerProperties" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.instagram.com/temerproperties" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://x.com/TemerProperties" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-x-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/company/temer-realestate/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://t.me/temer_properties" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-telegram-plane"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">Projects</button></li>
                <li><button onClick={() => scrollToSection('properties')} className="hover:text-white transition-colors">Properties</button></li>
                <li><button onClick={() => scrollToSection('blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Property Sales</li>
                <li>Real Estate Development</li>
                <li>Construction Updates</li>
                <li>Property Investment</li>
                <li>Market Analysis</li>
                <li>Customer Support</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Somale Tera, 5th Floor<br/>
                  Beto Building, Addis Ababa
                </p>
                <p>
                  <i className="fas fa-phone mr-2"></i>
                  +251975666699
                </p>
                <p>
                  <i className="fas fa-phone mr-2"></i>
                  Hotline: 6033
                </p>
                <p>
                  <i className="fas fa-envelope mr-2"></i>
                  info@temerproperties.com
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Temer Properties. All rights reserved. | 
              <a href="#" className="hover:text-white transition-colors"> Privacy Policy</a> | 
              <a href="#" className="hover:text-white transition-colors"> Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
