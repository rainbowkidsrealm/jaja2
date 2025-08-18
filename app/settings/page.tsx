'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  School, 
  Save,
  Camera,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    ...(isAdmin ? [{ id: 'school', label: 'School Settings', icon: School }] : []),
  ];

  const ProfileSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Change Photo
            </Button>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              defaultValue={profile?.name}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              defaultValue={user?.email}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                className="pl-10"
                defaultValue={(profile as any)?.phone}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {isTeacher && (
            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input 
                id="teacherId" 
                defaultValue={(profile as any)?.teacherId}
                placeholder="Teacher ID"
                disabled
              />
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea 
              id="address" 
              className="pl-10"
              defaultValue={(profile as any)?.address}
              placeholder="Enter your address"
              rows={3}
            />
          </div>
        </div>

        {/* Role-specific fields */}
        {isTeacher && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input 
                id="qualification" 
                defaultValue={(profile as any)?.qualification}
                placeholder="Enter your qualification"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input 
                id="experience" 
                type="number"
                defaultValue={(profile as any)?.experienceYears}
                placeholder="Years of experience"
              />
            </div>
          </div>
        )}

        {isParent && (
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input 
              id="occupation" 
              defaultValue={(profile as any)?.occupation}
              placeholder="Enter your occupation"
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const NotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive urgent notifications via SMS
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          {isParent && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Attendance Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your child is absent
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Homework Reminders</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive homework due date reminders
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Grade Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new grades are posted
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </>
          )}

          {isTeacher && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Assignment Submissions</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when students submit assignments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Parent Messages</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new parent messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">School Announcements</h4>
              <p className="text-sm text-muted-foreground">
                Receive general school announcements
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SecuritySettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-4">Change Password</h4>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Security Options</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Two-Factor Authentication</h5>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Login Notifications</h5>
                <p className="text-sm text-muted-foreground">
                  Get notified of new login attempts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Update Security
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AppearanceSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-4">Theme Preference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <div className="w-full h-20 bg-white border rounded mb-2"></div>
                <p className="text-sm font-medium">Light</p>
              </div>
              <div className="border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <div className="w-full h-20 bg-gray-800 border rounded mb-2"></div>
                <p className="text-sm font-medium">Dark</p>
              </div>
              <div className="border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 border rounded mb-2"></div>
                <p className="text-sm font-medium">System</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Display Options</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Compact Mode</h5>
                <p className="text-sm text-muted-foreground">
                  Show more content in less space
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Sidebar Always Visible</h5>
                <p className="text-sm text-muted-foreground">
                  Keep sidebar open on desktop
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Language</h4>
            <select className="px-3 py-2 border border-border rounded-md bg-background w-48">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Appearance
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SchoolSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          School Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input 
              id="schoolName" 
              defaultValue="Springfield High School"
              placeholder="Enter school name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schoolEmail">School Email</Label>
            <Input 
              id="schoolEmail" 
              type="email"
              defaultValue="info@springfield.edu"
              placeholder="Enter school email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolPhone">School Phone</Label>
            <Input 
              id="schoolPhone" 
              defaultValue="+1-555-0123"
              placeholder="Enter school phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolWebsite">School Website</Label>
            <Input 
              id="schoolWebsite" 
              defaultValue="www.springfield.edu"
              placeholder="Enter school website"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolAddress">School Address</Label>
          <Textarea 
            id="schoolAddress" 
            defaultValue="123 Education Street, Springfield, State 12345"
            placeholder="Enter school address"
            rows={3}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Academic Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <select 
                id="academicYear" 
                className="px-3 py-2 border border-border rounded-md bg-background w-full"
              >
                <option value="2023-24">2023-2024</option>
                <option value="2024-25">2024-2025</option>
                <option value="2025-26">2025-2026</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeSystem">Grade System</Label>
              <select 
                id="gradeSystem" 
                className="px-3 py-2 border border-border rounded-md bg-background w-full"
              >
                <option value="letter">Letter Grades (A, B, C, D, F)</option>
                <option value="percentage">Percentage (0-100)</option>
                <option value="points">Points (0-4.0)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'school':
        return isAdmin ? <SchoolSettings /> : null;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}