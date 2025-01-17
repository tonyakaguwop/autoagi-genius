import React, { useState, useEffect } from "react";
import { useAIStore } from "../store/useAIStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyForm } from "./ApiKeyForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const { thinking, setThinking } = useAIStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);

  // Check for authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!session?.user) {
        console.log("No authenticated user");
        return [];
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!session?.user // Only fetch if user is authenticated
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (description: string) => {
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          description,
          user_id: session.user.id // Set the user_id when inserting
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task added",
        description: "Your request is being processed",
      });
    },
    onError: (error: any) => {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to add tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      setThinking(true);
      await addTaskMutation.mutateAsync(input);
      setInput("");
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setThinking(false);
    }
  };

  // If not authenticated, show message
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary to-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary">Please sign in to use the AI Assistant</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">AI Assistant</h1>
          </div>
          <p className="text-gray-600">Your autonomous AI agent for task execution</p>
        </header>

        <ApiKeyForm />

        <Card className="p-6 bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your task or question..."
              className="flex-1"
              disabled={thinking}
            />
            <Button type="submit" disabled={thinking}>
              {thinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            </Card>
          ) : tasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 transition-all duration-200 ${
                task.status === "running" ? "animate-task-pulse" : ""
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{task.description}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : task.status === "running"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                {task.result && (
                  <p className="text-sm text-gray-600">{task.result}</p>
                )}
                <p className="text-xs text-gray-400">
                  Created: {new Date(task.created_at).toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};