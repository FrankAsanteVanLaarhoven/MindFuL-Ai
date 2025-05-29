
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Phone, MessageCircle, Plus, Edit, Trash, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: 'primary' | 'secondary' | 'backup';
  canReceiveAlerts: boolean;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+1-555-0123',
      email: 'sarah@example.com',
      priority: 'primary',
      canReceiveAlerts: true
    }
  ]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    priority: 'secondary',
    canReceiveAlerts: true
  });
  const { toast } = useToast();

  const addContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone,
      email: newContact.email || '',
      priority: newContact.priority || 'secondary',
      canReceiveAlerts: newContact.canReceiveAlerts || true
    };

    setContacts([...contacts, contact]);
    setNewContact({ priority: 'secondary', canReceiveAlerts: true });
    setIsAddingContact(false);
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts`,
      duration: 3000,
    });
  };

  const callContact = (contact: EmergencyContact) => {
    window.location.href = `tel:${contact.phone}`;
    toast({
      title: `Calling ${contact.name}`,
      description: "Emergency call initiated",
      duration: 5000,
    });
  };

  const textContact = (contact: EmergencyContact) => {
    const message = "Emergency: I need help. Please contact me immediately.";
    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
    toast({
      title: `Texting ${contact.name}`,
      description: "Emergency text sent",
      duration: 3000,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'primary': return 'bg-red-100 text-red-800';
      case 'secondary': return 'bg-orange-100 text-orange-800';
      case 'backup': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Manage your emergency contacts and instant communication
            </CardDescription>
          </div>
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newContact.name || ''}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select value={newContact.relationship} onValueChange={(value) => setNewContact({...newContact, relationship: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                      <SelectItem value="neighbor">Neighbor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newContact.phone || ''}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email || ''}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={newContact.priority} onValueChange={(value: 'primary' | 'secondary' | 'backup') => setNewContact({...newContact, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Contact</SelectItem>
                      <SelectItem value="secondary">Secondary Contact</SelectItem>
                      <SelectItem value="backup">Backup Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addContact} className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.relationship}</p>
                <p className="text-sm text-gray-500">{contact.phone}</p>
                {contact.email && <p className="text-xs text-gray-400">{contact.email}</p>}
              </div>
              <Badge className={getPriorityColor(contact.priority)}>
                {contact.priority}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => callContact(contact)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
              <Button
                onClick={() => textContact(contact)}
                variant="outline"
                className="border-blue-500 text-blue-700"
                size="sm"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Text
              </Button>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No emergency contacts added yet</p>
            <p className="text-sm">Add contacts to enable instant emergency communication</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
