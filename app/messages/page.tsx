'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, Search, Send, Eye, Filter, AlertCircle } from 'lucide-react';
import { Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const messages: Message[] = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting Scheduled',
      content: 'Dear parents, we have scheduled a parent-teacher meeting for next week. Please mark your calendars for Monday, January 29th, 2024 at 3:00 PM in the school auditorium.',
      senderId: 1,
      senderType: 'teacher',
      recipientType: 'class_parents',
      classId: 1,
      sectionId: 1,
      isUrgent: false,
      sentAt: '2024-01-22T10:00:00Z',
      isRead: false,
    },
    {
      id: 2,
      title: 'URGENT: School Closure Tomorrow',
      content: 'Due to severe weather conditions, the school will remain closed tomorrow (January 23rd, 2024). All classes and activities are suspended. Please ensure your children stay safe at home.',
      senderId: 2,
      senderType: 'admin',
      recipientType: 'all_parents',
      isUrgent: true,
      sentAt: '2024-01-22T16:30:00Z',
      isRead: true,
    },
    {
      id: 3,
      title: 'Homework Reminder - Mathematics',
      content: 'This is a friendly reminder that the mathematics assignment is due this Friday. If you need any help, please don\'t hesitate to ask during office hours.',
      senderId: 1,
      senderType: 'teacher',
      recipientType: 'specific_parent',
      parentId: 1,
      isUrgent: false,
      sentAt: '2024-01-21T14:15:00Z',
      isRead: true,
    },
    {
      id: 4,
      title: 'Excellent Progress in Science',
      content: 'I wanted to share that your child has shown remarkable improvement in science this semester. Keep up the great work!',
      senderId: 3,
      senderType: 'teacher',
      recipientType: 'specific_parent',
      parentId: 1,
      isUrgent: false,
      sentAt: '2024-01-20T09:45:00Z',
      isRead: false,
    },
    {
      id: 5,
      title: 'Sports Day Announcement',
      content: 'We are excited to announce our annual Sports Day event on February 15th, 2024. More details about events and timings will be shared soon.',
      senderId: 2,
      senderType: 'admin',
      recipientType: 'all_parents',
      isUrgent: false,
      sentAt: '2024-01-19T11:20:00Z',
      isRead: true,
    },
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'unread':
          matchesFilter = !message.isRead;
          break;
        case 'urgent':
          matchesFilter = message.isUrgent;
          break;
        case 'class':
          matchesFilter = message.recipientType === 'class_parents';
          break;
        case 'personal':
          matchesFilter = message.recipientType === 'specific_parent';
          break;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const getMessageIcon = (message: Message) => {
    if (message.isUrgent) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    return <MessageSquare className="h-5 w-5 text-blue-600" />;
  };

  const getSenderName = (message: Message) => {
    // In a real app, you'd fetch this from the sender's profile
    if (message.senderType === 'admin') {
      return 'School Administration';
    }
    return 'Teacher'; // You'd get the actual teacher name from the sender ID
  };

  const getRecipientText = (message: Message) => {
    switch (message.recipientType) {
      case 'all_parents':
        return 'All Parents';
      case 'class_parents':
        return `Grade ${message.classId} Parents`;
      case 'specific_parent':
        return 'You';
      default:
        return '';
    }
  };

  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isAdmin = user?.role === 'admin';

  const unreadCount = messages.filter(m => !m.isRead).length;
  const urgentCount = messages.filter(m => m.isUrgent).length;

  return (
    <Layout title="Messages">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Messages</h2>
            <p className="text-muted-foreground">
              {isTeacher || isAdmin
                ? 'Send announcements and communicate with parents'
                : 'Stay updated with school announcements and messages from teachers'
              }
            </p>
          </div>
          {(isTeacher || isAdmin) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipients</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                      <option value="all_parents">All Parents</option>
                      <option value="class_parents">Class Parents</option>
                      <option value="specific_parent">Specific Parent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="Enter message subject..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Type your message here..."
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="urgent" className="rounded" />
                    <label htmlFor="urgent" className="text-sm">Mark as urgent</label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Send Message</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">All conversations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Messages</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <p className="text-xs text-muted-foreground">High priority</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(m => {
                  const messageDate = new Date(m.sentAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return messageDate >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Recent messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="urgent">Urgent</option>
                  <option value="class">Class Messages</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className={`transition-all hover:shadow-lg ${
              !message.isRead ? 'border-l-4 border-l-blue-600' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-full ${
                      message.isUrgent ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {getMessageIcon(message)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${
                          !message.isRead ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {message.title}
                        </h3>
                        {message.isUrgent && (
                          <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                        )}
                        {!message.isRead && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From: {getSenderName(message)}</span>
                        <span>To: {getRecipientText(message)}</span>
                        <span>{new Date(message.sentAt).toLocaleDateString()}</span>
                        <span>{new Date(message.sentAt).toLocaleTimeString([], { 
                          hour: '2-digit', minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Messages Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'No messages match your search criteria.'
                  : 'You don\'t have any messages yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}