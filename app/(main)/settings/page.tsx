import React from 'react';
import { Settings, MessageCircle, Link, CreditCard, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatbot-name">Chatbot Name</Label>
              <Input id="chatbot-name" defaultValue="My Awesome Chatbot" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="english">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch id="active" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Conversation History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="store-conversations">Store Conversations</Label>
              <Switch id="store-conversations" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger id="retention-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">Export Conversations</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="mr-2 h-5 w-5" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Slack', 'Discord', 'Telegram'].map((platform) => (
              <div key={platform} className="flex items-center justify-between">
                <Label>{platform}</Label>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Current Plan</Label>
              <span className="font-semibold">Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Next Billing Date</Label>
              <span>July 1, 2023</span>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Configure advanced options for your chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full justify-between" variant="outline">
            Open Advanced Settings
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;