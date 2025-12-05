import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu, X, Calendar, User, Phone, CheckCircle,
  Bike, Clock, ChevronRight, Settings, LogOut, Plus, Trash2,
  Users, AlertCircle
} from 'lucide-react';
// Explicit extensions for browser compatibility
import { api } from './services/mockApi.ts';
import { Booking, Customer, Instructor, Motorcycle } from './types.ts';

// --- Reusable Components ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' }> = ({
  className = '', variant = 'primary', children, ...props
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20",
    secondary: "bg-dark text-white hover:bg-black",
    outline: "border-2 border-brand text-brand hover:bg-brand/5",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-600 ml-1">{label}</label>
    <input
      className={`w-full p-3 rounded-xl border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all ${className}`}
      {...props}
    />
  </div>
);

const SelectCard: React.FC<{
  title: string;
  subtitle?: string;
  image?: string;
  selected: boolean;
  onClick: () => void
}> = ({ title, subtitle, image, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 ${selected ? 'border-brand ring-4 ring-brand/10' : 'border-transparent hover:border-gray-200'
      } bg-white shadow-sm hover:shadow-md`}
  >
    {image && (
      <div className="h-32 w-full bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
    )}
    <div className="p-4">
      <h3 className={`font-bold text-lg ${selected ? 'text-brand' : 'text-gray-900'}`}>{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {selected && (
      <div className="absolute top-2 right-2 bg-brand text-white p-1 rounded-full">
        <CheckCircle size={16} />
      </div>
    )}
  </div>
);

// --- Helpers ---

const getNextDays = () => {
  const days = [];
  // Increased to 30 days to show a broader range
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

// --- View Components ---

const LandingView = ({ onBook, onLogin }: { onBook: () => void, onLogin: () => void }) => (
  <div className="flex flex-col min-h-screen">
    <header className="px-6 py-5 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
          <Bike size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">Motovasiya.az</span>
      </div>
      <button onClick={onLogin} className="text-sm font-medium text-gray-500 hover:text-brand transition-colors">
        Instructor Login
      </button>
    </header>

    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
      <div className="mb-8 p-4 bg-orange-50 rounded-full inline-flex items-center gap-2 text-brand text-sm font-semibold animate-fade-in-up">
        <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
        New courses available
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Master the Ride. <br />
        <span className="text-brand">Safe & Professional.</span>
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-xl">
        Book your professional motorcycle training with expert instructors in minutes.
        Start your journey on two wheels today.
      </p>
      <Button onClick={onBook} className="w-full md:w-auto text-lg px-8 py-4 shadow-xl shadow-brand/20">
        Book a Course Now
      </Button>

      <div className="grid grid-cols-3 gap-4 md:gap-12 mt-16 w-full opacity-70">
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl text-gray-900">500+</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Students</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl text-gray-900">100%</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Safety</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl text-gray-900">4.9</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Rating</span>
        </div>
      </div>
    </main>

    <div className="w-full h-64 md:h-80 bg-gray-100 mt-8 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        className="w-full h-full object-cover opacity-80"
        alt="Motorcycle riding"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
    </div>
  </div>
);

const BookingView = ({
  motorcycles,
  instructors,
  bookings,
  selectedBike,
  setSelectedBike,
  selectedInstructor,
  setSelectedInstructor,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  customerForm,
  setCustomerForm,
  loading,
  onSubmit,
  onBack
}: {
  motorcycles: Motorcycle[];
  instructors: Instructor[];
  bookings: Booking[];
  selectedBike: Motorcycle | null;
  setSelectedBike: (m: Motorcycle | null) => void;
  selectedInstructor: Instructor | null;
  setSelectedInstructor: (i: Instructor | null) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  customerForm: Customer;
  setCustomerForm: (c: Customer) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) => {
  const isSlotBusy = (date: string, time: string) => {
    return bookings.some(b =>
      b.date === date &&
      b.timeSlot === time &&
      b.instructorId === selectedInstructor?.id &&
      b.status !== 'cancelled'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-6 py-4 shadow-sm sticky top-0 z-40 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="rotate-180 text-gray-600" />
        </button>
        <h2 className="font-bold text-lg">New Booking</h2>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Step 1: Select Equipment */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">1</span>
            <h3 className="font-bold text-gray-800">Choose Motorcycle</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motorcycles.map(bike => (
              <SelectCard
                key={bike.id}
                title={bike.name}
                subtitle={bike.description}
                image={bike.image}
                selected={selectedBike?.id === bike.id}
                onClick={() => setSelectedBike(bike)}
              />
            ))}
          </div>
        </section>

        {/* Step 2: Select Instructor */}
        {selectedBike && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">2</span>
              <h3 className="font-bold text-gray-800">Choose Instructor</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instructors.map(inst => (
                <SelectCard
                  key={inst.id}
                  title={`${inst.name} ${inst.surname}`}
                  subtitle={inst.bio}
                  image={inst.photo}
                  selected={selectedInstructor?.id === inst.id}
                  onClick={() => setSelectedInstructor(inst)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Date & Time */}
        {selectedInstructor && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">3</span>
              <h3 className="font-bold text-gray-800">Select Date & Time</h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {getNextDays().map(date => {
                const d = new Date(date);
                const isSelected = selectedDate === date;
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const month = d.toLocaleDateString('en-US', { month: 'short' });

                return (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                    className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-colors ${isSelected ? 'bg-brand text-white border-brand' : 'bg-white border-gray-200 hover:border-brand/50 text-gray-600'
                      }`}
                  >
                    <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{month}</span>
                    <span className="text-xl font-bold leading-none">{dayNum}</span>
                    <span className="text-xs font-medium">{dayName}</span>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map(time => {
                  const busy = isSlotBusy(selectedDate, time);
                  return (
                    <button
                      key={time}
                      disabled={busy}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-lg text-sm font-semibold border transition-all ${busy
                        ? 'bg-red-50 text-red-500 border-red-200 cursor-not-allowed opacity-80'
                        : selectedTime === time
                          ? 'bg-brand text-white border-brand shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-brand'
                        }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Step 4: Details Form */}
        {selectedTime && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">4</span>
              <h3 className="font-bold text-gray-800">Your Details</h3>
            </div>
            <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Name"
                  required
                  value={customerForm.name}
                  onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                />
                <Input
                  label="Surname"
                  required
                  value={customerForm.surname}
                  onChange={e => setCustomerForm({ ...customerForm, surname: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 ml-1">Gender</label>
                  <select
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none bg-white"
                    value={customerForm.gender}
                    onChange={e => setCustomerForm({ ...customerForm, gender: e.target.value as any })}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input
                  label="Age"
                  type="number"
                  required min="16" max="99"
                  value={customerForm.age}
                  onChange={e => setCustomerForm({ ...customerForm, age: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Height (cm)"
                  type="number"
                  required
                  value={customerForm.heightCm}
                  onChange={e => setCustomerForm({ ...customerForm, heightCm: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  required
                  placeholder="+994"
                  value={customerForm.phone}
                  onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Processing...' : 'Request Booking'}
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                By clicking Request, you agree to share your contact info with the instructor.
              </p>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

const SuccessView = ({ customerName, date, time, onBack }: { customerName: string, date: string, time: string, onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
      <CheckCircle size={40} />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Sent!</h2>
    <p className="text-gray-600 mb-8 max-w-md">
      Thanks for your interest, {customerName}. <br />
      We have received your booking request for <strong>{date} at {time}</strong>.
      <br /><br />
      <span className="font-semibold text-brand">We will contact you within 24 hours to confirm.</span>
    </p>
    <Button variant="outline" onClick={onBack}>Back to Home</Button>
  </div>
);

const LoginView = ({ onLogin, onCancel }: { onLogin: (e: React.FormEvent) => void, onCancel: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Instructor Login</h2>
      <form onSubmit={onLogin} className="space-y-6">
        <Input label="Email Address" name="email" type="email" required placeholder="narmin@motovasiya.az" />
        <Button type="submit" className="w-full">Access Dashboard</Button>
      </form>
      <button onClick={onCancel} className="w-full text-center mt-6 text-sm text-gray-500 hover:text-gray-900">
        Cancel
      </button>
    </div>
  </div>
);

const AdminDashboard = ({
  currentUser,
  onLogout,
  bookings,
  setBookings,
  motorcycles,
  setMotorcycles
}: {
  currentUser: Instructor | null,
  onLogout: () => void,
  bookings: Booking[],
  setBookings: (b: Booking[]) => void,
  motorcycles: Motorcycle[],
  setMotorcycles: (m: Motorcycle[]) => void
}) => {
  const [tab, setTab] = useState<'requests' | 'instructors' | 'bikes'>('requests');
  const [allInsts, setAllInsts] = useState<Instructor[]>([]);

  // Refresh data for admin
  useEffect(() => {
    const refresh = async () => {
      try {
        console.log('Refreshing admin data...');
        const bookingsData = await api.getBookings();
        console.log('Bookings:', bookingsData);
        setBookings(bookingsData);
        const instData = await api.getAllInstructorsAdmin();
        console.log('Instructors:', instData);
        setAllInsts(instData);
        const bikesData = await api.getAllMotorcyclesAdmin();
        console.log('Motorcycles:', bikesData);
        setMotorcycles(bikesData);
      } catch (error) {
        console.error('Error refreshing admin data:', error);
      }
    };
    refresh();
  }, [tab, setBookings, setMotorcycles]);

  const myBookings = bookings.filter(b => currentUser?.isAdmin ? true : b.instructorId === currentUser?.id).reverse();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
            {currentUser?.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-sm">{currentUser?.name}</h3>
            <span className="text-xs text-gray-500">{currentUser?.isAdmin ? 'Administrator' : 'Instructor'}</span>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setTab('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'requests' ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Clock size={18} /> Requests
          </button>
          {currentUser?.isAdmin && (
            <>
              <button onClick={() => setTab('instructors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'instructors' ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Users size={18} /> Instructors
              </button>
              <button onClick={() => setTab('bikes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'bikes' ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Bike size={18} /> Motorcycles
              </button>
            </>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-12">
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 capitalize">{tab}</h2>

        {tab === 'requests' && (
          <div className="space-y-4">
            {myBookings.length === 0 && <p className="text-gray-500">No requests yet.</p>}
            {myBookings.map(bk => (
              <div key={bk.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${bk.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {bk.status}
                    </span>
                    <span className="text-sm text-gray-400">{new Date(bk.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-lg">{bk.customer.name} {bk.customer.surname}</h3>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p className="flex items-center gap-2"><Phone size={14} /> {bk.customer.phone}</p>
                    <p className="flex items-center gap-2"><Calendar size={14} /> {bk.date} @ {bk.timeSlot}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${bk.customer.phone}`} className="p-3 bg-brand text-white rounded-lg hover:bg-brand-dark">
                    <Phone size={18} />
                  </a>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this request?')) {
                        api.deleteBooking(bk.id).then(() => {
                          setBookings(bookings.filter(b => b.id !== bk.id));
                        });
                      }
                    }}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    title="Remove Request"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'instructors' && (
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 mb-4 text-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>In this demo, adding/removing instructors updates the local mock database. Changes persist until browser cache is cleared.</p>
            </div>
            {allInsts.map(inst => (
              <div key={inst.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={inst.photo} className="w-12 h-12 rounded-full object-cover bg-gray-200" alt="" />
                  <div>
                    <h4 className="font-bold">{inst.name} {inst.surname}</h4>
                    <p className="text-xs text-gray-500">{inst.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{inst.bio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const name = prompt("Edit Name:", inst.name) || inst.name;
                      const surname = prompt("Edit Surname:", inst.surname) || inst.surname;
                      const email = prompt("Edit Email:", inst.email) || inst.email;
                      const bio = prompt("Edit Bio:", inst.bio) || inst.bio;

                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = async (e: any) => {
                        const file = e.target?.files?.[0];
                        await api.updateInstructor(inst.id, { name, surname, email, bio, photo: file });
                        const updated = await api.getAllInstructorsAdmin();
                        setAllInsts(updated);
                      };
                      if (confirm('Upload new photo?')) {
                        input.click();
                      } else {
                        api.updateInstructor(inst.id, { name, surname, email, bio }).then(async () => {
                          const updated = await api.getAllInstructorsAdmin();
                          setAllInsts(updated);
                        });
                      }
                    }}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      api.toggleInstructorStatus(inst.id).then(() => {
                        // Force refresh by creating new object array
                        const updated = allInsts.map(i => i.id === inst.id ? { ...i, active: !i.active } : i);
                        setAllInsts(updated);
                      });
                    }}
                    className={`text-xs font-bold px-3 py-1 rounded-full ${inst.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {inst.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${inst.name} ${inst.surname}?`)) {
                        api.deleteInstructor(inst.id).then(() => {
                          setAllInsts(allInsts.filter(i => i.id !== inst.id));
                        });
                      }
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    title="Remove Instructor"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const name = prompt("Enter Instructor Name:");
                if (!name) return;
                const surname = prompt("Enter Instructor Surname:");
                if (!surname) return;
                const email = prompt("Enter Instructor Email:");
                if (!email) return;
                const bio = prompt("Enter Instructor Bio:");
                if (!bio) return;
                const isAdmin = confirm("Is this instructor an admin?");

                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (e: any) => {
                  const file = e.target?.files?.[0];
                  await api.addInstructor({
                    name,
                    surname,
                    email,
                    bio,
                    photo: file,
                    active: true,
                    isAdmin
                  });
                  const updated = await api.getAllInstructorsAdmin();
                  setAllInsts(updated);
                };
                input.click();
              }}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:border-brand hover:text-brand transition-colors"
            >
              <Plus size={20} />
              <span className="font-semibold">Add Instructor</span>
            </button>
          </div>
        )}

        {tab === 'bikes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {motorcycles.map(bike => (
              <div key={bike.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="h-40 bg-gray-100">
                  <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg">{bike.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{bike.description}</p>
                  <button onClick={() => {
                    api.deleteMotorcycle(bike.id).then(() => {
                      setMotorcycles(motorcycles.filter(m => m.id !== bike.id));
                    })
                  }} className="mt-4 text-red-500 text-sm hover:underline flex items-center gap-1">
                    <Trash2 size={14} /> Remove Motorcycle
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const name = prompt("Enter Motorcycle Name:");
                const description = prompt("Enter Description:") || 'New fleet addition';
                if (name) {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e: any) => {
                    const file = e.target?.files?.[0];
                    await api.addMotorcycle({
                      name,
                      description,
                      active: true,
                      image: file
                    });
                    const updated = await api.getAllMotorcyclesAdmin();
                    setMotorcycles(updated);
                  };
                  input.click();
                }
              }}
              className="h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-brand hover:text-brand transition-colors"
            >
              <Plus size={32} />
              <span className="font-semibold mt-2">Add Motorcycle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  // Views: 'landing', 'booking', 'success', 'login', 'admin'
  const [view, setView] = useState('landing');
  const [loading, setLoading] = useState(false);

  // Data State
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Booking Flow State
  const [selectedBike, setSelectedBike] = useState<Motorcycle | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerForm, setCustomerForm] = useState<Customer>({
    name: '', surname: '', gender: 'Male', age: 18, heightCm: 170, phone: ''
  });

  // Admin State
  const [currentUser, setCurrentUser] = useState<Instructor | null>(null);

  // Initialize Data
  const loadData = useCallback(async () => {
    setLoading(true);
    const [insts, bikes] = await Promise.all([
      api.getInstructors(),
      api.getMotorcycles(),
    ]);
    setInstructors(insts);
    setMotorcycles(bikes);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike || !selectedInstructor || !selectedDate || !selectedTime) return;

    setLoading(true);
    await api.createBooking({
      motorcycleId: selectedBike.id,
      instructorId: selectedInstructor.id,
      date: selectedDate,
      timeSlot: selectedTime,
      customer: customerForm
    });
    setLoading(false);
    setView('success');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = (e.target as any).email.value;

    try {
      const { instructor } = await api.login(emailInput);
      setCurrentUser(instructor);
      setView('admin');
    } catch (error) {
      alert('Instructor not found. Try narmin@motovasiya.az');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const resetBooking = () => {
    setSelectedBike(null);
    setSelectedInstructor(null);
    setSelectedDate('');
    setSelectedTime('');
    setView('landing');
  };

  // Render Logic
  switch (view) {
    case 'booking':
      return (
        <BookingView
          motorcycles={motorcycles}
          instructors={instructors}
          bookings={bookings}
          selectedBike={selectedBike}
          setSelectedBike={setSelectedBike}
          selectedInstructor={selectedInstructor}
          setSelectedInstructor={setSelectedInstructor}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          customerForm={customerForm}
          setCustomerForm={setCustomerForm}
          loading={loading}
          onSubmit={handleBookingSubmit}
          onBack={() => setView('landing')}
        />
      );
    case 'success':
      return (
        <SuccessView
          customerName={customerForm.name}
          date={selectedDate}
          time={selectedTime}
          onBack={resetBooking}
        />
      );
    case 'login':
      return (
        <LoginView
          onLogin={handleLogin}
          onCancel={() => setView('landing')}
        />
      );
    case 'admin':
      return (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          bookings={bookings}
          setBookings={setBookings}
          motorcycles={motorcycles}
          setMotorcycles={setMotorcycles}
        />
      );
    default:
      return (
        <LandingView
          onBook={() => setView('booking')}
          onLogin={() => setView('login')}
        />
      );
  }
};

export default App;