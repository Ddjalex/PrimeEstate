import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminRegister() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "",
    isAdmin: true 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest("/api/admin/register", {
        method: "POST",
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          isAdmin: userData.isAdmin,
        }),
      });
      
      toast({
        title: "Success",
        description: "Admin user created successfully! You can now login.",
      });

      setLocation("/admin/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create Admin Account
          </CardTitle>
          <p className="text-center text-gray-600">
            Temer Properties Admin Registration
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                data-testid="input-username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                data-testid="input-password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={userData.confirmPassword}
                onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                data-testid="input-confirm-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-temer-blue hover:bg-blue-700 text-white"
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <Button
              variant="link"
              onClick={() => setLocation("/admin/login")}
              data-testid="link-login"
            >
              Already have an account? Sign In
            </Button>
            <br />
            <Button
              variant="link"
              onClick={() => setLocation("/")}
              data-testid="link-home"
            >
              Back to Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}