
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { format } from "date-fns";

const CalendarEmbed = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      date: date ? format(date, "PPP") : null
    });
    // Here you would typically send this data to your backend
  };

  return (
    <section className="py-20 bg-white border-t-4 border-primary">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-secondary-dark mb-4 uppercase">Let's Connect</h2>
          <p className="text-secondary-dark/80 mb-8 max-w-2xl mx-auto">
            Schedule a call with me to discuss your project, share ideas, or just have a friendly chat about design and technology.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white border-2 border-secondary-dark p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="text-left">
                    <Label htmlFor="name" className="text-secondary-dark uppercase">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1 border-2 border-secondary-dark focus:border-primary focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="text-left">
                    <Label htmlFor="email" className="text-secondary-dark uppercase">E-post</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1 border-2 border-secondary-dark focus:border-primary focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="text-left">
                    <Label htmlFor="subject" className="text-secondary-dark uppercase">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="mt-1 border-2 border-secondary-dark focus:border-primary focus:ring-primary"
                      placeholder="What would you like to discuss?"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <Label className="text-left mb-1 text-secondary-dark uppercase">Select a Date</Label>
                  <div className="border-2 border-secondary-dark rounded-none p-4 flex-1">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                      classNames={{
                        day_selected: "bg-primary text-white hover:bg-primary focus:bg-primary",
                        day_today: "bg-secondary text-secondary-dark",
                      }}
                      required
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-8 px-8 py-3 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                disabled={!date || !formData.name || !formData.email || !formData.subject}
              >
                Schedule Meeting
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalendarEmbed;
