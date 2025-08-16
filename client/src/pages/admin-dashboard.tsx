import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Property, PropertyImage } from "@shared/schema";

interface PropertyWithImages extends Property {
  images?: PropertyImage[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyWithImages | null>(null);
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

  // Create property mutation
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

  // Update property mutation
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

  // Delete property mutation
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
        id: editingProperty.id,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header - Temer Style */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Temer Properties</h1>
                <p className="text-green-600 font-medium">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {properties.length} Properties Listed
              </div>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                data-testid="button-view-website"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Website
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                data-testid="button-logout"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Actions Bar */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
              <p className="text-gray-600">Manage your real estate listings</p>
            </div>
            <Button
              onClick={() => setShowPropertyForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
              data-testid="button-add-property"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Property
            </Button>
          </div>
        </div>

        {/* Property Form Modal */}
        {showPropertyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={propertyForm.title}
                        onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                        required
                        data-testid="input-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={propertyForm.location}
                        onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                        required
                        data-testid="input-location"
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
                      data-testid="input-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select
                        value={propertyForm.propertyType}
                        onValueChange={(value) => setPropertyForm({ ...propertyForm, propertyType: value })}
                      >
                        <SelectTrigger data-testid="select-property-type">
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
                        data-testid="input-bedrooms"
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
                        data-testid="input-bathrooms"
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
                        data-testid="input-size"
                      />
                    </div>
                  </div>

                  {/* Status Management */}
                  <div>
                    <Label>Property Status</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {propertyForm.status.map((status) => (
                        <Badge
                          key={status}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeStatus(status)}
                        >
                          {status} <i className="fas fa-times ml-1"></i>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addStatus("For Sale")}
                      >
                        + For Sale
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addStatus("Active")}
                      >
                        + Active
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addStatus("New Offer")}
                      >
                        + New Offer
                      </Button>
                    </div>
                  </div>

                  {/* Image URLs */}
                  <div>
                    <Label>Image URLs</Label>
                    <div className="space-y-2 mt-2">
                      {propertyForm.imageUrls.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={url}
                            onChange={(e) => updateImageUrl(index, e.target.value)}
                            placeholder="Enter image URL"
                            data-testid={`input-image-url-${index}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImageUrl(index)}
                            data-testid={`button-remove-image-${index}`}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addImageUrl}
                        data-testid="button-add-image"
                      >
                        + Add Image URL
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-temer-blue hover:bg-blue-700 text-white"
                      disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                      data-testid="button-save-property"
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

        {/* Properties Grid - Temer Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-pulse">
                <div className="text-lg text-gray-500">Loading properties...</div>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-500">Get started by creating your first property listing.</p>
              </div>
            </div>
          ) : (
            properties.map((property: PropertyWithImages) => (
              <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white rounded-lg overflow-hidden">
                {/* Property Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.status?.map((status) => (
                      <Badge 
                        key={status} 
                        className={`text-xs font-medium px-3 py-1 text-white border-0 ${
                          status === 'For Sale' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : status === 'Active'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : status === 'New Offer'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors duration-200"
                        data-testid={`button-edit-${property.id}`}
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="bg-red-500/90 hover:bg-red-600 p-2 rounded-full shadow-lg transition-colors duration-200"
                        data-testid={`button-delete-${property.id}`}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Property Content */}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
                    {property.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {property.description}
                  </p>
                  
                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4 py-3 px-4 bg-gray-50 rounded-lg">
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

                  {/* Location */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{property.location}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(property)}
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors duration-200"
                      data-testid={`button-edit-${property.id}`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                      data-testid={`button-delete-${property.id}`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}