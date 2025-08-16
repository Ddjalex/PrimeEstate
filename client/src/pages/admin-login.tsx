import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Store auth credentials for future requests
      const auth = btoa(`${credentials.username}:${credentials.password}`);
      sessionStorage.setItem("admin_auth", auth);
      
      toast({
        title: "Success",
        description: "Admin login successful",
      });

      setLocation("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
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
            Admin Login
          </CardTitle>
          <p className="text-center text-gray-600">
            Temer Properties Admin Dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                data-testid="input-username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                data-testid="input-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-temer-blue hover:bg-blue-700 text-white"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
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