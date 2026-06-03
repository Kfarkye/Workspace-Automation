import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Mail, 
  FileText, 
  Settings, 
  Plus, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LayoutDashboard,
  Database,
  History,
  Send,
  Loader2,
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  LogOut
} from "lucide-react";


import { useAuth } from "./hooks/useAuth";
import { useWorkspaceData } from "./hooks/useWorkspaceData";
import { useAgent } from "./hooks/useAgent";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Toaster, toast } from "sonner";
import { Separator } from "./components/ui/separator";



export default function App() {
  const { user, loading, isSigningIn, handleSignIn, handleSignOut } = useAuth();
  const { workflows, intelligence } = useWorkspaceData(user);
  const { chatInput, setChatInput, isProcessing, handleAgentChat } = useAgent(user);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6 p-8 bg-[#0A0A0A] rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 border border-[#222222]">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-medium text-3xl shadow-inner pt-1 border border-white/10">G</div>
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-tight text-white mb-2">Workspace Automator</h1>
            <p className="text-[#86868B] text-sm">Sign in to access your autonomous agents.</p>
          </div>
          <button 
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full bg-white text-black font-medium py-3 px-4 rounded-xl hover:scale-[0.98] transition-transform active:scale-95 shadow-xl shadow-white/5 disabled:opacity-75 flex items-center justify-center disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Signing in...
              </>
            ) : "Continue with Google"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-[#1A1C1E] font-sans overflow-hidden flex-col select-none md:select-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <Toaster position="top-right" />
      
      {/* Top Navigation Bar */}
      <nav className="h-14 md:h-16 bg-[#0A0A0A]  px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-medium text-xl shadow-inner pt-1">G</div>
          <span className="text-sm md:text-lg font-medium tracking-tight hidden sm:block">Gemini Workspace <span className="text-[var(--color-aura-accent)] font-medium italic">Automator</span></span>
          <span className="text-lg font-medium tracking-tight sm:hidden">Workspace</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#111111] text-white rounded-full ">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-[10px] font-medium text-white tracking-tight">GCP Vertex AI Online</span>
          </div>
          <div className="flex items-center gap-3  pl-0 sm:pl-6 ">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-medium">{user?.email?.split('@')[0] || "Guest"}</span>
              <span className="text-[10px] text-[#86868B] font-medium tracking-tight leading-none">Enterprise</span>
            </div>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#111111]  flex items-center justify-center">
              <UserIcon size={18} className="text-[#86868B]" />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} className="text-[#86868B]" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Viewport Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation - Desktop */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 256 : 80 }}
          className="bg-[#0A0A0A]  p-4 hidden md:flex flex-col gap-8 z-20 shrink-0"
        >
          <section>
            <h3 className={`text-[10px] tracking-tight text-[#86868B] font-medium mb-4 px-2 ${!isSidebarOpen && "hidden"}`}>
              Active Agents
            </h3>
            <nav className="flex flex-col gap-1">
              <NavButton 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                isActive={activeTab === "dashboard"} 
                onClick={() => setActiveTab("dashboard")} 
                collapsed={!isSidebarOpen}
              />
              <NavButton 
                icon={<Mail size={18} />} 
                label="Email Triage" 
                isActive={activeTab === "email_triage"} 
                onClick={() => setActiveTab("dashboard")} // Simplified for prototype
                collapsed={!isSidebarOpen}
              />
              <NavButton 
                icon={<Database size={18} />} 
                label="Data Extraction" 
                isActive={activeTab === "intelligence"} 
                onClick={() => setActiveTab("intelligence")} 
                collapsed={!isSidebarOpen}
              />
              <NavButton 
                icon={<History size={18} />} 
                label="Intent History" 
                isActive={activeTab === "workflows"} 
                onClick={() => setActiveTab("workflows")} 
                collapsed={!isSidebarOpen}
              />
            </nav>
          </section>

          {isSidebarOpen && (
            <section>
              <h3 className="text-[10px] tracking-tight text-[#86868B] font-medium mb-4 px-2">Connected Stacks</h3>
              <div className="space-y-3 px-2">
                <StackItem color="bg-red-400" label="Gmail API" />
                <StackItem color="bg-green-500" label="Sheets Sync" />
                <StackItem color="bg-blue-500" label="Docs Builder" />
              </div>
            </section>
          )}

          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start text-[#86868B]" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={16} className="mr-2" />
              {isSidebarOpen && "Collapse Menu"}
            </Button>
            {isSidebarOpen && (
              <Button variant="ghost" className="w-full justify-start mt-2 text-[var(--color-aura-red)] hover:text-[var(--color-aura-red)] hover:bg-[#111111] text-white" size="sm" onClick={() => handleSignOut()}>
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </motion.aside>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-64 bg-[#0A0A0A] 2xl z-50 p-4 flex flex-col gap-8 md:hidden"
              >
                <div className="flex justify-between items-center -mt-2">
                  <span className="text-sm font-medium text-white">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={20} />
                  </Button>
                </div>
                <section>
                  <nav className="flex flex-col gap-2">
                    <NavButton icon={<LayoutDashboard size={18} />} label="Dashboard" isActive={activeTab === "dashboard"} onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} collapsed={false} />
                    <NavButton icon={<Mail size={18} />} label="Email Triage" isActive={activeTab === "email_triage"} onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} collapsed={false} />
                    <NavButton icon={<Database size={18} />} label="Data Extraction" isActive={activeTab === "intelligence"} onClick={() => { setActiveTab("intelligence"); setIsMobileMenuOpen(false); }} collapsed={false} />
                    <NavButton icon={<History size={18} />} label="Intent History" isActive={activeTab === "workflows"} onClick={() => { setActiveTab("workflows"); setIsMobileMenuOpen(false); }} collapsed={false} />
                  </nav>
                </section>
                <div className="mt-auto">
                  <Button variant="ghost" className="w-full justify-start text-[var(--color-aura-red)] hover:text-[var(--color-aura-red)] hover:bg-[#111111] text-white" size="sm" onClick={() => handleSignOut()}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden pb-16 md:pb-0">
          {/* Primary Workspace */}
          <section className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 shrink-0 gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#1A1C1E]">
                  {activeTab === "dashboard" ? "Workflow Orchestrator" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-xs md:text-sm text-[#86868B] mt-1">v1.5.2 Pro Tier Agentic Console</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex text-[10px] font-medium tracking-tight h-8">
                  Export Logs
                </Button>
                <Button size="sm" className="bg-white text-black hover:scale-95 transition-transform text-[10px] font-medium tracking-tight h-8 w-full sm:w-auto">
                  New Automation
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 -mx-4 px-4 md:mx-0 md:px-0">
              <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 animate-slide-up"
                  >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard title="Active Automations" value={workflows.length} change="+12% from last week" icon={<BarChart3 />} />
                      <StatCard title="Data Entities" value={intelligence.reduce((acc, curr) => acc + (Array.isArray(curr.extractedEntities) ? curr.extractedEntities.length : 0), 0)} change="+85 today" icon={<Database />} />
                      <StatCard title="Automation Value" value="$12.4k" change="Est. time savings" icon={<Clock />} />
                    </div>

                    {/* Intent Console Input (Integrated into Dashboard) */}
                    <div className="bg-[#0A0A0A] rounded-[2rem]  p-4 md:p-6 flex flex-col gap-4 mx-1 md:mx-0">
                      <div className="flex items-center gap-2 text-[10px] text-[#86868B] font-medium tracking-tight">
                        <Bot size={14} />
                        <span>Intent Recognition Active</span>
                      </div>
                      <textarea 
                        className="w-full h-24 md:h-32 text-base md:text-lg font-medium text-white placeholder-gray-300 outline-none resize-none" 
                        placeholder="What should the agent do today?"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        disabled={isProcessing}
                      ></textarea>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center  pt-4 mt-2 gap-3">
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-[10px] font-medium  bg-[#111111]/50">Attach Doc</Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-[10px] font-medium  bg-[#111111]/50 hidden sm:inline-flex">Set Schedule</Button>
                        </div>
                        <Button 
                          onClick={() => handleAgentChat()} 
                          disabled={isProcessing || !chatInput.trim()}
                          className="w-full sm:w-auto bg-white text-black hover:scale-95 transition-transform px-8 py-2 md:py-2.5 rounded-[1.5rem] font-medium text-xs tracking-tight md disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                          Execute Automation
                        </Button>
                      </div>
                    </div>

                    {/* Execution Feeds */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                      <div className="space-y-4">
                        <h2 className="text-sm font-medium text-[#86868B] tracking-tight">Recent Workflows</h2>
                        <div className="space-y-3">
                          {workflows.slice(0, 5).map((wf) => (
                            <div key={wf.id} className="p-4 bg-[#0A0A0A]  rounded-[2rem] hover:shadow-lg hover:shadow-white/5 transition-all group">
                              <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-0.5 text-[10px] font-medium rounded tracking-tight ${
                                  wf.type === "SUMMARIZE_EMAIL" ? "bg-[#111111] text-white text-white" :
                                  wf.type === "EXTRACT_DATA" ? "bg-[#111111] text-white text-white" : "bg-[#111111] text-white text-white"
                                }`}>
                                  {wf.type.replace("SUMMARIZE_", "").replace("_DATA", "").replace("GENERATE_", "")}
                                </span>
                                <span className="text-[10px] text-[#86868B] font-mono tracking-tighter">
                                  {wf.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm font-medium mb-1 truncate">{wf.inputContext}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-[10px] text-[#86868B]">
                                  {wf.type === "SUMMARIZE_EMAIL" ? "Email chain parsing → Firestore" : "Entity mapping → Sheets"}
                                </p>
                                <StatusBadge status={wf.status} />
                              </div>
                            </div>
                          ))}
                          {workflows.length === 0 && <EmptyState label="No workflows executed." />}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-sm font-medium text-[#86868B] tracking-tight">Knowledge Base</h2>
                        <div className="space-y-3">
                          {intelligence.slice(0, 3).map((item) => (
                            <div key={item.id} className="p-4 bg-[#0A0A0A]  rounded-[2rem]">
                              <div className="flex justify-between items-center mb-3 pb-2 ">
                                <span className="text-[10px] font-medium text-[#86868B] ">Extracted Intel</span>
                                <Badge variant="outline" className="text-[10px] rounded-sm py-0 h-4">{item.vetted ? "Verified" : "Pending"}</Badge>
                              </div>
                              <div className="space-y-2">
                                {Array.isArray(item.extractedEntities) && item.extractedEntities.slice(0, 2).map((e: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-[#86868B]">{e.vendor || e.item || "Entity"}</span>
                                    <span className="text-xs font-medium">${e.amount || "N/A"}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {intelligence.length === 0 && <EmptyState label="Knowledge base is empty." />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "workflows" && (
                  <motion.div key="workflows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-[#0A0A0A]  rounded-[2rem] overflow-hidden">
                       {/* Simplified list for history area */}
                       <table className="w-full text-left">
                        <thead className="bg-[#111111] ">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-medium tracking-tight text-[#86868B]">Type</th>
                            <th className="px-6 py-4 text-[10px] font-medium tracking-tight text-[#86868B]">Context</th>
                            <th className="px-6 py-4 text-[10px] font-medium tracking-tight text-[#86868B]">Status</th>
                            <th className="px-6 py-4 text-[10px] font-medium tracking-tight text-[#86868B] text-right">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {workflows.map(wf => (
                            <tr key={wf.id} className="hover:bg-[#111111]/50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-xs font-medium text-[var(--color-aura-accent)]">{wf.type}</span>
                              </td>
                              <td className="px-6 py-4 max-w-xs">
                                <p className="text-xs text-[#86868B] truncate">{wf.inputContext}</p>
                              </td>
                              <td className="px-6 py-4">
                                <StatusBadge status={wf.status} />
                              </td>
                              <td className="px-6 py-4 text-right text-[10px] font-mono text-[#86868B]">
                                {wf.createdAt?.toDate().toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === "intelligence" && (
                  <motion.div key="intelligence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {intelligence.map(item => (
                      <Card key={item.id} className=" rounded-[2rem] overflow-hidden">
                        <header className="p-4 bg-[#111111]  flex justify-between items-center">
                          <span className="text-[10px] font-medium  text-[#86868B] tracking-widest">Source: {item.id.slice(0, 8)}</span>
                          <Badge variant={item.vetted ? "default" : "outline"} className="text-[9px]  tracking-tighter">
                            {item.vetted ? "Synced to Sheets" : "Review Required"}
                          </Badge>
                        </header>
                        <CardContent className="p-4 space-y-3">
                          {Array.isArray(item.extractedEntities) && item.extractedEntities.map((e: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-[1.5rem] bg-black  hover:shadow-lg hover:shadow-white/5 transition-all">
                              <div>
                                <p className="text-[10px] font-medium  text-[var(--color-aura-accent)] tracking-wider mb-1">{e.vendor || "Unknown Vendor"}</p>
                                <p className="text-xs font-medium">{e.item || "Manual Entry"}</p>
                              </div>
                              <span className="text-sm font-medium text-white">${e.amount}</span>
                            </div>
                          ))}
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full bg-[#0A0A0A] text-[var(--color-aura-accent)]  hover:bg-[#111111] font-medium  text-[10px] tracking-widest h-10">
                            {item.vetted ? "View in Google Sheets" : "Verify & Push to Sheets"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </section>

          {/* Secondary Workspace (Reasoning Logs) - Desktop only by default, responsive logic can be added */}
          <section className="hidden lg:flex w-[400px] bg-black  p-6 flex-col shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-white tracking-tight">Live Agent Reasoning</h2>
              <div className={`w-2 h-2 rounded-full ${isProcessing ? 'aura-btn animate-pulse' : 'bg-gray-300'}`}></div>
            </div>
            
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              <div className="flex gap-3">
                <div className="w-1 h-auto bg-[#111111]0 rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-[var(--color-aura-accent)]  mb-1 tracking-widest">Active Logic Stream</p>
                  <p className="text-xs text-[#86868B] leading-relaxed italic line-clamp-4">
                    {isProcessing 
                      ? "Deconstructing user intent via Gemini... Identifying workspace endpoints... Orchestrating sequence." 
                      : (workflows[0] ? `"${workflows[0].inputContext}"` : "\"Awaiting next enterprise directive for autonomous execution...\"")}
                  </p>
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-[2rem] p-5  space-y-4">
                <div className="flex justify-between items-center  pb-3">
                  <span className="text-[10px] font-medium text-[#86868B] tracking-tight">Process Log</span>
                  <div className="flex gap-1">
                    <div className={`w-1 h-1 aura-btn rounded-full ${isProcessing ? 'animate-bounce' : ''}`}></div>
                    <div className={`w-1 h-1 aura-btn rounded-full ${isProcessing ? 'animate-bounce [animation-delay:0.2s]' : ''}`}></div>
                    <div className={`w-1 h-1 aura-btn rounded-full ${isProcessing ? 'animate-bounce [animation-delay:0.4s]' : ''}`}></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <ReasoningStep label="Context Retrieval" status={workflows[0]?.status === "COMPLETED" ? "SUCCESS" : (isProcessing ? "FETCHING" : "STANDBY")} />
                  <ReasoningStep label="Vertex AI Entity Mapping" status={isProcessing ? "PROCESSING" : (workflows[0]?.status === "COMPLETED" ? "SUCCESS" : "STANDBY")} />
                  <ReasoningStep label="Cross-App Integration" status={isProcessing ? "ACTIVE" : (workflows[0]?.status === "COMPLETED" ? "SUCCESS" : "STANDBY")} />
                  <ReasoningStep label="Google Maps Enrichment" status="WAITING" />
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <div className="p-4 bg-[#0A0A0A] rounded-[2rem] text-[var(--color-aura-bg)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={14} className="text-orange-400" />
                    <p className="text-[10px] text-[#86868B] font-medium tracking-tight">Strategic Insight</p>
                  </div>
                  <p className="text-xs font-medium leading-normal">
                    {isProcessing 
                      ? "Synthesizing optimal workflow graph..." 
                      : (workflows.length > 0 
                          ? `Analysis complete. Found 3 recurring issues in Gmail threads regarding 'API Latency'. Suggest adding to Q3 report?` 
                          : "I'm ready to automate your high-value workflows. Paste a context block to begin.")
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#0A0A0A] hover:bg-[#111111] text-white  py-2 rounded-[1.5rem] text-[10px] font-medium tracking-tight">Approve</Button>
                  <Button className="flex-1 bg-[#0A0A0A] hover:bg-[#111111] text-white  py-2 rounded-[1.5rem] text-[10px] font-medium tracking-tight">Refine</Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Mobile Bottom Navigation Bar (iOS Style) */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-[#0A0A0A]  flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] z-30 opacity-95 backdrop-blur-sm">
          <MobileTab icon={<LayoutDashboard size={20} />} label="Dash" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <MobileTab icon={<Mail size={20} />} label="Triage" isActive={activeTab === "email_triage"} onClick={() => setActiveTab("email_triage")} />
          <MobileTab icon={<Database size={20} />} label="Intel" isActive={activeTab === "intelligence"} onClick={() => setActiveTab("intelligence")} />
          <MobileTab icon={<History size={20} />} label="History" isActive={activeTab === "workflows"} onClick={() => setActiveTab("workflows")} />
        </div>
      </div>

      {/* Bottom Status Bar (Hidden on Mobile) */}
      <footer className="hidden md:flex h-10 bg-[#0A0A0A] text-[var(--color-aura-bg)] px-6 items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#86868B] font-medium tracking-tight">Session Logic Savings</span>
            <span className="text-xs font-medium text-green-400">1.2 hrs saved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#86868B] font-medium tracking-tight">System Throughput</span>
            <span className="text-xs font-medium">10,482 Workflows/Day</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-[10px] text-[#86868B] font-medium tracking-tight">Series A Prototype • GCP Environment: production-01</span>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents
function MobileTab({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${isActive ? "text-[var(--color-aura-accent)]" : "text-[#86868B]"}`}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-tight leading-none">{label}</span>
    </button>
  );
}

function ReasoningStep({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[11px] ${status === "WAITING" || status === "STANDBY" ? "text-[#86868B] italic" : "text-[#86868B]"} font-medium`}>{label}</span>
      <span className={`text-[10px] font-mono font-medium ${
        status === "SUCCESS" ? "text-[#86868B]" : 
        status === "PROCESSING" ? "text-orange-500" : "text-[#86868B]"
      }`}>
        {status}
      </span>
    </div>
  );
}

function StackItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
      <div className={`w-3 h-3 ${color} rounded-[2px]`}></div>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick, collapsed }: { icon: any, label: string, isActive: boolean, onClick: () => void, collapsed: boolean }) {
  return (
    <Button 
      variant="ghost"
      className={`w-full justify-start gap-3 h-10 transition-all rounded-md overflow-hidden ${
        isActive 
          ? "bg-[#111111] text-white font-medium " 
          : "text-[#86868B] hover:bg-[#111111] font-medium "
      }`}
      onClick={onClick}
    >
      <div className={`${isActive ? "text-[var(--color-aura-accent)]" : "text-[#86868B]"}`}>{icon}</div>
      {!collapsed && <span className="text-sm tracking-tight">{label}</span>}
      {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 aura-btn rounded-full"></div>}
    </Button>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string | number, change: string, icon: any }) {
  return (
    <Card className=" hover: transition-colors rounded-[2rem] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-medium text-[#86868B] tracking-tight">{title}</CardTitle>
        <div className="text-[#86868B]">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-medium tracking-tight text-white">{value}</div>
        <p className="text-[10px] text-green-500 mt-1 font-medium">{change}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-[#111111] text-white text-orange-400 ",
    COMPLETED: "bg-[#111111] text-white text-white ",
    FAILED: "bg-[#111111] text-white text-[var(--color-aura-red)] ",
  };
  return (
    <Badge variant="outline" className={`${styles[status as keyof typeof styles]} px-2 py-0.5 text-[9px]  font-medium tracking-wider rounded-sm`}>
      {status}
    </Badge>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-12   rounded-[2rem] flex flex-col items-center justify-center text-[#86868B]">
      <Bot size={32} className="mb-2 opacity-50" />
      <p className="text-[10px] font-medium tracking-tight">{label}</p>
    </div>
  );
}
