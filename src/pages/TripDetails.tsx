import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Users, Share2, Plus, Check, Pencil, Trash2, X, Save } from "lucide-react";
import { cn } from "../lib/utils";
import { useTrips } from "../contexts/useTrips";
import { useAuth } from "../contexts/useAuth";

export default function TripDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { 
    getTrip, updateTrip, 
    addParticipant, updateParticipant, deleteParticipant,
    addExpense, updateExpense, deleteExpense,
    addItineraryItem, updateItineraryItem, deleteItineraryItem,
    addTransportItem, updateTransportItem, deleteTransportItem 
  } = useTrips();
  
  const trip = id ? getTrip(id) : undefined;
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);
  
  // Title Edit
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  // Add Forms
  const [showPartForm, setShowPartForm] = useState(false);
  const [partName, setPartName] = useState("");
  
  const [showExpForm, setShowExpForm] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expPaidBy, setExpPaidBy] = useState("");
  
  const [showItinForm, setShowItinForm] = useState(false);
  const [itinTitle, setItinTitle] = useState("");
  const [itinDesc, setItinDesc] = useState("");

  const [showTransForm, setShowTransForm] = useState(false);
  const [transTitle, setTransTitle] = useState("");
  const [transDesc, setTransDesc] = useState("");

  // Edit States
  const [editPartId, setEditPartId] = useState<string | null>(null);
  const [editPartName, setEditPartName] = useState("");

  const [editExpId, setEditExpId] = useState<string | null>(null);
  const [editExpTitle, setEditExpTitle] = useState("");
  const [editExpAmount, setEditExpAmount] = useState("");
  const [editExpPaidBy, setEditExpPaidBy] = useState("");

  const [editItinId, setEditItinId] = useState<string | null>(null);
  const [editItinTitle, setEditItinTitle] = useState("");
  const [editItinDesc, setEditItinDesc] = useState("");

  const [editTransId, setEditTransId] = useState<string | null>(null);
  const [editTransTitle, setEditTransTitle] = useState("");
  const [editTransDesc, setEditTransDesc] = useState("");

  if (!trip) {
    return (
      <div className="flex flex-col w-full min-h-[60vh] items-center justify-center pt-32 px-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">Trip not found</h1>
        <p className="text-muted-foreground mt-2">The trip you are looking for doesn't exist or you don't have access.</p>
        <Link to="/trips" className="mt-6 px-6 py-2 bg-primary text-white rounded-full">Go to My Trips</Link>
      </div>
    );
  }

  // Authorization check (if a trip has an ownerEmail, it must match current user)
  if (trip.ownerEmail && trip.ownerEmail !== user?.email) {
    return (
      <div className="flex flex-col w-full min-h-[60vh] items-center justify-center pt-32 px-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">Not Authorized</h1>
        <p className="text-muted-foreground mt-2">You don't have permission to view this trip.</p>
        <Link to="/trips" className="mt-6 px-6 py-2 bg-primary text-white rounded-full">Go to My Trips</Link>
      </div>
    );
  }

  const tabs = ["Overview", "Itinerary", "Expenses", "Participants", "Transportation"];

  const handleInvite = () => {
    const link = `${window.location.origin}/trip/${trip.id}?invite=true`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert(`Invite link: ${link}`);
    });
  };

  const handleTitleSave = () => {
    if (tempTitle.trim() && trip.id) {
      updateTrip(trip.id, { title: tempTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName || !trip.id) return;
    addParticipant(trip.id, { name: partName });
    setPartName("");
    setShowPartForm(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount || !expPaidBy || !trip.id) return;
    addExpense(trip.id, { title: expTitle, amount: parseFloat(expAmount), paidBy: expPaidBy });
    setExpTitle(""); setExpAmount(""); setExpPaidBy("");
    setShowExpForm(false);
  };

  const handleAddItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinTitle || !itinDesc || !trip.id) return;
    addItineraryItem(trip.id, { title: itinTitle, description: itinDesc });
    setItinTitle(""); setItinDesc("");
    setShowItinForm(false);
  };

  const handleAddTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transTitle || !transDesc || !trip.id) return;
    addTransportItem(trip.id, { title: transTitle, description: transDesc });
    setTransTitle(""); setTransDesc("");
    setShowTransForm(false);
  };

  const totalExpenses = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col w-full relative pt-24 pb-16">
      <div className="w-full h-[320px] relative">
        <img src={trip.imageUrl || trip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80"} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-8 flex justify-between items-end">
          <div className="text-white max-w-[1280px] mx-auto w-full">
            <div className="flex items-center gap-4 text-white/90 text-[14px] font-medium tracking-[1.2px] uppercase mb-4">
              <span className="flex items-center gap-1.5"><Calendar size={16}/> {trip.startDate} - {trip.endDate}</span>
              <span className="flex items-center gap-1.5"><Users size={16}/> {trip.travelersCount} Travelers</span>
            </div>
            
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={tempTitle} 
                  onChange={e => setTempTitle(e.target.value)} 
                  onBlur={handleTitleSave}
                  onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                  autoFocus
                  className="bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-xl px-4 py-2 text-[48px] md:text-[64px] font-bold leading-[1.1] w-full max-w-[800px] outline-none"
                />
                <button onClick={handleTitleSave} className="bg-white/20 p-4 rounded-xl hover:bg-white/30 transition-colors">
                  <Check size={24} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 group">
                <h1 className="text-[48px] md:text-[64px] font-bold leading-[1.1]">{trip.title}</h1>
                <button 
                  onClick={() => { setTempTitle(trip.title); setIsEditingTitle(true); }} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 p-3 rounded-full hover:bg-white/30"
                >
                  <Pencil size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 mt-8">
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border scrollbar-hide">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[16px] font-medium whitespace-nowrap transition-colors",
                activeTab === tab 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-orange-50 hover:text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-orange-50 min-h-[400px]">
          {activeTab === "Overview" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-[28px] font-semibold text-foreground">Trip Overview</h2>
                <button onClick={handleInvite} className="flex items-center gap-2 text-primary font-medium hover:bg-orange-50 px-4 py-2 rounded-full transition-colors border border-primary/20">
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  {copied ? "Link Copied!" : "Invite Friends"}
                </button>
              </div>
              <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[800px]">
                {trip.summary || `Get ready for an amazing adventure to ${trip.destinationCity || trip.title}. We've packed the itinerary with great places to see, eat, and stay. Don't forget to check the transportation details and settle expenses before we leave!`}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="bg-[#f6ece3] rounded-[32px] p-8">
                  <h3 className="text-[20px] font-semibold text-foreground mb-4">Quick Stats</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-border/50 pb-4">
                      <span className="text-muted-foreground">Total Budget</span>
                      <span className="font-semibold text-foreground">${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border/50 pb-4">
                      <span className="text-muted-foreground">Travelers</span>
                      <span className="font-semibold text-accent">{trip.travelersCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Expenses" && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[28px] font-semibold text-foreground">Shared Expenses</h2>
                  <p className="text-muted-foreground">Keep track of who paid for what. Total: ${totalExpenses.toFixed(2)}</p>
                </div>
                <button onClick={() => setShowExpForm(!showExpForm)} className="bg-accent text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Add Expense
                </button>
              </div>

              {showExpForm && (
                <form onSubmit={handleAddExpense} className="bg-[#fbf2e8] p-6 rounded-[24px] grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input type="text" placeholder="Title" value={expTitle} onChange={e => setExpTitle(e.target.value)} required className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <input type="number" placeholder="Amount" value={expAmount} onChange={e => setExpAmount(e.target.value)} required min="0" step="0.01" className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <input type="text" placeholder="Paid by" value={expPaidBy} onChange={e => setExpPaidBy(e.target.value)} required className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-primary text-white rounded-xl font-medium">Save</button>
                    <button type="button" onClick={() => setShowExpForm(false)} className="flex-1 bg-white border border-border rounded-xl text-muted-foreground">Cancel</button>
                  </div>
                </form>
              )}

              {trip.expenses.length > 0 ? (
                <div className="bg-background rounded-3xl overflow-hidden border border-border/50">
                  <div className="grid grid-cols-5 p-4 border-b border-border/50 bg-[#fbf2e8] text-[14px] font-semibold text-muted-foreground uppercase tracking-wide">
                    <div className="col-span-2">Description</div>
                    <div>Paid By</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {trip.expenses.map((exp, i) => (
                    <div key={exp.id} className={cn(
                      "grid grid-cols-5 p-4 items-center transition-colors hover:bg-white/50 group",
                      i !== trip.expenses.length - 1 && "border-b border-border/50"
                    )}>
                      {editExpId === exp.id ? (
                        <>
                          <div className="col-span-2 pr-2"><input type="text" value={editExpTitle} onChange={e => setEditExpTitle(e.target.value)} className="w-full bg-white rounded-lg px-3 py-1 outline-none border border-border" /></div>
                          <div className="pr-2"><input type="text" value={editExpPaidBy} onChange={e => setEditExpPaidBy(e.target.value)} className="w-full bg-white rounded-lg px-3 py-1 outline-none border border-border" /></div>
                          <div className="pr-2"><input type="number" value={editExpAmount} onChange={e => setEditExpAmount(e.target.value)} step="0.01" className="w-full text-right bg-white rounded-lg px-3 py-1 outline-none border border-border" /></div>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { updateExpense(trip.id, exp.id, { title: editExpTitle, paidBy: editExpPaidBy, amount: parseFloat(editExpAmount) }); setEditExpId(null); }} className="p-2 text-primary hover:bg-orange-50 rounded-full"><Save size={16} /></button>
                            <button onClick={() => setEditExpId(null)} className="p-2 text-muted-foreground hover:bg-gray-100 rounded-full"><X size={16} /></button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-2 font-medium text-foreground">{exp.title}</div>
                          <div className="text-muted-foreground">{exp.paidBy}</div>
                          <div className="text-right font-semibold text-foreground">${exp.amount.toFixed(2)}</div>
                          <div className="text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditExpId(exp.id); setEditExpTitle(exp.title); setEditExpPaidBy(exp.paidBy); setEditExpAmount(exp.amount.toString()); }} className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-orange-50"><Pencil size={16}/></button>
                            <button onClick={() => deleteExpense(trip.id, exp.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={16}/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No expenses added yet.</div>
              )}
            </div>
          )}

          {activeTab === "Participants" && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[28px] font-semibold text-foreground">Participants</h2>
                  <p className="text-muted-foreground">People joining this adventure.</p>
                </div>
                <button onClick={() => setShowPartForm(!showPartForm)} className="bg-accent text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Add
                </button>
              </div>

              {showPartForm && (
                <form onSubmit={handleAddParticipant} className="bg-[#fbf2e8] p-6 rounded-[24px] flex gap-4 mb-4">
                  <input type="text" placeholder="Name" value={partName} onChange={e => setPartName(e.target.value)} required className="flex-1 bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <button type="submit" className="px-6 bg-primary text-white rounded-xl font-medium">Save</button>
                  <button type="button" onClick={() => setShowPartForm(false)} className="px-6 bg-white border border-border rounded-xl text-muted-foreground">Cancel</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trip.participants.map((p) => (
                  <div key={p.id} className="group bg-white border border-orange-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm relative">
                    {editPartId === p.id ? (
                      <div className="flex w-full gap-2">
                        <input autoFocus type="text" value={editPartName} onChange={e => setEditPartName(e.target.value)} className="flex-1 bg-background rounded-lg px-3 py-1 outline-none border border-primary/30" />
                        <button onClick={() => { updateParticipant(trip.id, p.id, { name: editPartName }); setEditPartId(null); }} className="p-1.5 text-primary hover:bg-orange-50 rounded-full"><Save size={16} /></button>
                        <button onClick={() => setEditPartId(null)} className="p-1.5 text-muted-foreground hover:bg-gray-100 rounded-full"><X size={16} /></button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#ffdbcf] text-accent flex items-center justify-center font-bold shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground flex-1 truncate">{p.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditPartId(p.id); setEditPartName(p.name); }} className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-orange-50"><Pencil size={14}/></button>
                          <button onClick={() => deleteParticipant(trip.id, p.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={14}/></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Itinerary" && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[28px] font-semibold text-foreground">Itinerary</h2>
                  <p className="text-muted-foreground">Plan your daily activities.</p>
                </div>
                <button onClick={() => setShowItinForm(!showItinForm)} className="bg-accent text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Add Item
                </button>
              </div>

              {showItinForm && (
                <form onSubmit={handleAddItinerary} className="bg-[#fbf2e8] p-6 rounded-[24px] flex flex-col gap-4 mb-4">
                  <input type="text" placeholder="Title (e.g., Dinner at Los Caracoles)" value={itinTitle} onChange={e => setItinTitle(e.target.value)} required className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <input type="text" placeholder="Description" value={itinDesc} onChange={e => setItinDesc(e.target.value)} required className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-medium">Save</button>
                    <button type="button" onClick={() => setShowItinForm(false)} className="px-6 py-2 bg-white border border-border rounded-xl text-muted-foreground">Cancel</button>
                  </div>
                </form>
              )}

              {trip.itinerary.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {trip.itinerary.map((item) => (
                    <div key={item.id} className="group bg-white border border-border p-6 rounded-2xl flex gap-4 hover:shadow-sm transition-shadow relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-accent shrink-0" />
                        <div className="w-px h-full bg-border mt-2" />
                      </div>
                      <div className="flex-1 w-full">
                        {editItinId === item.id ? (
                          <div className="flex flex-col gap-3">
                            <input type="text" value={editItinTitle} onChange={e => setEditItinTitle(e.target.value)} className="w-full bg-background rounded-lg px-3 py-2 outline-none border border-primary/30 font-semibold" />
                            <textarea value={editItinDesc} onChange={e => setEditItinDesc(e.target.value)} rows={2} className="w-full bg-background rounded-lg px-3 py-2 outline-none border border-primary/30 text-[14px]" />
                            <div className="flex gap-2">
                              <button onClick={() => { updateItineraryItem(trip.id, item.id, { title: editItinTitle, description: editItinDesc }); setEditItinId(null); }} className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium">Save</button>
                              <button onClick={() => setEditItinId(null)} className="bg-white border border-border text-muted-foreground px-4 py-1.5 rounded-lg text-sm font-medium">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start">
                              <h4 className="text-[18px] font-semibold text-foreground">{item.title}</h4>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditItinId(item.id); setEditItinTitle(item.title); setEditItinDesc(item.description); }} className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-orange-50"><Pencil size={16}/></button>
                                <button onClick={() => deleteItineraryItem(trip.id, item.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={16}/></button>
                              </div>
                            </div>
                            <p className="text-[15px] text-muted-foreground mt-1">{item.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No itinerary items yet.</div>
              )}
            </div>
          )}

          {activeTab === "Transportation" && (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-[28px] font-semibold text-foreground">Transportation</h2>
                  <p className="text-muted-foreground">Flights, trains, and local transits.</p>
                </div>
                <button onClick={() => setShowTransForm(!showTransForm)} className="bg-accent text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Plus size={18} /> Add Transport
                </button>
              </div>

              {showTransForm && (
                <form onSubmit={handleAddTransport} className="bg-[#fbf2e8] p-6 rounded-[24px] flex flex-col gap-4 mb-4">
                  <input type="text" placeholder="Title (e.g., Flight to destination)" value={transTitle} onChange={e => setTransTitle(e.target.value)} required className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <input type="text" placeholder="Description" value={transDesc} onChange={e => setTransDesc(e.target.value)} required className="bg-white rounded-xl px-4 py-2 outline-none border border-border" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-medium">Save</button>
                    <button type="button" onClick={() => setShowTransForm(false)} className="px-6 py-2 bg-white border border-border rounded-xl text-muted-foreground">Cancel</button>
                  </div>
                </form>
              )}

              {trip.transportation.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.transportation.map((t) => (
                    <div key={t.id} className="group bg-white border border-orange-50 p-6 rounded-2xl shadow-sm relative">
                      {editTransId === t.id ? (
                        <div className="flex flex-col gap-3">
                          <input type="text" value={editTransTitle} onChange={e => setEditTransTitle(e.target.value)} className="w-full bg-background rounded-lg px-3 py-2 outline-none border border-primary/30 font-semibold" />
                          <input type="text" value={editTransDesc} onChange={e => setEditTransDesc(e.target.value)} className="w-full bg-background rounded-lg px-3 py-2 outline-none border border-primary/30 text-[14px]" />
                          <div className="flex gap-2">
                            <button onClick={() => { updateTransportItem(trip.id, t.id, { title: editTransTitle, description: editTransDesc }); setEditTransId(null); }} className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium">Save</button>
                            <button onClick={() => setEditTransId(null)} className="bg-white border border-border text-muted-foreground px-4 py-1.5 rounded-lg text-sm font-medium">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <h4 className="text-[18px] font-semibold text-foreground pr-8">{t.title}</h4>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                              <button onClick={() => { setEditTransId(t.id); setEditTransTitle(t.title); setEditTransDesc(t.description); }} className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-orange-50"><Pencil size={16}/></button>
                              <button onClick={() => deleteTransportItem(trip.id, t.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={16}/></button>
                            </div>
                          </div>
                          <p className="text-[15px] text-muted-foreground mt-2 pr-8">{t.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No transportation added yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
