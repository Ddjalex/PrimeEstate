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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Temer Properties Management</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                data-testid="button-view-website"
              >
                View Website
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8">
          <Button
            onClick={() => setShowPropertyForm(true)}
            className="bg-temer-blue hover:bg-blue-700 text-white"
            data-testid="button-add-property"
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Property
          </Button>
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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No properties found. Create your first property!</p>
            </div>
          ) : (
            properties.map((property: PropertyWithImages) => (
              <Card key={property.id} className="shadow-lg">
                {property.imageUrls && property.imageUrls.length > 0 && (
                  <img
                    src={property.imageUrls[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {property.status?.map((status) => (
                      <Badge key={status} variant="secondary" className="text-xs">
                        {status}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{property.description}</p>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>Beds: {property.bedrooms}</span>
                    <span>Baths: {property.bathrooms}</span>
                    <span>{property.size} m²</span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(property)}
                      data-testid={`button-edit-${property.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(property.id)}
                      data-testid={`button-delete-${property.id}`}
                    >
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