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
    'from-yellow-400 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">SkillSwap</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">Connect • Learn • Grow</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Live Community
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Share Your Skills, Learn from Others
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our vibrant community of learners and teachers. Share what you know, discover what you want to learn, and connect with like-minded people.
          </p>
        </div>

        {/* Add New Skill Form */}
        <Card className="mb-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              Add Your Skills
            </h3>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Your Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="Enter your name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-2">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="canTeach" className="text-sm font-semibold text-gray-700">Can Teach</Label>
                  <Input
                    id="canTeach"
                    {...form.register("canTeach")}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="What can you teach?"
                  />
                  {form.formState.errors.canTeach && (
                    <p className="text-red-500 text-sm mt-2">{form.formState.errors.canTeach.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wantsToLearn" className="text-sm font-semibold text-gray-700">Wants to Learn</Label>
                  <Input
                    id="wantsToLearn"
                    {...form.register("wantsToLearn")}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="What do you want to learn?"
                  />
                  {form.formState.errors.wantsToLearn && (
                    <p className="text-red-500 text-sm mt-2">{form.formState.errors.wantsToLearn.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={createSkillMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createSkillMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sharing...
                    </div>
                  ) : (
                    "Share My Skills"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Community Skills</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">
                {skills.length} member{skills.length !== 1 ? 's' : ''} sharing skills
              </span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <div className="animate-pulse">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-5 bg-gray-300 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No skills shared yet</h3>
              <p className="text-gray-500 text-lg">Be the first to share your skills with the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill, index) => (
                <Card key={skill.id} className="p-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white font-bold text-lg">
                          {getInitials(skill.name)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900 text-lg">{skill.name}</h4>
                        <p className="text-sm text-gray-500">{getTimeAgo(skill.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2 mr-4"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Can Teach:</p>
                          <p className="text-gray-900 font-medium">{skill.canTeach}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Wants to Learn:</p>
                          <p className="text-gray-900 font-medium">{skill.wantsToLearn}</p>
                        </div>
                      </div>
                    </div>
                    

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <button 
                        onClick={() => handleConnect(skill)}
                        className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors duration-200 flex items-center group"
                      >
                        <span className="mr-2">Connect</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>

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
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              Built with ❤️ for the learning community.{' '}
              <span className="text-blue-600 font-semibold">SkillSwap</span> - Where knowledge meets opportunity.
            </p>
          </div>
        </div>
      </footer>

      {/* Connection Request Modal */}
      <Dialog open={isConnectionModalOpen} onOpenChange={setIsConnectionModalOpen}>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Connect with {selectedSkill?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={connectionForm.handleSubmit(onConnectionSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-3 block">Message (optional)</Label>
              <Textarea
                id="message"
                {...connectionForm.register("message")}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Write a message (e.g., 'Hello, I'd like to connect!')"
                rows={4}

              />
            </div>
            <Button 
              type="submit" 
              disabled={createConnectionMutation.isPending}

              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createConnectionMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Connection Request"
              )}

            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
