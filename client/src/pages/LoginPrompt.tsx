import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

interface LoginPromptProps {
  setUserEmail: (email: string | null) => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ setUserEmail }) => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    localStorage.setItem("userEmail", email);
    setUserEmail(email); // Update the state in App component
    navigate("/report");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-gradient-card">
        <CardHeader className="text-center">
          <Mail className="h-10 w-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-foreground">
            Enter Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContinue} className="space-y-4">
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-[#0D4D4D] hover:bg-[#0b3c3c] text-white"
            >
              Continue to Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPrompt;