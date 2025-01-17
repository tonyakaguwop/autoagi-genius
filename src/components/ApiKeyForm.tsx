import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getGeminiApiKey, setGeminiApiKey } from "@/utils/apiKeys";

export const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = getGeminiApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setGeminiApiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved securely",
      });
    }
  };

  return (
    <Card className="p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Gemini API Key</h2>
        </div>
        <p className="text-sm text-gray-600">
          Enter your Google Gemini API key to enable AI features.{" "}
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Get your API key here
          </a>
        </p>
        <div className="flex space-x-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="flex-1"
          />
          <Button type="submit">Save Key</Button>
        </div>
      </form>
    </Card>
  );
};