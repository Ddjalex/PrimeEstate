import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";
import { HomePage } from "./enhanced-home";

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties']
  });

  const property = properties.find(p => p.id === id);

  useEffect(() => {
    if (property) {
      // Trigger the property modal to open
      // This simulates clicking the "View Details" button
      const event = new CustomEvent('openPropertyModal', { 
        detail: { property } 
      });
      window.dispatchEvent(event);
    }
  }, [property]);

  // Render the enhanced home page which will handle the modal
  return <HomePage propertyId={id} />;
}