import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { 
  Home, 
  Building2, 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';
import type { Property, PropertyImage } from "@shared/schema";

interface PropertyWithImages extends Property {
  images?: PropertyImage[];
}

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  newThisMonth: number;
  averageSize: number;
  propertiesByType: { type: string; count: number; }[];
  propertiesByLocation: { location: string; count: number; }[];
  monthlyTrend: { month: string; count: number; }[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyWithImages | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [propertyForm, setPropertyForm] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "",
    bedrooms: 0,
    bathrooms: 0,
    size: 0,
    status: [] as string[],
    imageUrls: [] as string[],
  });

  // Check authentication
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const getAuthHeaders = () => ({
    Authorization: `Basic ${sessionStorage.getItem("admin_auth")}`,
  });

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: () => apiRequest("/api/properties"),
  });

  // Calculate dashboard statistics
  const dashboardStats: DashboardStats = useMemo(() => {
    if (!properties.length) {
      return {
        totalProperties: 0,
        activeListings: 0,
        newThisMonth: 0,
        averageSize: 0,
        propertiesByType: [],
        propertiesByLocation: [],
        monthlyTrend: []
      };
    }

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalProperties: properties.length,
      activeListings: properties.filter((p: Property) => p.isActive).length,
      newThisMonth: properties.filter((p: Property) => 
        new Date(p.createdAt) >= thisMonth
      ).length,
      averageSize: Math.round(
        properties.reduce((sum: number, p: Property) => sum + p.size, 0) / properties.length
      ),
      propertiesByType: properties.reduce((acc: any[], p: Property) => {
        const existing = acc.find(item => item.type === p.propertyType);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: p.propertyType, count: 1 });
        }
        return acc;
      }, []),
      propertiesByLocation: properties.reduce((acc: any[], p: Property) => {
        const existing = acc.find(item => item.location === p.location);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ location: p.location, count: 1 });
        }
        return acc;
      }, []).slice(0, 5),
      monthlyTrend: Array.from({ length: 6 }, (_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleDateString('en', { month: 'short' });
        const count = properties.filter((p: Property) => {
          const pDate = new Date(p.createdAt);
          return pDate.getMonth() === month.getMonth() && 
                 pDate.getFullYear() === month.getFullYear();
        }).length;
        return { month: monthName, count };
      }).reverse()
    };

    return stats;
  }, [properties]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
      const matchesSearch = searchQuery === "" || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = filterType === "" || filterType === "all" || property.propertyType === filterType;
      const matchesLocation = filterLocation === "" || filterLocation === "all" || property.location === filterLocation;
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [properties, searchQuery, filterType, filterLocation]);

  // Mutations
  const createPropertyMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("/api/admin/properties", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Property created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Property updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }),
    onSuccess: () => {
      toast({ title: "Success", description: "Property deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setPropertyForm({
      title: "",
      description: "",
      location: "",
      propertyType: "",
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      status: [],
      imageUrls: [],
    });
    setEditingProperty(null);
    setShowPropertyForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProperty) {
      updatePropertyMutation.mutate({
        id: String(editingProperty.id),
        data: propertyForm,
      });
    } else {
      createPropertyMutation.mutate(propertyForm);
    }
  };

  const handleEdit = (property: PropertyWithImages) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property.title,
      description: property.description,
      location: property.location,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      size: property.size,
      status: property.status || [],
      imageUrls: property.imageUrls || [],
    });
    setShowPropertyForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deletePropertyMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setLocation("/admin/login");
  };

  const addImageUrl = () => {
    setPropertyForm({
      ...propertyForm,
      imageUrls: [...propertyForm.imageUrls, ""],
    });
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...propertyForm.imageUrls];
    newUrls[index] = url;
    setPropertyForm({ ...propertyForm, imageUrls: newUrls });
  };

  const removeImageUrl = (index: number) => {
    const newUrls = propertyForm.imageUrls.filter((_, i) => i !== index);
    setPropertyForm({ ...propertyForm, imageUrls: newUrls });
  };

  const addStatus = (status: string) => {
    if (!propertyForm.status.includes(status)) {
      setPropertyForm({
        ...propertyForm,
        status: [...propertyForm.status, status],
      });
    }
  };

  const removeStatus = (status: string) => {
    setPropertyForm({
      ...propertyForm,
      status: propertyForm.status.filter(s => s !== status),
    });
  };

  const COLORS = ['hsl(88, 50%, 53%)', 'hsl(88, 45%, 65%)', 'hsl(88, 40%, 75%)', 'hsl(88, 35%, 85%)', 'hsl(88, 30%, 90%)'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-temer-green rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Temer Properties</h1>
                <p className="text-temer-green font-medium">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4 mr-2 text-temer-green" />
                {dashboardStats.totalProperties} Total Properties
              </div>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="border-temer-green/30 text-temer-green hover:bg-temer-green/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Website
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-temer-green to-temer-dark-green text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-temer-green-foreground/80 text-sm font-medium">Total Properties</p>
                      <p className="text-3xl font-bold">{dashboardStats.totalProperties}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-white/80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Active Listings</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeListings}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-temer-green" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">New This Month</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.newThisMonth}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Average Size</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.averageSize}<span className="text-lg text-gray-500">m²</span></p>
                    </div>
                    <MapPin className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Types Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Properties by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardStats.propertiesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {dashboardStats.propertiesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trend Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Monthly Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardStats.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(88, 50%, 53%)" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(88, 50%, 53%)', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Locations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardStats.propertiesByLocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(88, 50%, 53%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setShowPropertyForm(true)}
                    className="bg-temer-green hover:bg-temer-dark-green text-white h-12"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                  </Button>
                  <Button
                    onClick={() => setActiveTab("properties")}
                    variant="outline"
                    className="border-temer-green/30 text-temer-green hover:bg-temer-green/10 h-12"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Manage Properties
                  </Button>
                  <Button
                    onClick={() => setActiveTab("analytics")}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 h-12"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {Array.from(new Set((properties as Property[]).map((p: Property) => p.location))).map((location: string) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowPropertyForm(true)}
                      className="bg-temer-green hover:bg-temer-dark-green text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-pulse">
                    <div className="text-lg text-gray-500">Loading properties...</div>
                  </div>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">No properties found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || filterType || filterLocation 
                        ? "Try adjusting your filters or search terms." 
                        : "Get started by creating your first property listing."
                      }
                    </p>
                    <Button
                      onClick={() => setShowPropertyForm(true)}
                      className="bg-temer-green hover:bg-temer-dark-green text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                </div>
              ) : (
                filteredProperties.map((property: PropertyWithImages) => (
                  <Card key={String(property.id)} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    {/* Property Image */}
                    <div className="relative h-48 overflow-hidden">
                      {property.imageUrls && property.imageUrls.length > 0 ? (
                        <img
                          src={property.imageUrls[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-temer-green/20 to-temer-green/40 flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-temer-green" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {property.status?.map((status) => (
                          <Badge 
                            key={status} 
                            className={`text-xs font-medium px-2 py-1 text-white border-0 ${
                              status === 'For Sale' 
                                ? 'bg-temer-green' 
                                : status === 'Active'
                                ? 'bg-blue-600'
                                : status === 'New Offer'
                                ? 'bg-orange-600'
                                : 'bg-gray-600'
                            }`}
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Menu */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(property)}
                            className="bg-white/90 hover:bg-white text-gray-700 w-8 h-8 p-0 shadow-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(String(property.id))}
                            className="bg-red-500/90 hover:bg-red-600 text-white w-8 h-8 p-0 shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Property Content */}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-temer-green transition-colors duration-200">
                        {property.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      
                      {/* Property Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {property.bedrooms || 0}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Beds
                          </div>
                        </div>
                        <div className="text-center border-l border-r border-gray-200">
                          <div className="text-lg font-bold text-gray-900">
                            {property.bathrooms || 0}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Baths
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {property.size}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            m²
                          </div>
                        </div>
                      </div>

                      {/* Location and Type */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-temer-green" />
                          <span className="font-medium">{property.location}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {property.propertyType}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(property)}
                          className="bg-temer-green hover:bg-temer-dark-green text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(String(property.id))}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Properties by Type */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Properties by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dashboardStats.propertiesByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(88, 50%, 53%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Properties by Location */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Properties by Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dashboardStats.propertiesByLocation}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(88, 45%, 58%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Growth */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Property Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dashboardStats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(88, 50%, 53%)" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(88, 50%, 53%)', strokeWidth: 2, r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-bold">
                {editingProperty ? "Edit Property" : "Add New Property"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      value={propertyForm.title}
                      onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={propertyForm.location}
                      onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={propertyForm.description}
                    onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                    required
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                      value={propertyForm.propertyType}
                      onValueChange={(value) => setPropertyForm({ ...propertyForm, propertyType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="shops">Shops</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      value={propertyForm.bedrooms}
                      onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      value={propertyForm.bathrooms}
                      onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Size (m²)</Label>
                    <Input
                      id="size"
                      type="number"
                      min="1"
                      value={propertyForm.size}
                      onChange={(e) => setPropertyForm({ ...propertyForm, size: parseInt(e.target.value) || 0 })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Status Management */}
                <div>
                  <Label>Property Status</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {propertyForm.status.map((status) => (
                      <Badge
                        key={status}
                        className="cursor-pointer bg-temer-green hover:bg-temer-dark-green"
                        onClick={() => removeStatus(status)}
                      >
                        {status} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addStatus("For Sale")}
                      className="border-temer-green/30 text-temer-green hover:bg-temer-green/10"
                    >
                      + For Sale
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addStatus("Active")}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      + Active
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addStatus("New Offer")}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      + New Offer
                    </Button>
                  </div>
                </div>

                {/* Image URLs */}
                <div>
                  <Label>Property Images</Label>
                  <div className="space-y-2 mt-2">
                    {propertyForm.imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={url}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          placeholder="Enter image URL"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImageUrl(index)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addImageUrl}
                      className="w-full border-temer-green/30 text-temer-green hover:bg-temer-green/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image URL
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-temer-green hover:bg-temer-dark-green text-white"
                    disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                  >
                    {createPropertyMutation.isPending || updatePropertyMutation.isPending
                      ? "Saving..."
                      : editingProperty ? "Update Property" : "Create Property"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}