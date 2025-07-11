import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertSkillSchema, insertConnectionSchema, type InsertSkill, type Skill, type InsertConnection } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  // Debug logging
  console.log("Skills data:", skills);
  console.log("Is loading:", isLoading);

  const form = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: "",
      canTeach: "",
      wantsToLearn: "",
    },
  });

  const connectionForm = useForm<InsertConnection>({
    resolver: zodResolver(insertConnectionSchema),
    defaultValues: {
      fromSkillId: 0,
      toSkillId: 0,
      message: "",
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const response = await apiRequest("POST", "/api/skills", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      form.reset();
      toast({
        title: "Success!",
        description: "Your skills have been shared with the community.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to share your skills. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createConnectionMutation = useMutation({
    mutationFn: async (data: InsertConnection) => {
      console.log("Sending connection request:", data);
      const response = await apiRequest("POST", "/api/connections", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Connection request successful:", data);
      setIsConnectionModalOpen(false);
      connectionForm.reset();
      toast({
        title: "Connection Request Sent!",
        description: "Your connection request has been sent successfully.",
      });
    },
    onError: (error) => {
      console.error("Connection request failed:", error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSkill) => {
    createSkillMutation.mutate(data);
  };

  const onConnectionSubmit = (data: InsertConnection) => {
    createConnectionMutation.mutate(data);
  };

  const handleConnect = (skill: Skill) => {
    setSelectedSkill(skill);
    connectionForm.setValue("toSkillId", skill.id);
    // Use the first available skill as the "from" skill
    if (skills.length > 0) {
      connectionForm.setValue("fromSkillId", skills[0].id);
    }
    setIsConnectionModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const gradientColors = [
    'from-blue-500 to-indigo-600',
    'from-indigo-600 to-blue-500',
    'from-green-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-teal-500 to-cyan-500',
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-gray-900">SkillSwap</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Connect • Learn • Grow</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Your Skills, Learn from Others</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of learners and teachers. Share what you know, discover what you want to learn, and connect with like-minded people.
          </p>
        </div>

        {/* Add New Skill Form */}
        <Card className="mb-8 border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">+</span>
              </div>
              Add Your Skills
            </h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">Your Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="canTeach" className="text-sm font-medium text-gray-700 mb-2">Can Teach</Label>
                  <Input
                    id="canTeach"
                    {...form.register("canTeach")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="What can you teach?"
                  />
                  {form.formState.errors.canTeach && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.canTeach.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="wantsToLearn" className="text-sm font-medium text-gray-700 mb-2">Wants to Learn</Label>
                  <Input
                    id="wantsToLearn"
                    {...form.register("wantsToLearn")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                    placeholder="What do you want to learn?"
                  />
                  {form.formState.errors.wantsToLearn && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.wantsToLearn.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={createSkillMutation.isPending}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {createSkillMutation.isPending ? "Sharing..." : "Share My Skills"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Community Skills</h3>
            <span className="text-sm text-gray-500">
              {skills.length} member{skills.length !== 1 ? 's' : ''} sharing skills
            </span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 border-gray-200">
                  <div className="animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="ml-3 flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills shared yet</h3>
              <p className="text-gray-500">Be the first to share your skills with the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <Card key={skill.id} className="p-6 border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-medium text-sm">
                          {getInitials(skill.name)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                        <p className="text-sm text-gray-500">{getTimeAgo(skill.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-success rounded-full mt-2 mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Can Teach:</p>
                          <p className="text-sm text-gray-900 mt-1">{skill.canTeach}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Wants to Learn:</p>
                          <p className="text-sm text-gray-900 mt-1">{skill.wantsToLearn}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleConnect(skill)}
                        className="text-primary text-sm font-medium hover:text-blue-600 transition-colors duration-200"
                      >
                        Connect
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Built with ❤️ for the learning community.{' '}
              <span className="text-primary">SkillSwap</span> - Where knowledge meets opportunity.
            </p>
          </div>
        </div>
      </footer>

      {/* Connection Request Modal */}
      <Dialog open={isConnectionModalOpen} onOpenChange={setIsConnectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with {selectedSkill?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={connectionForm.handleSubmit(onConnectionSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message (optional)</Label>
              <Textarea
                id="message"
                {...connectionForm.register("message")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder="Write a message (e.g., 'Hello, I'd like to connect!')"
              />
            </div>
            <Button 
              type="submit" 
              disabled={createConnectionMutation.isPending}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {createConnectionMutation.isPending ? "Sending..." : "Send Connection Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
